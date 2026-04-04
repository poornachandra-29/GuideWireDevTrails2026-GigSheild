from fastapi import APIRouter
from app.routers.auth import redis_client
import json

router = APIRouter()

@router.get("/live")
def get_live_triggers():
    # Attempt to load from redis, else return mock
    cached = redis_client.get("triggers:live")
    if cached:
        try:
            return json.loads(cached)
        except:
            pass
            
    with open("data/city_config.json") as f:
        cities = json.load(f)["cities"]
        
    res = {"cities": {}, "last_updated": "now"}
    for c in cities.keys():
        res["cities"][c] = {
            "aqi": 100,
            "rainfall_mm_hr": 0,
            "wind_kmph": 12,
            "temp_celsius": 30,
            "visibility_m": 1000,
            "status": "clear",
            "active_triggers": [],
            "trigger_probability_7day": 0.1,
            "affected_riders": 0
        }
    return res
