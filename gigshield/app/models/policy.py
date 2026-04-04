import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, DateTime, Date, Enum as SQLEnum, ForeignKey, JSON
from app.database import Base
from app.models.worker import GUID, PlanType, StatusType

class Policy(Base):
    __tablename__ = "policies"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    policy_number = Column(String, unique=True)
    worker_id = Column(GUID(), ForeignKey("workers.id"))
    plan = Column(SQLEnum(PlanType))
    weekly_premium = Column(Float)
    coverage_ratio = Column(Float)
    max_daily_payout = Column(Float)
    risk_score = Column(Float)
    status = Column(SQLEnum(StatusType))
    valid_from = Column(Date)
    valid_to = Column(Date)
    auto_renew = Column(Boolean, default=True)
    shap_explanation = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
