from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.database import get_db
from pydantic import BaseModel
from typing import Optional
from app.models.trigger_event import TriggerEvent, TriggerType
import datetime
import uuid

router = APIRouter()

class SimulateTriggerRequest(BaseModel):
    city: str
    trigger_type: str
    trigger_value: float
    calamity_mode: bool = False # Part 19 addition!

@router.post("/trigger/simulate")
def simulate_trigger(req: SimulateTriggerRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    # Create the trigger event
    event = TriggerEvent(
        id=uuid.uuid4(),
        city=req.city,
        trigger_type=TriggerType[req.trigger_type],
        trigger_value=req.trigger_value,
        threshold_value=300 if req.trigger_type == "aqi" else 115, # simplified
        triggered_at=datetime.datetime.utcnow(),
        status="active"
    )
    db.add(event)
    db.commit()
    
    # Normally this calls celery `process_trigger_event.delay(event.id)`. 
    # Because of environment constraints, we will simulate the task inline/background here!
    from app.services.payout_service import process_trigger_event_sync
    background_tasks.add_task(process_trigger_event_sync, str(event.id), req.calamity_mode)
    
    return {
        "trigger_event_id": str(event.id),
        "eligible_riders": 0, # simulated processing
        "processing": True,
        "message": "Trigger event created. Processing claims..."
    }

class FraudDecisionReq(BaseModel):
    payout_id: str
    decision: str

@router.post("/fraud/decision")
def admin_fraud_decision(req: FraudDecisionReq, db: Session = Depends(get_db)):
    from app.models.payout import Payout, FraudDecision
    payout = db.query(Payout).filter(Payout.id == req.payout_id).first()
    if not payout:
        raise HTTPException(404, "Payout not found")
    payout.fraud_decision = FraudDecision[req.decision]
    db.commit()
    return {"status": "Updated decision to " + req.decision}
