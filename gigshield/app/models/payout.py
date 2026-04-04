import uuid
import enum
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, DateTime, Enum as SQLEnum, ForeignKey
from app.database import Base
from app.models.worker import GUID

class PayoutStatus(enum.Enum):
    pending = "pending"
    sent = "sent"
    failed = "failed"

class FraudDecision(enum.Enum):
    approved = "approved"
    review = "review"
    blocked = "blocked"

class Payout(Base):
    __tablename__ = "payouts"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    worker_id = Column(GUID(), ForeignKey("workers.id"))
    trigger_event_id = Column(GUID(), ForeignKey("trigger_events.id"))
    policy_id = Column(GUID(), ForeignKey("policies.id"))
    baseline_earnings = Column(Float)
    trigger_week_earnings = Column(Float)
    income_gap = Column(Float)
    coverage_ratio = Column(Float)
    zone_modifier = Column(Float)
    consistency_multiplier = Column(Float)
    loyalty_bonus = Column(Float)
    phase1_amount = Column(Float)
    phase2_amount = Column(Float)
    total_payout = Column(Float)
    phase1_status = Column(SQLEnum(PayoutStatus), default=PayoutStatus.pending)
    phase2_status = Column(SQLEnum(PayoutStatus), default=PayoutStatus.pending)
    phase1_razorpay_id = Column(String, nullable=True)
    phase2_razorpay_id = Column(String, nullable=True)
    fraud_score = Column(Float)
    fraud_decision = Column(SQLEnum(FraudDecision))
    formula_text = Column(String)
    deliveries_excluded = Column(Integer, default=0) # Part 19
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
