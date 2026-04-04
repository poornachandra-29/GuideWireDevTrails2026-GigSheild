from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import hashlib
from typing import Optional
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.worker import Worker, PlatformType, ShiftType, PlanType, StatusType
from app.models.policy import Policy
from app.routers.auth import redis_client
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
        raise HTTPException(409, "Aadhaar already registered.")
        
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
        raise HTTPException(404, "Worker ID not found")
        
    city = redis_client.get(f"session:{phone}:city") or "Hyderabad"
    
    # Check if worker already exists to prevent IntegrityError on refreshing or retrying
    existing_worker = db.query(Worker).filter(Worker.worker_id == req.worker_id).first()
    if existing_worker:
        worker = existing_worker
    else:
        worker = Worker(
            worker_id=req.worker_id,
            phone=phone,
            aadhaar_hash=redis_client.get(f"session:{phone}:aadhaar") or rider["aadhaar_hash"],
            pan_hash=redis_client.get(f"session:{phone}:pan") or rider["pan"],
            upi_id=redis_client.get(f"session:{phone}:upi") or rider["upi_id"],
            platform=PlatformType[req.platform],
            city=city,
            zone=rider["zone"],
            enrollment_lat=float(redis_client.get(f"session:{phone}:lat") or rider["enrollment_gps"]["lat"]),
            enrollment_lng=float(redis_client.get(f"session:{phone}:lng") or rider["enrollment_gps"]["lng"]),
            vehicle_type="2-wheeler",
            tenure_weeks=rider["tenure_weeks"],
            shift_type=ShiftType[rider["shift_type"]],
            plan=PlanType[rider["plan"]],
            status=StatusType.active,
            baseline_ready=True
        )
        db.add(worker)
        try:
            db.commit()
            db.refresh(worker)
        except Exception:
            db.rollback()
            raise HTTPException(400, "Error saving worker or worker already exists.")
    
    from app.ml.risk_model import score_rider, calculate_premium, get_coverage_by_plan
    with open("data/city_config.json") as f:
        city_config = json.load(f)["cities"] # Fixed bug here, was returning root object
    with open("data/zone_risk.json") as f:
        zone_risk = json.load(f)["zones"] # Fixed bug here too
        
    risk = score_rider(rider, city_config, zone_risk, datetime.datetime.now().month)
    prem = calculate_premium(risk["risk_score"], rider, city_config, zone_risk, datetime.datetime.now().month)
    cov = get_coverage_by_plan(rider["plan"])
    
    policy_num = f"GS-{req.platform[:3].upper()}-{datetime.datetime.now().year}-{req.worker_id.split('-')[-1]}"
    
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
        try:
            db.commit()
        except:
            db.rollback()
    
    return {
        "policy_number": policy_num,
        "plan": rider["plan"],
        "weekly_premium": prem["weekly_premium"],
        "risk_score": risk["risk_score"],
        "coverage_ratio": cov["coverage_ratio"],
        "max_daily_payout": cov["max_daily_payout"],
        "baseline_ready": True,
        "shap_explanation": risk["shap_explanation"]
    }
