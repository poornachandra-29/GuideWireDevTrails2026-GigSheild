import uuid
import enum
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, Enum as SQLEnum
from app.database import Base
from app.models.worker import GUID

class TriggerType(enum.Enum):
    aqi = "aqi"
    rainfall = "rainfall"
    wind = "wind"
    heat = "heat"
    fog = "fog"

class EventStatusType(enum.Enum):
    active = "active"
    settled = "settled"

class TriggerEvent(Base):
    __tablename__ = "trigger_events"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    city = Column(String)
    trigger_type = Column(SQLEnum(TriggerType))
    trigger_value = Column(Float)
    threshold_value = Column(Float)
    triggered_at = Column(DateTime, default=datetime.utcnow)
    eligible_rider_count = Column(Integer, default=0)
    approved_count = Column(Integer, default=0)
    blocked_count = Column(Integer, default=0)
    total_payout_phase1 = Column(Float, default=0.0)
    total_payout_phase2 = Column(Float, default=0.0)
    status = Column(SQLEnum(EventStatusType), default=EventStatusType.active)
