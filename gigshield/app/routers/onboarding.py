from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import hashlib
from typing import Optional
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.worker import Worker, PlatformType, ShiftType, PlanType, StatusType
from app.models.policy import Policy
from app.redis_client import redis_client
from jose import jwt, JWTError
from config.settings import settings
import json
from fastapi.security import OAuth2PasswordBearer
import datetime

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/otp/verify")

def get_current_user_phone(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        phone = payload.get("sub")
        if phone is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return phone
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

class KYCRequest(BaseModel):
    aadhaar: str
    pan: str

class GPSRequest(BaseModel):
    lat: float
    lng: float

class UPIRequest(BaseModel):
    upi_id: str

class PlatformLinkRequest(BaseModel):
    worker_id: str
    platform: str

@router.post("/kyc")
def kyc_check(req: KYCRequest, phone: str = Depends(get_current_user_phone), db: Session = Depends(get_db)):
    if len(req.aadhaar) != 12:
        raise HTTPException(400, "Aadhaar must be 12 digits")
        
    aadhaar_hash = hashlib.sha256(req.aadhaar.encode()).hexdigest()
    
    existing = db.query(Worker).filter(Worker.aadhaar_hash == aadhaar_hash).first()
    if existing:
        # Already registered is fine for demo re-runs
        redis_client.setex(f"session:{phone}:aadhaar", 3600, aadhaar_hash)
        return {"verified": True, "name_on_record": "Already Verified"}
        
    pan_hash = hashlib.sha256(req.pan.encode()).hexdigest()
    
    redis_client.setex(f"session:{phone}:aadhaar", 3600, aadhaar_hash)
    redis_client.setex(f"session:{phone}:pan", 3600, pan_hash)
    
    return {"verified": True, "name_on_record": "Mock Verified Name"}

@router.post("/gps")
def gps_check(req: GPSRequest, phone: str = Depends(get_current_user_phone)):
    with open("data/city_config.json") as f:
        city_config = json.load(f)["cities"]
        
    closest_city = "Unknown"
    min_dist = float('inf')
    from app.services.gps_service import haversine_distance
    
    for city, conf in city_config.items():
        dist = haversine_distance(req.lat, req.lng, conf["center_gps"]["lat"], conf["center_gps"]["lng"])
        if dist < min_dist:
            min_dist = dist
            closest_city = city
            
    if min_dist > 50:
        closest_city = "Hyderabad" # Mock fallback for demo
        
    redis_client.setex(f"session:{phone}:city", 3600, closest_city)
    redis_client.setex(f"session:{phone}:lat", 3600, str(req.lat))
    redis_client.setex(f"session:{phone}:lng", 3600, str(req.lng))
    
    return {"city": closest_city, "confirmed": True}

@router.post("/upi")
def upi_check(req: UPIRequest, phone: str = Depends(get_current_user_phone)):
    if "@" not in req.upi_id:
        raise HTTPException(400, "Invalid UPI format")
        
    redis_client.setex(f"session:{phone}:upi", 3600, req.upi_id)
    return {"validated": True, "upi_id": req.upi_id}

@router.post("/platform-link")
def link_platform(req: PlatformLinkRequest, phone: str = Depends(get_current_user_phone), db: Session = Depends(get_db)):
    with open("data/riders.json") as f:
        riders = json.load(f)
        
    rider = next((r for r in riders if r["worker_id"] == req.worker_id), None)
    if not rider:
        # Fallback for demo users not in the 22k JSON
        rider = {
            "worker_id": req.worker_id,
            "name": "Guest Rider",
            "city": redis_client.get(f"session:{phone}:city") or "Hyderabad",
            "zone": "HITEC City",
            "tenure_weeks": 52,
            "shift_type": "day",
            "plan": "shield",
            "platform": req.platform,
            "aadhaar_hash": "mock_hash",
            "pan": "ABCDE1234F",
            "upi_id": "demo@upi",
            "enrollment_gps": {"lat": 17.4474, "lng": 78.3762}
        }
        
    city = redis_client.get(f"session:{phone}:city") or "Hyderabad"
    
    # Primary Identity: Authenticated Phone Number
    existing_worker = db.query(Worker).filter(Worker.phone == phone).first()
    if existing_worker:
        worker = existing_worker
        # Reuse existing worker and update with current session ID
        worker.worker_id = req.worker_id
        db.commit()
    else:
        # Secondary fallback: only create if phone not found
        worker = Worker(
            worker_id=req.worker_id,
            phone=phone,
            aadhaar_hash=riders[0]["aadhaar_hash"] if not rider.get("aadhaar_hash") else rider["aadhaar_hash"], # Use fallback if needed
            pan_hash=rider.get("pan", "ABCDE1234F"),
            upi_id=rider.get("upi_id", "demo@upi"),
            platform=PlatformType[req.platform],
            city=city,
            zone=rider.get("zone", "HITEC City"),
            enrollment_lat=float(rider.get("enrollment_gps", {}).get("lat", 17.4474)),
            enrollment_lng=float(rider.get("enrollment_gps", {}).get("lng", 78.3762)),
            vehicle_type="2-wheeler",
            tenure_weeks=rider.get("tenure_weeks", 52),
            shift_type=ShiftType[rider.get("shift_type", "day")],
            plan=PlanType[rider.get("plan", "shield")],
            status=StatusType.active,
            baseline_ready=True
        )
        db.add(worker)
        try:
            db.commit()
            db.refresh(worker)
        except Exception as e:
            db.rollback()
            # If still fails (Unique key collision of ID/Aadhaar from another old test), just bypass
            print(f"!!! Final worker save bypass for demo: {e}")
            worker = db.query(Worker).filter((Worker.worker_id == req.worker_id) | (Worker.phone == phone)).first()
            if not worker:
                raise HTTPException(400, "Critial database error: could not identify worker session.")
    
    try:
        from app.ml.risk_model import score_rider, calculate_premium, get_coverage_by_plan
        with open("data/city_config.json") as f:
            city_config = json.load(f)["cities"]
        with open("data/zone_risk.json") as f:
            zone_risk = json.load(f)["zones"]
            
        risk = score_rider(rider, city_config, zone_risk, datetime.datetime.now().month)
        prem = calculate_premium(risk["risk_score"], rider, city_config, zone_risk, datetime.datetime.now().month)
        cov = get_coverage_by_plan(rider["plan"])
        
        # Add random suffix to ensure Policy Number is always unique during demo testing
        policy_num = f"GS-{req.platform[:3].upper()}-{datetime.datetime.now().year}-{req.worker_id.split('-')[-1]}-{hashlib.md5(str(datetime.datetime.now()).encode()).hexdigest()[:4]}"
        
        existing_policy = db.query(Policy).filter(Policy.worker_id == worker.id).first()
        if not existing_policy:
            policy = Policy(
                policy_number=policy_num,
                worker_id=worker.id,
                plan=PlanType[rider["plan"]],
                weekly_premium=prem["weekly_premium"],
                coverage_ratio=cov["coverage_ratio"],
                max_daily_payout=cov["max_daily_payout"],
                risk_score=risk["risk_score"],
                status=StatusType.active,
                valid_from=datetime.datetime.utcnow().date(),
                valid_to=(datetime.datetime.utcnow() + datetime.timedelta(days=7)).date(),
                shap_explanation={"text": risk["shap_explanation"]}
            )
            db.add(policy)
            db.commit()
    except Exception as e:
        db.rollback()
        print(f"!!! Error creating policy (falling back): {e}")
        # Final desperate fallback to ensure Dashboard works
        if not db.query(Policy).filter(Policy.worker_id == worker.id).first():
            policy = Policy(
                policy_number=f"GS-GEN-{datetime.datetime.now().year}-{worker.id}",
                worker_id=worker.id,
                plan=PlanType.shield,
                weekly_premium=450.0,
                coverage_ratio=0.75,
                max_daily_payout=1500,
                risk_score=50.0,
                status=StatusType.active,
                valid_from=datetime.datetime.utcnow().date(),
                valid_to=(datetime.datetime.utcnow() + datetime.timedelta(days=7)).date(),
                shap_explanation={"text": "Standard protection activated."}
            )
            db.add(policy)
            db.commit()
    
    return {
        "policy_number": "Policy Active",
        "baseline_ready": True
    }
