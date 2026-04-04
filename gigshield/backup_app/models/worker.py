import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.types import TypeDecorator, CHAR
from app.database import Base
import enum

# Custom UUID Type to handle sqlite fallback seamlessly
class GUID(TypeDecorator):
    impl = CHAR
    def load_dialect_impl(self, dialect):
        if dialect.name == 'postgresql':
            return dialect.type_descriptor(PG_UUID())
        else:
            return dialect.type_descriptor(CHAR(32))
    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        elif dialect.name == 'postgresql':
            return str(value)
        else:
            return "%.32x" % uuid.UUID(str(value)).int
    def process_result_value(self, value, dialect):
        if value is None:
            return value
        return uuid.UUID(value)

class ShiftType(enum.Enum):
    day = "day"
    night = "night"
    mixed = "mixed"

class PlanType(enum.Enum):
    basic = "basic"
    shield = "shield"
    pro = "pro"

class StatusType(enum.Enum):
    active = "active"
    lapsed = "lapsed"
    cancelled = "cancelled"

class PlatformType(enum.Enum):
    zomato = "zomato"
    swiggy = "swiggy"

class Worker(Base):
    __tablename__ = "workers"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    worker_id = Column(String, unique=True, index=True)
    phone = Column(String, unique=True, index=True)
    aadhaar_hash = Column(String, unique=True)
    pan_hash = Column(String)
    upi_id = Column(String)
    platform = Column(SQLEnum(PlatformType))
    city = Column(String)
    zone = Column(String)
    enrollment_lat = Column(Float)
    enrollment_lng = Column(Float)
    vehicle_type = Column(String)
    tenure_weeks = Column(Integer)
    shift_type = Column(SQLEnum(ShiftType))
    plan = Column(SQLEnum(PlanType))
    status = Column(SQLEnum(StatusType))
    device_fingerprint_hash = Column(String, nullable=True)
    baseline_ready = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
