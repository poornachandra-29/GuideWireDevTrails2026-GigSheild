from app.tasks.celery_app import celery_app
import httpx
import json
from config.settings import settings

from app.database import SessionLocal
from app.models.worker import Worker, StatusType
from app.models.trigger_event import TriggerEvent, TriggerType, EventStatusType

def calculate_indian_aqi(pm25):
    # Simplified Indian AQI calculation based on PM2.5 breakpoints
    if pm25 <= 30: return int((50/30) * pm25)
    elif pm25 <= 60: return int(50 + ((100-50)/(60-30)) * (pm25-30))
    elif pm25 <= 90: return int(100 + ((200-100)/(90-60)) * (pm25-60))
    elif pm25 <= 120: return int(200 + ((300-200)/(120-90)) * (pm25-90))
    elif pm25 <= 250: return int(300 + ((400-300)/(250-120)) * (pm25-120))
    else: return int(400 + ((500-400)/(500-250)) * (pm25 - 250))

@celery_app.task
def poll_all_cities():
    api_key = settings.openweather_api_key
    if not api_key or api_key == "your_openweather_api_key_here":
        print("Missing real OpenWeather API key. Skipping polling.")
        return

    db = SessionLocal()
    try:
        # Get unique cities with active workers — use first worker's GPS per city for hyper-local accuracy
        cities_with_workers = db.query(Worker.city, Worker.enrollment_lat, Worker.enrollment_lng).filter(
            Worker.status == StatusType.active
        ).distinct(Worker.city).all()
        
        for city, rider_lat, rider_lng in cities_with_workers:
            if not city:
                continue
            try:
                # Use actual rider GPS coordinates, fall back to geocoding only if GPS missing
                if rider_lat and rider_lng:
                    lat, lon = rider_lat, rider_lng
                    print(f"[{city}] Using rider GPS: {lat:.4f}, {lon:.4f}")
                else:
                    geo_url = f"http://api.openweathermap.org/geo/1.0/direct?q={city},IN&limit=1&appid={api_key}"
                    geo_res = httpx.get(geo_url).json()
                    if not geo_res:
                        print(f"Could not geocode city: {city}")
                        continue
                    lat, lon = geo_res[0]["lat"], geo_res[0]["lon"]

                # 2. Weather at rider's zone GPS
                weather_url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
                w_res = httpx.get(weather_url).json()
                
                temp = w_res.get("main", {}).get("temp", 0)
                wind_kmh = w_res.get("wind", {}).get("speed", 0) * 3.6
                rain_1h = w_res.get("rain", {}).get("1h", 0.0)

                # 3. AQI at rider's zone GPS — raw PM2.5 → Indian AQI
                aqi_url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={api_key}"
                aqi_res = httpx.get(aqi_url).json()
                
                aqi_val = 0
                if "list" in aqi_res and len(aqi_res["list"]) > 0:
                    pm25 = aqi_res["list"][0]["components"].get("pm2_5", 0)
                    aqi_val = calculate_indian_aqi(pm25)

                print(f"[{city}] Temp: {temp}°C, Wind: {wind_kmh:.1f}km/h, Rain: {rain_1h}mm, AQI: {aqi_val} (GPS: {lat:.4f},{lon:.4f})")

                # Configure standard trigger thresholds for triggering
                triggers = []
                if rain_1h >= 10.0: triggers.append((TriggerType.rainfall, float(rain_1h), 10.0))
                if temp >= 45.0: triggers.append((TriggerType.heat, float(temp), 45.0))
                if wind_kmh >= 40.0: triggers.append((TriggerType.wind, float(wind_kmh), 40.0))
                if aqi_val >= 300: triggers.append((TriggerType.aqi, float(aqi_val), 300.0))

                for t_type, t_val, t_thresh in triggers:
                    active_events = db.query(TriggerEvent).filter(
                        TriggerEvent.city == city,
                        TriggerEvent.trigger_type == t_type,
                        TriggerEvent.status == EventStatusType.active
                    ).first()
                    
                    if not active_events:
                        new_event = TriggerEvent(
                            city=city,
                            trigger_type=t_type,
                            trigger_value=t_val,
                            threshold_value=t_thresh,
                        )
                        db.add(new_event)
                        db.commit()
                        db.refresh(new_event)
                        # Dispatch payout evaluation
                        process_trigger_event.delay(str(new_event.id))
            except Exception as e:
                print(f"Error polling city {city}: {e}")
                
    finally:
        db.close()

@celery_app.task
def process_trigger_event(trigger_event_id: str):
    from app.services.payout_service import process_trigger_event_sync
    process_trigger_event_sync(trigger_event_id, False)
