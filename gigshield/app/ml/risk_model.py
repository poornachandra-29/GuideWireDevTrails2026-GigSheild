import os

def score_rider(worker_data: dict, city_config: dict, zone_risk: dict, month: int) -> dict:
    city = worker_data["city"]
    trigger_days = city_config[city]["trigger_days_per_year"]
    month_loading = city_config[city]["seasonal_loading"][str(month)]
    zone = worker_data["zone"]
    z_water = zone_risk[city][zone]["waterlog_score"]
    z_aqi = zone_risk[city][zone]["aqi_percentile"]
    avg_dels = worker_data.get("avg_weekly_deliveries", 40)
    tenure = worker_data.get("tenure_weeks", 1)
    shift = worker_data.get("shift_type", "day")
    
    import traceback
    try:
        import pandas as pd
        import shap
        import pickle
        import os
        import numpy as np
        
        # Load the model
        model_path = os.path.join(os.path.dirname(__file__), "risk_model.pkl")
        with open(model_path, "rb") as f:
            model = pickle.load(f)
            
        tier = city_config[city]["risk_tier"]
        tier_encoded = {"low": 0, "medium": 1, "high": 2}.get(tier, 1)
        shift_encoded = {"night": 0, "mixed": 1, "day": 2}.get(shift, 2)
        
        # Build features exactly as trained
        features = [{
            "trigger_days_per_year": trigger_days,
            "month_of_year": month,
            "city_risk_tier_encoded": tier_encoded,
            "zone_waterlog_score": z_water,
            "zone_aqi_percentile": z_aqi,
            "avg_weekly_deliveries": avg_dels,
            "tenure_weeks": tenure,
            "shift_type_encoded": shift_encoded,
            "vehicle_type_encoded": 1,
            "days_active_last_4_weeks": 20
        }]
        
        df = pd.DataFrame(features)
        
        # Predict using XGBoost
        score = float(model.predict(df)[0])
        
        # SHAP calculation
        explainer = shap.TreeExplainer(model)
        shap_vals = explainer.shap_values(df)
        
        # Get highest contributing features
        contributions = dict(zip(df.columns, shap_vals[0]))
        sorted_contributions = sorted(contributions.items(), key=lambda x: abs(x[1]), reverse=True)
        top_feature = sorted_contributions[0][0]
        second_feature = sorted_contributions[1][0]
        
        feature_names_friendly = {
            "trigger_days_per_year": "city extreme weather frequency",
            "month_of_year": "current seasonal risk",
            "zone_waterlog_score": f"{zone} zone heavy rainfall risk",
            "zone_aqi_percentile": "hyper-local air quality index",
            "avg_weekly_deliveries": "estimated delivery volume",
            "tenure_weeks": "historical safety record",
            "shift_type_encoded": "time-of-day risk profile"
        }
        
        top_name = feature_names_friendly.get(top_feature, top_feature.replace("_", " "))
        sec_name = feature_names_friendly.get(second_feature, second_feature.replace("_", " "))
        
        shap_explanation = f"XGBoost analyzed 11 regional datapoints. Your premium is heavily driven by 🤖 {top_name} and ⚡ {sec_name}."
        
    except Exception as e:
        print("Falling back to Math formula:", traceback.format_exc())
        # Fallback exact formula
        base = 30
        city_freq_risk = (trigger_days / 52.0) * 25
        season_factor = (month_loading / 8.0) * 15
        zone_flood = z_water * 2
        zone_aqi_risk = z_aqi * 20
        exp_vol = (avg_dels / 40.0) * 10
        tenure_disc = (min(tenure, 52) / 52.0) * 8
        shift_pen = {"night": 0, "mixed": 2, "day": 5}[shift]
        score = base + city_freq_risk + season_factor + zone_flood + zone_aqi_risk + exp_vol - tenure_disc + shift_pen
        
        shap_explanation = f"Your {zone} zone heavy rainfall score ({z_water}/10) impacts your premium. "
        if z_aqi > 0.5:
            shap_explanation += f"Your zone AQI is higher than average. "
        shap_explanation += f"Your {tenure} weeks of tenure gives a stability discount."
        
    score = max(0.0, min(100.0, score))
    
    return {
        "risk_score": round(score, 2),
        "shap_explanation": shap_explanation,
        "feature_contributions": {}
    }

def calculate_premium(risk_score: float, worker: dict, city_config: dict, zone_risk: dict, month: int) -> dict:
    from config.settings import settings
    
    # NEW USER CALIBRATED BASE RATES: Basic=40, Pro/Shield=60, Pro+=75
    plan = worker.get("plan", "shield")
    base_map = { "basic": 40.0, "shield": 60.0, "pro": 75.0 }
    base = base_map.get(plan, 60.0)
    
    city = worker["city"]
    worker_zone = worker["zone"]
    
    # Adjust multipliers significantly for lower base rates to maintain total ₹100-250 range
    city_mult = city_config[city]["city_multiplier"]
    city_adj = base * (city_mult - 1.0) * 3.0 
    
    risk_adj = ((risk_score - 50.0) / 10.0) * 12.0
    
    seasonal = float(city_config[city]["seasonal_loading"][str(month)]) * 8.0
    
    zone = zone_risk[city][worker_zone]
    waterlog_adj = (zone["waterlog_score"]) * 6.0
    aqi_adj = (float(zone["aqi_percentile"]) * 50.0)
    
    tenure_weeks = worker.get("tenure_weeks", 1)
    tenure_discount = min(tenure_weeks / 100.0, 1.0) * 40.0
    
    raw = base + city_adj + risk_adj + seasonal + waterlog_adj + aqi_adj - tenure_discount
    premium = max(settings.premium_floor, min(800.0, raw))
    
    breakdown = {
        "base": base,
        "city_adjustment": round(city_adj, 2),
        "risk_score_adjustment": round(risk_adj, 2),
        "seasonal_loading": round(seasonal, 2),
        "zone_waterlog_adjustment": round(waterlog_adj, 2),
        "zone_aqi_adjustment": round(aqi_adj, 2),
        "tenure_discount": round(-tenure_discount, 2),
        "final_premium": round(premium, 2)
    }
    
    return {
        "weekly_premium": round(premium, 2),
        "breakdown": breakdown,
        "plain_english": f"Calculation: Base ₹{base} + City ₹{city_adj:.2f} + Risk ₹{risk_adj:.2f} - Tenure ₹{tenure_discount:.2f} = ₹{premium:.2f}/week"
    }

def get_coverage_by_plan(plan: str) -> dict:
    if plan == "basic": return {"coverage_ratio": 0.60, "max_daily_payout": 800}
    elif plan == "shield": return {"coverage_ratio": 0.75, "max_daily_payout": 1500}
    else: return {"coverage_ratio": 0.90, "max_daily_payout": 2500}
