from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc
from typing import List
from app.db.database import get_db
from app.models.user import User
from app.models.scan import ScanHistory
from app.schemas.prediction import ScanHistoryResponse
from app.core.security import get_current_user

router = APIRouter(prefix='/history', tags=['Scan History'])

@router.get('/', response_model=List[ScanHistoryResponse])
async def list_history(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(ScanHistory)
        .where(ScanHistory.user_id == current_user.id)
        .order_by(desc(ScanHistory.created_at))
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()

@router.get('/{scan_id}', response_model=ScanHistoryResponse)
async def get_scan_history(
    scan_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(ScanHistory)
        .where(ScanHistory.id == scan_id, ScanHistory.user_id == current_user.id)
    )
    scan = result.scalars().first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan record not found")
    return scan

@router.delete('/{scan_id}')
async def delete_scan_history(
    scan_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(ScanHistory)
        .where(ScanHistory.id == scan_id, ScanHistory.user_id == current_user.id)
    )
    scan = result.scalars().first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan record not found")
        
    await db.delete(scan)
    await db.commit()
    return {"detail": "Scan record deleted"}
