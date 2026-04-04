from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.routers.onboarding import get_current_user_phone
from app.models.policy import Policy
from app.models.worker import Worker
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class UpgradeRequest(BaseModel):
    new_plan: str

@router.get("/me")
def get_policy(phone: str = Depends(get_current_user_phone), db: Session = Depends(get_db)):
    worker = db.query(Worker).filter(Worker.phone == phone).first()
    if not worker:
        raise HTTPException(404, "Worker not found")
        
    policy = db.query(Policy).filter(Policy.worker_id == worker.id).order_by(Policy.created_at.desc()).first()
    if not policy:
        raise HTTPException(404, "Policy not found")
        
    return {
        "policy_number": policy.policy_number,
        "plan": policy.plan.value,
        "weekly_premium": policy.weekly_premium,
        "coverage_ratio": policy.coverage_ratio,
        "max_daily_payout": policy.max_daily_payout,
        "status": policy.status.value,
        "valid_from": str(policy.valid_from),
        "valid_to": str(policy.valid_to),
        "next_renewal": str(policy.valid_to),
        "triggers_covered": ["aqi", "rainfall", "wind", "heat", "fog"],
        "baseline_ready": worker.baseline_ready,
        "baseline_weekly_avg": 5000.0, # Mock 
        "risk_score": policy.risk_score,
        "city": worker.city,
        "zone": worker.zone
    }

@router.get("/me/risk-score")
def get_risk_score(phone: str = Depends(get_current_user_phone), db: Session = Depends(get_db)):
    worker = db.query(Worker).filter(Worker.phone == phone).first()
    policy = db.query(Policy).filter(Policy.worker_id == worker.id).order_by(Policy.created_at.desc()).first()
    return {
        "risk_score": policy.risk_score,
        "weekly_premium": policy.weekly_premium,
        "premium_breakdown": {"base": 30.0, "risk_score_adjustment": 15}, # mock partial
        "shap_explanation": policy.shap_explanation.get("text", "") if policy.shap_explanation else "",
        "last_calculated": str(policy.created_at)
    }

@router.post("/upgrade")
def upgrade_plan(req: UpgradeRequest, phone: str = Depends(get_current_user_phone), db: Session = Depends(get_db)):
    worker = db.query(Worker).filter(Worker.phone == phone).first()
    policy = db.query(Policy).filter(Policy.worker_id == worker.id).order_by(Policy.created_at.desc()).first()
    # Mock upgrade logic
    return {"message": "Plan upgraded"}

@router.get("/me/history")
def get_history(phone: str = Depends(get_current_user_phone), db: Session = Depends(get_db)):
    return []
