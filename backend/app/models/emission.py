from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.session import Base

class EmissionLog(Base):
    __tablename__ = "emission_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    date = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    transport = Column(Float, nullable=False)
    electricity = Column(Float, nullable=False)
    diet = Column(Float, nullable=False)
    total = Column(Float, nullable=False)
    eco_score = Column(Integer, nullable=False)

    user = relationship("User", backref="emission_logs")

    def __repr__(self):
        return f"<EmissionLog(id={self.id}, user_id={self.user_id}, total={self.total})>"
