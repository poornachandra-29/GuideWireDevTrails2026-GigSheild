import json
import random
import hashlib
from datetime import datetime, timedelta
from faker import Faker

faker = Faker('en_IN')
random.seed(42)
Faker.seed(42)

CITY_CONFIG = {
  "cities": {
    "Delhi": {
      "trigger_days_per_year": 32, "risk_tier": "high", "city_multiplier": 1.3,
      "center_gps": {"lat": 28.6139, "lng": 77.2090},
      "seasonal_loading": {"1": 8, "2": 6, "3": 2, "4": 0, "5": 1, "6": 3, "7": 4, "8": 3, "9": 2, "10": 8, "11": 8, "12": 7},
      "trigger_thresholds": {"aqi": 300, "rainfall_mm": 115, "wind_kmph": 60, "temp_celsius": 45, "visibility_m": 50}
    },
    "Mumbai": {
      "trigger_days_per_year": 16, "risk_tier": "medium", "city_multiplier": 1.0,
      "center_gps": {"lat": 19.0760, "lng": 72.8777},
      "seasonal_loading": {"1": 0, "2": 0, "3": 1, "4": 2, "5": 3, "6": 6, "7": 6, "8": 6, "9": 4, "10": 2, "11": 1, "12": 0},
      "trigger_thresholds": {"aqi": 300, "rainfall_mm": 115, "wind_kmph": 60, "temp_celsius": 45, "visibility_m": 50}
    },
    "Hyderabad": {
      "trigger_days_per_year": 28, "risk_tier": "high", "city_multiplier": 1.3,
      "center_gps": {"lat": 17.3850, "lng": 78.4867},
      "seasonal_loading": {"1": 1, "2": 2, "3": 5, "4": 5, "5": 5, "6": 3, "7": 2, "8": 2, "9": 3, "10": 3, "11": 2, "12": 1},
      "trigger_thresholds": {"aqi": 300, "rainfall_mm": 115, "wind_kmph": 60, "temp_celsius": 45, "visibility_m": 50}
    },
    "Chennai": {
      "trigger_days_per_year": 7, "risk_tier": "low", "city_multiplier": 0.75,
      "center_gps": {"lat": 13.0827, "lng": 80.2707},
      "seasonal_loading": {"1": 1, "2": 0, "3": 0, "4": 1, "5": 2, "6": 2, "7": 2, "8": 2, "9": 2, "10": 4, "11": 4, "12": 2},
      "trigger_thresholds": {"aqi": 300, "rainfall_mm": 115, "wind_kmph": 60, "temp_celsius": 45, "visibility_m": 50}
    },
    "Bengaluru": {
      "trigger_days_per_year": 6, "risk_tier": "low", "city_multiplier": 0.75,
      "center_gps": {"lat": 12.9716, "lng": 77.5946},
      "seasonal_loading": {"1": 0, "2": 0, "3": 1, "4": 2, "5": 3, "6": 3, "7": 2, "8": 2, "9": 3, "10": 3, "11": 2, "12": 0},
      "trigger_thresholds": {"aqi": 300, "rainfall_mm": 115, "wind_kmph": 60, "temp_celsius": 45, "visibility_m": 50}
    },
    "Kolkata": {
      "trigger_days_per_year": 14, "risk_tier": "medium", "city_multiplier": 1.0,
      "center_gps": {"lat": 22.5726, "lng": 88.3639},
      "seasonal_loading": {"1": 2, "2": 1, "3": 1, "4": 2, "5": 3, "6": 4, "7": 5, "8": 5, "9": 4, "10": 2, "11": 1, "12": 2},
      "trigger_thresholds": {"aqi": 300, "rainfall_mm": 115, "wind_kmph": 60, "temp_celsius": 45, "visibility_m": 50}
    }
  }
}

ZONE_RISK = {
  "zones": {
    "Delhi": {
      "Rohini": {"waterlog_score": 7, "aqi_percentile": 0.85},
      "Dwarka": {"waterlog_score": 6, "aqi_percentile": 0.75},
      "Connaught Place": {"waterlog_score": 4, "aqi_percentile": 0.65},
      "Noida Border": {"waterlog_score": 8, "aqi_percentile": 0.90},
      "Saket": {"waterlog_score": 3, "aqi_percentile": 0.55}
    },
    "Mumbai": {
      "Andheri":  {"waterlog_score": 8, "aqi_percentile": 0.70},
      "Bandra":   {"waterlog_score": 5, "aqi_percentile": 0.50},
      "Dharavi":  {"waterlog_score": 9, "aqi_percentile": 0.80},
      "Worli":    {"waterlog_score": 4, "aqi_percentile": 0.45},
      "Kurla":    {"waterlog_score": 9, "aqi_percentile": 0.75}
    },
    "Hyderabad": {
      "HITEC City":    {"waterlog_score": 8, "aqi_percentile": 0.88},
      "Jubilee Hills": {"waterlog_score": 2, "aqi_percentile": 0.30},
      "Secunderabad":  {"waterlog_score": 5, "aqi_percentile": 0.60},
      "Kukatpally":    {"waterlog_score": 7, "aqi_percentile": 0.72},
      "Mehdipatnam":   {"waterlog_score": 6, "aqi_percentile": 0.65}
    },
    "Chennai": {
      "Tambaram":   {"waterlog_score": 6, "aqi_percentile": 0.55},
      "Adyar":      {"waterlog_score": 4, "aqi_percentile": 0.35},
      "Anna Nagar": {"waterlog_score": 3, "aqi_percentile": 0.30},
      "Perambur":   {"waterlog_score": 7, "aqi_percentile": 0.65},
      "Velachery":  {"waterlog_score": 8, "aqi_percentile": 0.60}
    },
    "Bengaluru": {
      "Whitefield":   {"waterlog_score": 5, "aqi_percentile": 0.55},
      "Koramangala":  {"waterlog_score": 4, "aqi_percentile": 0.40},
      "Marathahalli": {"waterlog_score": 7, "aqi_percentile": 0.65},
      "HSR Layout":   {"waterlog_score": 3, "aqi_percentile": 0.35},
      "Yeshwanthpur": {"waterlog_score": 6, "aqi_percentile": 0.60}
    },
    "Kolkata": {
      "Dum Dum":     {"waterlog_score": 8, "aqi_percentile": 0.80},
      "Salt Lake":   {"waterlog_score": 6, "aqi_percentile": 0.60},
      "Park Street": {"waterlog_score": 5, "aqi_percentile": 0.55},
      "Howrah":      {"waterlog_score": 9, "aqi_percentile": 0.85},
      "New Town":    {"waterlog_score": 4, "aqi_percentile": 0.45}
    }
  }
}

def generate_riders():
    city_dist = {
        "Delhi": 220, "Mumbai": 200, "Hyderabad": 180,
        "Chennai": 150, "Bengaluru": 150, "Kolkata": 100
    }
    platforms = ["zomato"] * 60 + ["swiggy"] * 40
    plans = ["basic"] * 40 + ["shield"] * 40 + ["pro"] * 20
    shifts = ["day"] * 55 + ["mixed"] * 30 + ["night"] * 15
    
    riders = []
    
    for city, count in city_dist.items():
        for i in range(count):
            plat = random.choice(platforms)
            pfx = "ZMT" if plat == "zomato" else "SWG"
            wid = f"{pfx}-{random.randint(10000, 99999)}"
            name = faker.name()
            phone = "9" + "".join([str(random.randint(0, 9)) for _ in range(9)])
            aadhaar = "".join([str(random.randint(0, 9)) for _ in range(12)])
            aadhaar_hash = hashlib.sha256(aadhaar.encode()).hexdigest()
            pan = "".join(random.choices("ABCDEFGHIJKLMNOPQRSTUVWXYZ", k=5)) + \
                  "".join(random.choices("0123456789", k=4)) + \
                  random.choice("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
            upi_id = name.split(" ")[0].lower() + "@upi"
            zone = random.choice(list(ZONE_RISK["zones"][city].keys()))
            lat = CITY_CONFIG["cities"][city]["center_gps"]["lat"] + random.uniform(-0.15, 0.15)
            lng = CITY_CONFIG["cities"][city]["center_gps"]["lng"] + random.uniform(-0.15, 0.15)
            tenure = random.randint(1, 104)
            shift = random.choice(shifts)
            plan = random.choice(plans)
            created = (datetime.now() - timedelta(weeks=tenure)).strftime("%Y-%m-%d")
            
            r = {
                "worker_id": wid,
                "name": name,
                "phone": phone,
                "aadhaar_hash": aadhaar_hash,
                "pan": pan,
                "upi_id": upi_id,
                "platform": plat,
                "city": city,
                "zone": zone,
                "enrollment_gps": {"lat": lat, "lng": lng},
                "vehicle_type": "2-wheeler",
                "tenure_weeks": tenure,
                "shift_type": shift,
                "plan": plan,
                "account_created_date": created,
                "status": "active",
                "is_gps_spoof_demo": False
            }
            riders.append(r)
            
    # Add special demo riders
    riders.extend([
        {
            "worker_id": "ZMT-DEMO1", "name": "Fraud Demo Rider One", "phone": "9000000001",
            "aadhaar_hash": hashlib.sha256(b"111111111111").hexdigest(), "pan": "ABCDE1234F", "upi_id": "demo1@upi",
            "platform": "zomato", "city": "Delhi", "zone": "Rohini",
            "enrollment_gps": {"lat": 28.7041, "lng": 77.1025}, "vehicle_type": "2-wheeler",
            "tenure_weeks": 20, "shift_type": "day", "plan": "shield", "account_created_date": "2025-01-01",
            "status": "active", "is_gps_spoof_demo": True, "spoof_type": "velocity",
            "note": "GPS pings show impossible speed Delhi to Chennai in 2 hours"
        },
        {
            "worker_id": "ZMT-DEMO2", "name": "Fraud Demo Rider Two", "phone": "9000000002",
            "aadhaar_hash": hashlib.sha256(b"222222222222").hexdigest(), "pan": "ABCDE1234F", "upi_id": "demo2@upi",
            "platform": "zomato", "city": "Mumbai", "zone": "Andheri",
            "enrollment_gps": {"lat": 19.1136, "lng": 72.8697}, "vehicle_type": "2-wheeler",
            "tenure_weeks": 20, "shift_type": "day", "plan": "shield", "account_created_date": "2025-01-01",
            "status": "active", "is_gps_spoof_demo": True, "spoof_type": "zero_jitter",
            "note": "All 5 GPS pings have exactly identical coordinates — spoofed"
        },
        {
            "worker_id": "ZMT-DEMO3", "name": "Ravi Kumar Demo", "phone": "9876543210",
            "aadhaar_hash": hashlib.sha256(b"123456789012").hexdigest(), "pan": "ABCDE1234F", "upi_id": "ravi.demo@upi",
            "platform": "zomato", "city": "Hyderabad", "zone": "HITEC City",
            "enrollment_gps": {"lat": 17.4474, "lng": 78.3762}, "vehicle_type": "2-wheeler",
            "tenure_weeks": 58, "shift_type": "day", "plan": "shield", "account_created_date": "2024-01-01",
            "status": "active", "is_gps_spoof_demo": False,
            "note": "Clean rider for happy path demo flow"
        }
    ])
    return riders

def generate_earnings_history(riders):
    history = []
    today = datetime.now().date()
    
    for rider in riders:
        weeks_to_gen = min(rider["tenure_weeks"], 8)
        if weeks_to_gen < 1: weeks_to_gen = 1
        
        plan = rider["plan"]
        shift = rider["shift_type"]
        wid = rider["worker_id"]
        city = rider["city"]
        zone_dict = ZONE_RISK["zones"][city].get(rider["zone"], {"aqi_percentile": 0.5})
        zone_aqi = int(zone_dict["aqi_percentile"] * 400)
        
        if plan == "basic": base_e = random.randint(1500, 2500)
        elif plan == "shield": base_e = random.randint(2800, 4500)
        else: base_e = random.randint(5000, 8000)
        
        baseline_ready = weeks_to_gen >= 4
        
        for w in range(1, weeks_to_gen + 1):
            if shift == "day": earn = int(base_e * random.uniform(0.92, 1.08))
            elif shift == "mixed": earn = int(base_e * random.uniform(0.82, 1.18))
            else: earn = int(base_e * random.uniform(0.88, 1.12))
            
            # Special logic for ZMT-DEMO3 week 8 (trigger week)
            if wid == "ZMT-DEMO3" and w == 8:
                earn = 2600
                d_active = 4
            else:
                d_active = random.choice([5, 6, 7]) if random.random() > 0.3 else random.choice([2, 3, 4])
                
            dels = int(earn / 130)
            
            end_date = today - timedelta(days=(weeks_to_gen - w) * 7)
            start_date = end_date - timedelta(days=6)
            
            delivery_counts = {}
            active_days = random.sample(range(7), d_active)
            for d in range(7):
                date_str = (start_date + timedelta(days=d)).strftime("%Y-%m-%d")
                if d in active_days:
                    # special case for DEMO3 trigger loyalty
                    if wid == "ZMT-DEMO3" and w == 8 and d == 2: # day 3 = index 2
                        delivery_counts[date_str] = 4
                    else:
                        delivery_counts[date_str] = int(dels / d_active)
                else:
                    delivery_counts[date_str] = 0
            
            pings = []
            lat = rider["enrollment_gps"]["lat"]
            lng = rider["enrollment_gps"]["lng"]
            
            if wid == "ZMT-DEMO1" and w == 8:
                # Velocity spoof
                dt = start_date
                pings = [
                    {"lat": lat, "lng": lng, "timestamp": f"{dt}T08:00:00Z"},
                    {"lat": lat + 0.001, "lng": lng + 0.001, "timestamp": f"{dt}T08:45:00Z"},
                    {"lat": 13.0827, "lng": 80.2707, "timestamp": f"{dt}T10:00:00Z"},
                    {"lat": 13.0827, "lng": 80.2707, "timestamp": f"{dt}T10:30:00Z"},
                    {"lat": 13.0827, "lng": 80.2707, "timestamp": f"{dt}T11:00:00Z"}
                ]
            elif wid == "ZMT-DEMO2" and w == 8:
                # Jitter spoof
                dt = start_date
                pings = [
                    {"lat": lat, "lng": lng, "timestamp": f"{dt}T08:00:00Z"},
                    {"lat": lat, "lng": lng, "timestamp": f"{dt}T08:30:00Z"},
                    {"lat": lat, "lng": lng, "timestamp": f"{dt}T09:00:00Z"},
                    {"lat": lat, "lng": lng, "timestamp": f"{dt}T09:30:00Z"},
                    {"lat": lat, "lng": lng, "timestamp": f"{dt}T10:00:00Z"}
                ]
            else:
                for p in range(5):
                    ts = (start_date + timedelta(hours=8 + p)).strftime("%Y-%m-%dT%H:%M:%SZ")
                    pings.append({
                        "lat": lat + random.uniform(-0.003, 0.003),
                        "lng": lng + random.uniform(-0.003, 0.003),
                        "timestamp": ts
                    })
                    
            history.append({
                "worker_id": wid,
                "week_number": w,
                "week_start": start_date.strftime("%Y-%m-%d"),
                "week_end": end_date.strftime("%Y-%m-%d"),
                "total_earnings": earn,
                "total_deliveries": dels,
                "days_active": d_active,
                "average_daily_earnings": earn / d_active if d_active > 0 else 0,
                "delivery_counts_by_day": delivery_counts,
                "zone_aqi_avg": zone_aqi,
                "gps_pings": pings,
                "baseline_ready": baseline_ready
            })
    return history

if __name__ == "__main__":
    import os
    if not os.path.exists("data"): os.makedirs("data")
    
    with open("data/city_config.json", "w") as f:
        json.dump(CITY_CONFIG, f, indent=2)
    with open("data/zone_risk.json", "w") as f:
        json.dump(ZONE_RISK, f, indent=2)
        
    riders = generate_riders()
    history = generate_earnings_history(riders)
    
    with open("data/riders.json", "w") as f:
        json.dump(riders, f, indent=2)
    with open("data/earnings_history.json", "w") as f:
        json.dump(history, f, indent=2)
        
    planes = {"basic": 0, "shield": 0, "pro": 0}
    cities = {"Delhi": 0, "Mumbai": 0, "Hyderabad": 0, "Chennai": 0, "Bengaluru": 0, "Kolkata": 0}
    for r in riders:
        planes[r["plan"]] += 1
        cities[r["city"]] += 1
        
    print(f"Total riders generated: {len(riders)}")
    print(f"By city: Delhi {cities['Delhi']}, Mumbai {cities['Mumbai']}, Hyderabad {cities['Hyderabad']}, Chennai {cities['Chennai']}, Bengaluru {cities['Bengaluru']}, Kolkata {cities['Kolkata']}")
    print(f"By plan: basic {planes['basic']}, shield {planes['shield']}, pro {planes['pro']}")
    print(f"Earnings history records: {len(history)}")
    print("Demo riders: 3 (DEMO1 spoof velocity, DEMO2 spoof jitter, DEMO3 clean happy path)")
    print("Files written: riders.json, earnings_history.json, city_config.json, zone_risk.json")
