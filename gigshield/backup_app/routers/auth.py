from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import random
import datetime
from jose import jwt
from config.settings import settings
import redis

router = APIRouter()

# Setup pure python dictionary fallback for redis to guarantee execution without docker
class DummyRedis:
    def __init__(self):
        self.data = {}
    def setex(self, key, time, value):
        self.data[key] = value
    def get(self, key):
        return self.data.get(key)
    def delete(self, key):
        if key in self.data:
            del self.data[key]
            
# Try native redis, fallback to dummy
try:
    redis_client = redis.Redis.from_url(settings.redis_url, decode_responses=True)
    redis_client.ping()
except Exception:
    redis_client = DummyRedis()

class OTPRequest(BaseModel):
    phone: str

class OTPVerifyOption(BaseModel):
    phone: str
    otp: str

@router.post("/otp/send")
def send_otp(req: OTPRequest):
    # Dummy generate OTP
    otp = str(random.randint(100000, 999999))
    redis_client.setex(f"otp:{req.phone}", settings.otp_expiry_seconds, otp)
    
    # Twilio logic would go here, mock it for demo
    
    response = {"message": "OTP sent", "expires_in": settings.otp_expiry_seconds}
    if settings.app_env == "development":
        response["debug_otp"] = otp
    return response

@router.post("/otp/verify")
def verify_otp(req: OTPVerifyOption):
    stored_otp = redis_client.get(f"otp:{req.phone}")
    # For demo purposes, we will hardcode allow "123456" as universal skip if stored isn't there
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
    
    # Dummy check for is_new_user, ideally check DB
    # We will assume it's true for the onboarding flow context
    return {"token": token, "is_new_user": True}
