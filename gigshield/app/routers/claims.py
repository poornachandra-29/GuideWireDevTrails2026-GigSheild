from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.routers.onboarding import get_current_user_phone
from app.models.payout import Payout
from app.models.worker import Worker
from app.models.trigger_event import TriggerEvent
from app.models.dispute import Dispute

router = APIRouter()

class DisputeRequest(BaseModel):
    trigger_type: str
    is_fake_data: bool
    issue_description: str

@router.post("/dispute")
def create_dispute(req: DisputeRequest, phone: str = Depends(get_current_user_phone), db: Session = Depends(get_db)):
    worker = db.query(Worker).filter(Worker.phone == phone).first()
    if not worker:
        raise HTTPException(404, "Worker not found")
        
    dispute = Dispute(
        worker_id=worker.id,
        trigger_type=req.trigger_type,
        is_fake_data=req.is_fake_data,
        issue_description=req.issue_description
    )
    db.add(dispute)
    db.commit()
    db.refresh(dispute)
    return {"message": "Dispute lodged successfully. Admin team will review.", "dispute_id": str(dispute.id)}

@router.get("/disputes/me")
def get_my_disputes(phone: str = Depends(get_current_user_phone), db: Session = Depends(get_db)):
    worker = db.query(Worker).filter(Worker.phone == phone).first()
    if not worker:
        return []
    
    disputes = db.query(Dispute).filter(Dispute.worker_id == worker.id).order_by(Dispute.created_at.desc()).all()
    return [{
        "id": str(d.id),
        "trigger_type": d.trigger_type,
        "is_fake_data": d.is_fake_data,
        "issue_description": d.issue_description,
        "status": d.status,
        "created_at": str(d.created_at)
    } for d in disputes]

@router.get("/me")
def get_claims(phone: str = Depends(get_current_user_phone), db: Session = Depends(get_db)):
    worker = db.query(Worker).filter(Worker.phone == phone).first()
    if not worker:
        raise HTTPException(404, "Worker not found")
        
    payouts = db.query(Payout).filter(Payout.worker_id == worker.id).all()
    res = []
    for p in payouts:
        trigger = db.query(TriggerEvent).filter(TriggerEvent.id == p.trigger_event_id).first()
        res.append({
            "payout_id": str(p.id),
            "date": str(p.created_at.date()),
            "trigger_type": trigger.trigger_type.value if trigger else "unknown",
            "amount": p.total_payout,
            "status": p.phase2_status.value if p.phase2_status != "pending" else p.phase1_status.value
        })
    return res

@router.get("/{payout_id}/breakdown")
def get_claim_breakdown(payout_id: str, phone: str = Depends(get_current_user_phone), db: Session = Depends(get_db)):
    worker = db.query(Worker).filter(Worker.phone == phone).first()
    if not worker:
        raise HTTPException(404, "Worker not found")
        
    p = db.query(Payout).filter(Payout.id == payout_id, Payout.worker_id == worker.id).first()
    if not p:
        raise HTTPException(404, "Payout not found")
        
    trigger = db.query(TriggerEvent).filter(TriggerEvent.id == p.trigger_event_id).first()
    
    return {
        "payout_id": str(p.id),
        "trigger_type": trigger.trigger_type.value if trigger else "unknown",
        "trigger_date": str(trigger.triggered_at.date()) if trigger else "",
        "baseline_earnings": p.baseline_earnings,
        "trigger_week_earnings": p.trigger_week_earnings,
        "income_gap": p.income_gap,
        "coverage_ratio": p.coverage_ratio,
        "coverage_ratio_label": f"Coverage {p.coverage_ratio*100}%",
        "zone_modifier": p.zone_modifier,
        "zone_modifier_label": f"Zone factor {p.zone_modifier}",
        "consistency_multiplier": p.consistency_multiplier,
        "consistency_multiplier_label": f"Consistency factor {p.consistency_multiplier}",
        "subtotal": p.total_payout - p.loyalty_bonus,
        "loyalty_bonus": p.loyalty_bonus,
        "loyalty_bonus_label": f"Loyalty bonus {p.loyalty_bonus}",
        "total_payout": p.total_payout,
        "phase1_amount": p.phase1_amount,
        "phase1_status": p.phase1_status.value,
        "phase2_amount": p.phase2_amount,
        "phase2_status": p.phase2_status.value,
        "fraud_score": p.fraud_score,
        "fraud_decision": p.fraud_decision.value,
        "formula_text": p.formula_text
    }
