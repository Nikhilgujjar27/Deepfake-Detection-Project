from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User
from app.models.scan import ScanHistory
from app.schemas.prediction import ScanHistoryResponse
from app.core.security import require_current_user

router = APIRouter(prefix='/history', tags=['Scan History'])

@router.get('/', response_model=list[ScanHistoryResponse])
def get_history(
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db)
):
    scans = db.query(ScanHistory).filter(ScanHistory.user_id == current_user.id).order_by(ScanHistory.created_at.desc()).offset(skip).limit(limit).all()
    return scans

@router.get('/{scan_id}', response_model=ScanHistoryResponse)
def get_scan(
    scan_id: int,
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db)
):
    scan = db.query(ScanHistory).filter(ScanHistory.id == scan_id, ScanHistory.user_id == current_user.id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    return scan

@router.delete('/{scan_id}')
def delete_scan(
    scan_id: int,
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db)
):
    scan = db.query(ScanHistory).filter(ScanHistory.id == scan_id, ScanHistory.user_id == current_user.id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
        
    db.delete(scan)
    db.commit()
    return {"message": "Scan deleted successfully"}
