import math

def predict_trigger_probability(city: str, forecast_data: dict, historical_trend: list) -> dict:
    daily_probs = []
    week_max = 0.0
    
    for day in forecast_data.get("days", []):
        date_str = day["date"]
        # Dummy actual check logic instead of OWM 5-day for simplicity
        f_aqi = day.get("aqi", 100)
        f_rain = day.get("rainfall_mm", 0)
        f_wind = day.get("wind_kmph", 10)
        f_temp = day.get("temp_celsius", 30)
        f_vis = day.get("visibility_m", 1000)
        
        # P = 1 / (1 + exp(-k * (forecast_value - threshold)))
        def sig(val, thr, k):
            return 1.0 / (1.0 + math.exp(-k * (val - thr)))
            
        p_aqi = sig(f_aqi, 300, 0.05)
        p_rain = sig(f_rain, 115, 0.1)
        p_wind = sig(f_wind, 60, 0.1)
        p_temp = sig(f_temp, 45, 0.1)
        # Visibility logic inverse
        p_vis = sig(50, f_vis, 0.1) 
        
        c_prob = 1.0 - ((1.0 - p_aqi) * (1.0 - p_rain) * (1.0 - p_wind) * (1.0 - p_temp) * (1.0 - p_vis))
        
        week_max = max(week_max, c_prob)
        
        reasons = {"AQI": p_aqi, "Rain": p_rain, "Wind": p_wind, "Heat": p_temp, "Fog": p_vis}
        highest_risk = max(reasons, key=reasons.get)
        
        daily_probs.append({
            "date": date_str,
            "probability": round(c_prob, 2),
            "highest_risk": highest_risk
        })
        
    rec = "No action needed."
    if week_max > 0.60:
        rec = "Extend coverage window from trigger day only to trigger_day - 12 hours through trigger_day + 36 hours."
        
    return {
        "city": city,
        "daily_probabilities": daily_probs,
        "week_max_probability": round(week_max, 2),
        "recommendation": rec
    }
