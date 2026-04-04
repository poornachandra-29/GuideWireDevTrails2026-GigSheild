import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Enum as SQLEnum, ForeignKey
from app.database import Base
from app.models.worker import GUID
from app.models.payout import FraudDecision

class FraudScore(Base):
    __tablename__ = "fraud_scores"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    worker_id = Column(GUID(), ForeignKey("workers.id"))
    trigger_event_id = Column(GUID(), ForeignKey("trigger_events.id"))
    isolation_forest_score = Column(Float)
    velocity_flag = Column(Boolean)
    gps_distance_flag = Column(Boolean)
    device_match_score = Column(Float)
    account_age_flag = Column(Boolean)
    payout_outlier_flag = Column(Boolean)
    cross_platform_flag = Column(Boolean)
    gps_velocity_spoof_flag = Column(Boolean)
    gps_jitter_spoof_flag = Column(Boolean)
    zone_consistency_flag = Column(Boolean)
    final_score = Column(Float)
    decision = Column(SQLEnum(FraudDecision))
    reviewer_id = Column(String, nullable=True)
    reviewer_decision = Column(String, nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
