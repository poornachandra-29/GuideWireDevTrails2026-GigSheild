import math
import statistics

def haversine_distance(lat1, lng1, lat2, lng2) -> float:
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng / 2)**2
    c = 2 * math.asin(math.sqrt(a))
    return R * c

def check_city_radius(worker, current_lat, current_lng) -> dict:
    from config.settings import settings
    dist = haversine_distance(worker.enrollment_lat, worker.enrollment_lng, current_lat, current_lng)
    flag = dist > settings.gps_max_radius_km
    return {"within_radius": not flag, "distance_km": dist, "flag": flag}

def parse_iso_timestamp(ts_str: str):
    from datetime import datetime
    if ts_str.endswith("Z"):
        ts_str = ts_str[:-1]
    return datetime.fromisoformat(ts_str)

def check_velocity_spoof(gps_pings) -> dict:
    from config.settings import settings
    sorted_pings = sorted(gps_pings, key=lambda p: parse_iso_timestamp(p['timestamp']))
    max_speed = 0.0
    spoofed = False
    
    for i in range(len(sorted_pings) - 1):
        p1 = sorted_pings[i]
        p2 = sorted_pings[i+1]
        dist = haversine_distance(p1['lat'], p1['lng'], p2['lat'], p2['lng'])
        t1 = parse_iso_timestamp(p1['timestamp'])
        t2 = parse_iso_timestamp(p2['timestamp'])
        time_hours = (t2 - t1).total_seconds() / 3600.0
        
        if time_hours > 0:
            speed = dist / time_hours
            if speed > max_speed:
                max_speed = speed
            if speed > settings.gps_max_speed_kmph:
                spoofed = True
                
    return {"spoofed": spoofed, "max_speed_kmph": max_speed, "flag": spoofed}

def check_jitter_spoof(gps_pings) -> dict:
    from config.settings import settings
    if len(gps_pings) < 2:
        return {"spoofed": False, "lat_std": 0.0, "lng_std": 0.0, "flag": False}
        
    lats = [p['lat'] for p in gps_pings]
    lngs = [p['lng'] for p in gps_pings]
    
    lat_std = statistics.stdev(lats)
    lng_std = statistics.stdev(lngs)
    
    spoofed = False
    if lat_std < settings.gps_jitter_spoof_threshold and lng_std < settings.gps_jitter_spoof_threshold:
        spoofed = True
        
    return {"spoofed": spoofed, "lat_std": lat_std, "lng_std": lng_std, "flag": spoofed}

def check_zone_consistency(worker, recent_zone) -> dict:
    consistent = (worker.zone == recent_zone)
    flag = not consistent
    return {
        "consistent": consistent,
        "flag": flag,
        "note": "Zone mismatch detected" if flag else "Zone consistent"
    }

def full_gps_check(worker, current_gps, gps_pings) -> dict:
    radius_check = check_city_radius(worker, current_gps['lat'], current_gps['lng'])
    velocity_check = check_velocity_spoof(gps_pings)
    jitter_check = check_jitter_spoof(gps_pings)
    
    # We lack recent_zone here, assuming worker.zone is the standard for simplicity 
    # if not provided directly in recent earnings
    # For demo, if they are out of radius, consider it inconsistent broadly
    zone_check = check_zone_consistency(worker, worker.zone) # Dummy standard

    gps_fraud_score = 0
    if velocity_check["flag"]: gps_fraud_score += 60
    if jitter_check["flag"]: gps_fraud_score += 50
    if radius_check["flag"]: gps_fraud_score += 40
    if zone_check["flag"]: gps_fraud_score += 15
    
    gps_fraud_score = min(100, gps_fraud_score)
    
    return {
        "radius_check": radius_check,
        "velocity_check": velocity_check,
        "jitter_check": jitter_check,
        "zone_check": zone_check,
        "gps_fraud_score": gps_fraud_score,
        "flags": {
            "velocity_spoof_flag": velocity_check["flag"],
            "jitter_spoof_flag": jitter_check["flag"],
            "outside_radius_flag": radius_check["flag"],
            "zone_inconsistent": zone_check["flag"]
        }
    }
