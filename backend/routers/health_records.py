from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas import HealthRecordCreate, HealthRecordResponse
from crud import create_health_record, get_health_records

router = APIRouter()

# 健診データの新規登録
@router.post("/health_records", response_model=HealthRecordResponse)
def create_record(record: HealthRecordCreate, db: Session = Depends(get_db)):
    return create_health_record(db, record)

# 健診データの取得
@router.get("/health_records/{user_id}", response_model=list[HealthRecordResponse])
def read_records(user_id: str, db: Session = Depends(get_db)):
    records = get_health_records(db, user_id)
    if not records:
        raise HTTPException(status_code=404, detail="健康診断データが見つかりません")
    return records
