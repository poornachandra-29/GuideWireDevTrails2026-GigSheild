from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import random
import datetime
from jose import jwt
from config.settings import settings
import json

router = APIRouter()
from app.redis_client import redis_client

class OTPRequest(BaseModel):
    phone: str

class OTPVerifyOption(BaseModel):
    phone: str
    otp: str

@router.post("/otp/send")
def send_otp(req: OTPRequest):
    try:
        # Dummy generate OTP
        otp = str(random.randint(100000, 999999))
        print(f"!!! Generating OTP for {req.phone}: {otp}")
        
        # Safe storage in redis or dummy fallback
        if redis_client:
            redis_client.setex(f"otp:{req.phone}", settings.otp_expiry_seconds, otp)
        
        response = {"message": "OTP sent", "expires_in": settings.otp_expiry_seconds}
        if settings.app_env == "development":
            response["debug_otp"] = otp
        return response
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/rider-lookup/{phone}")
def lookup_rider(phone: str):
    try:
        with open("data/riders.json", "r") as f:
            riders = json.load(f)
        
        rider = next((r for r in riders if r["phone"] == phone), None)
        if not rider:
            raise HTTPException(status_code=404, detail="Rider not found in demo database")
        
        return rider
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/otp/verify")
def verify_otp(req: OTPVerifyOption):
    stored_otp = redis_client.get(f"otp:{req.phone}")
    # Universal bypass for demo
    if stored_otp != req.otp and req.otp != "123456":
        raise HTTPException(status_code=401, detail="Invalid or expired OTP")
        
    redis_client.delete(f"otp:{req.phone}")
    
    payload = {
        "sub": req.phone,
        "type": "auth",
        "iat": datetime.datetime.utcnow(),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=settings.jwt_expiry_hours)
    }
    
    token = jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)
    return {"token": token, "is_new_user": True}
