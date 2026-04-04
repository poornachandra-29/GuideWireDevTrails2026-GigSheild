import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey
from app.database import Base
from app.models.worker import GUID

class Dispute(Base):
    __tablename__ = "disputes"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    worker_id = Column(GUID(), ForeignKey("workers.id"))
    trigger_type = Column(String, nullable=True) # e.g. "aqi", "waterlogging"
    is_fake_data = Column(Boolean, default=False)
    issue_description = Column(String)
    status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)
