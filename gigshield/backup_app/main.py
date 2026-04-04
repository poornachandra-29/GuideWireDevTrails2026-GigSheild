from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, onboarding, policy, triggers, claims, admin
from config.settings import settings
from app.database import engine, Base

app = FastAPI(
    title="Seguro Partner API",
    description="Parametric Income Protection for Delivery Partners",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Any for hackathon ease
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    # Only try to create if falling back to SQLite entirely
    if "sqlite" in settings.database_url:
        Base.metadata.create_all(bind=engine)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(onboarding.router, prefix="/onboarding", tags=["Onboarding"])
app.include_router(policy.router, prefix="/policy", tags=["Policy"])
app.include_router(triggers.router, prefix="/triggers", tags=["Triggers"])
app.include_router(claims.router, prefix="/claims", tags=["Claims"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "Seguro Partner API"}
