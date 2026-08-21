from datetime import datetime, timezone
from sqlalchemy import Integer, String, Float, ForeignKey, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base

class ScanHistory(Base):
    __tablename__ = "scan_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id"), nullable=True)
    filename: Mapped[str] = mapped_column(String(500))
    file_size_bytes: Mapped[int] = mapped_column(Integer)
    final_verdict: Mapped[str] = mapped_column(String(10))
    confidence_score: Mapped[float] = mapped_column(Float)
    vit_verdict: Mapped[str] = mapped_column(String(10))
    vit_confidence: Mapped[float] = mapped_column(Float)
    secondary_verdict: Mapped[str] = mapped_column(String(10))
    secondary_confidence: Mapped[float] = mapped_column(Float)
    ensemble_p_fake: Mapped[float] = mapped_column(Float)
    faces_detected: Mapped[int] = mapped_column(Integer)
    face_results: Mapped[str] = mapped_column(Text)
    attention_map_b64: Mapped[str] = mapped_column(Text)
    processing_time_ms: Mapped[float] = mapped_column(Float)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="scans")
