import json
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.payout import Payout, PayoutStatus, FraudDecision
from app.models.worker import Worker
from app.models.trigger_event import TriggerEvent
from app.models.policy import Policy
from app.models.fraud_score import FraudScore
from config.settings import settings
import datetime

def calculate_full_payout(worker: Worker, trigger_event: TriggerEvent, earnings_history: list, calamity_mode: bool = False, in_trip_deliveries: int = 0) -> dict:
    # In a real app we'd query db for earnings_history. Here we passed the matched worker's list from json
    if len(earnings_history) < 4:
        return {"error": "Baseline not ready"}
        
    last_4_weeks = earnings_history[-4:]
    baseline = sum([w["total_earnings"] for w in last_4_weeks]) / 4.0
    
    # Assume the current trigger week is the last appended week for this simulation
    trigger_week = last_4_weeks[-1]
    actual_earnings = trigger_week["total_earnings"]
    
    # PART 19 In-Trip Coverage logic: Exclude early earnings on trigger day from count
    if in_trip_deliveries > 0:
        # Subtract average delivery value for those in-trip deliveries from actual earnings
        avg_per_delivery = actual_earnings / trigger_week["total_deliveries"] if trigger_week["total_deliveries"] > 0 else 0
        actual_earnings -= avg_per_delivery * in_trip_deliveries
        actual_earnings = max(0, actual_earnings)
        
    # Income gap
    income_gap = max(0, baseline - actual_earnings)
    if income_gap <= 0 and not calamity_mode:
        return {"payout": 0, "reason": "No income gap"}
        
    # Hardcode plan ratios
    plan = worker.plan.value
    cov_ratio = 0.60
    if plan == "shield": cov_ratio = 0.75
    if plan == "pro": cov_ratio = 0.90
    
    # Zone mod
    city_aqi_avg = 318
    zone_aqi = trigger_week["zone_aqi_avg"]
    zone_mod = min(1.20, zone_aqi / city_aqi_avg)
    zone_mod = max(0.85, zone_mod)
    
    # Consistency
    import statistics
    earnings = [w["total_earnings"] for w in last_4_weeks]
    mean_e = statistics.mean(earnings)
    std_e = statistics.stdev(earnings) if len(earnings) > 1 else 0
    cv = std_e / mean_e if mean_e > 0 else 0
    
    cons_mult = 1.0
    if cv > 0.10: cons_mult = 0.95
    if cv > 0.20: cons_mult = 0.90
    if cv > 0.35: cons_mult = 0.85
    
    # Loyalty bonus
    loyalty = 0.0
    # dummy check for today's deliveries via JSON keys
    for k, v in trigger_week["delivery_counts_by_day"].items():
        if v > 0: # dummy just finding any day > 0
            loyalty = 1.0
            break
            
    subtotal = income_gap * cov_ratio * zone_mod * cons_mult
    loyalty_amt = subtotal * settings.loyalty_bonus_ratio if loyalty else 0
    final_payout = subtotal + loyalty_amt
    
    # Cap
    max_daily = 800 if plan == "basic" else 1500 if plan == "shield" else 2500
    final_payout = min(final_payout, max_daily)
    
    phase1 = final_payout * settings.phase1_advance_ratio
    
    # PART 19 Payout acceleration: Calamity mode overrides phase 1 logic to send 100% of max allowed instantly
    if calamity_mode:
        phase1 = final_payout # Send all computed or a base amount
        
    phase2 = final_payout - phase1
    
    return {
        "baseline": baseline,
        "actual": actual_earnings,
        "gap": income_gap,
        "cov_ratio": cov_ratio,
        "zone_mod": zone_mod,
        "cons_mult": cons_mult,
        "subtotal": subtotal,
        "loyalty": loyalty_amt,
        "final": final_payout,
        "phase1": phase1,
        "phase2": phase2,
        "deliveries_excluded": in_trip_deliveries,
        "formula": f"({baseline} - {actual_earnings}) * {cov_ratio} * {zone_mod} * {cons_mult} + {loyalty_amt} = {final_payout}"
    }

def process_trigger_event_sync(trigger_event_id: str, calamity_mode: bool = False):
    db = SessionLocal()
    trigger_event = db.query(TriggerEvent).filter(TriggerEvent.id == trigger_event_id).first()
    if not trigger_event:
        return
        
    policies = db.query(Policy).filter(Policy.status == "active").all()
    count = 0
    blocked = 0
    approved = 0
    
    with open("data/earnings_history.json") as f:
        all_hist = json.load(f)
    
    from app.ml.fraud_model import score_claim
        
    for pol in policies:
        worker = db.query(Worker).filter(Worker.id == pol.worker_id).first()
        if not worker.baseline_ready: continue
        if worker.city != trigger_event.city: continue
        
        hist = [w for w in all_hist if w["worker_id"] == worker.worker_id]
        if not hist: continue
        
        # PART 19 In trip dummy logic
        in_trip = 2 if worker.worker_id == "ZMT-DEMO3" else 0
        
        payout_math = calculate_full_payout(worker, trigger_event, hist, calamity_mode, in_trip)
        if "error" in payout_math: continue
        if payout_math.get("final", 0) <= 0: continue
        
        # GPS Check and Fraud ML
        # Mock gps pings since we are in async mode
        gps_score = 0
        vel_spoof = 0
        jit_spoof = 0
        if "DEMO1" in worker.worker_id:
            gps_score = 100
            vel_spoof = 1
        if "DEMO2" in worker.worker_id:
            gps_score = 90
            jit_spoof = 1
            
        fraud = score_claim({
            "claims_last_7_days": 1,
            "gps_fraud_score": gps_score,
            "velocity_spoof_flag": vel_spoof,
            "jitter_spoof_flag": jit_spoof
        })
        
        fs = FraudScore(
            worker_id=worker.id,
            trigger_event_id=trigger_event.id,
            final_score=fraud["final_fraud_score"],
            decision=FraudDecision[fraud["decision"]]
        )
        db.add(fs)
        
        payout = Payout(
            worker_id=worker.id,
            trigger_event_id=trigger_event.id,
            policy_id=pol.id,
            baseline_earnings=payout_math["baseline"],
            trigger_week_earnings=payout_math["actual"],
            income_gap=payout_math["gap"],
            coverage_ratio=payout_math["cov_ratio"],
            zone_modifier=payout_math["zone_mod"],
            consistency_multiplier=payout_math["cons_mult"],
            loyalty_bonus=payout_math["loyalty"],
            phase1_amount=payout_math["phase1"],
            phase2_amount=payout_math["phase2"],
            total_payout=payout_math["final"],
            deliveries_excluded=payout_math["deliveries_excluded"],
            formula_text=payout_math["formula"],
            fraud_score=fraud["final_fraud_score"],
            fraud_decision=FraudDecision[fraud["decision"]],
            phase1_status=PayoutStatus.sent if fraud["decision"] == "approved" else PayoutStatus.pending
        )
        db.add(payout)
        
        if fraud["decision"] == "blocked": blocked += 1
        else: approved += 1
        count += 1
        
    trigger_event.eligible_rider_count = count
    trigger_event.approved_count = approved
    trigger_event.blocked_count = blocked
    db.commit()
    db.close()
