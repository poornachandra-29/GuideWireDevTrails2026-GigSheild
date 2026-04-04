import os

def score_claim(claim_features: dict) -> dict:
    c_last_7 = claim_features.get("claims_last_7_days", 0)
    gps_score = claim_features.get("gps_fraud_score", 0.0)
    dev_match = claim_features.get("device_match_score", 1.0)
    acc_age = claim_features.get("account_age_days", 100)
    payout_rt = claim_features.get("payout_vs_peer_ratio", 1.0)
    cross_plat = claim_features.get("cross_platform_flag", 0)
    vel_spoof = claim_features.get("velocity_spoof_flag", 0)
    jit_spoof = claim_features.get("jitter_spoof_flag", 0)
    
    try:
        import numpy as np
        from app.ml.train import load_fraud_model
        model = load_fraud_model()
        X = np.array([[c_last_7, gps_score, dev_match, acc_age, payout_rt, cross_plat, vel_spoof, jit_spoof]])
        raw = float(model.decision_function(X)[0])
        normalized = (1.0 - raw) * 50.0
    except Exception:
        # Fallback isolation forest logic
        raw = -1.0 if (gps_score > 50 or cross_plat or vel_spoof or jit_spoof) else 1.0
        normalized = gps_score * 0.5 + c_last_7 * 2
        
    clamped = max(0.0, min(100.0, normalized))
    
    flags = []
    if vel_spoof == 1: 
        clamped += 40
        flags.append("Velocity Spoof")
    if jit_spoof == 1: 
        clamped += 35
        flags.append("Jitter Spoof")
    if cross_plat == 1: 
        clamped += 25
        flags.append("Cross Platform Claim")
        
    final_score = max(0.0, min(100.0, clamped))
    
    decision = "approved"
    from config.settings import settings
    if final_score >= settings.fraud_auto_block_threshold:
        decision = "blocked"
    elif final_score > settings.fraud_auto_approve_threshold:
        decision = "review"
        
    exp = f"Fraud score {final_score:.1f}. "
    if flags:
        exp += f"Flags triggered: {', '.join(flags)}."
    else:
        exp += "No hard flags detected."
        
    return {
        "isolation_forest_raw": raw,
        "final_fraud_score": round(final_score, 1),
        "decision": decision,
        "flags": flags,
        "explanation": exp
    }
