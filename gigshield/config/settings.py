from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # Twilio
    twilio_account_sid: str = ""
    twilio_auth_token: str = ""
    twilio_phone_number: str = ""
    # Razorpay
    razorpay_key_id: str = ""
    razorpay_key_secret: str = ""
    # APIs
    openweather_api_key: str = ""
    cpcb_api_key: str = ""
    # Security
    jwt_secret_key: str = "demo-secret-key-1234567890"
    jwt_algorithm: str = "HS256"
    jwt_expiry_hours: int = 24
    bcrypt_rounds: int = 12
    # DB
    database_url: str = "sqlite:///./gigshield.db"
    redis_url: str = "redis://localhost:6379/0"
    # App
    app_env: str = "development"
    app_port: int = 8000
    frontend_url: str = "http://localhost:5173"
    # OTP
    otp_expiry_seconds: int = 300
    otp_length: int = 6
    # Business
    phase1_advance_ratio: float = 0.40
    fraud_auto_approve_threshold: int = 40
    fraud_auto_block_threshold: int = 71
    gps_max_radius_km: float = 30.0
    gps_max_speed_kmph: float = 120.0
    gps_jitter_spoof_threshold: float = 0.000001
    loyalty_bonus_ratio: float = 0.10
    premium_base: float = 30.0
    premium_floor: float = 28.0
    premium_cap: float = 179.0

@lru_cache()
def get_settings() -> Settings:
    # Manual .env search for robustness if Pydantic defaults fail
    import os
    env_path = os.path.join(os.getcwd(), ".env")
    if os.path.exists(env_path):
        from dotenv import load_dotenv
        load_dotenv(env_path)
        
    s = Settings()
    # FORCE STRIP to handle accidental spaces or quotes
    s.openweather_api_key = s.openweather_api_key.strip().replace('"', '').replace("'", "")
    
    if s.openweather_api_key:
        print(f"✅ GIGSHIELD Intelligence: OpenWeather API Key Recognized! ({s.openweather_api_key[:4]}****)")
    else:
        print("🚨 GIGSHIELD Warning: No OpenWeather API Key detected in .env")
    return s

settings = get_settings()
