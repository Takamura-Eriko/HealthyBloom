from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas import HealthRecordCreate, HealthRecordResponse, HealthRecordUpdate
from crud import create_health_record, get_health_records
from models import HealthRecord
from fastapi.encoders import jsonable_encoder
from utils.health_analysis import analyze_health_data

router = APIRouter()

# 健診データの新規登録
@router.post("/health-records", response_model=HealthRecordResponse)
def create_record(record: HealthRecordCreate, db: Session = Depends(get_db)):
    return create_health_record(db, record)

# 健診データの取得（ユーザー単位）
@router.get("/health-records/{user_id}", response_model=list[HealthRecordResponse])
def read_records(user_id: str, db: Session = Depends(get_db)):
    records = get_health_records(db, user_id)
    if not records:
        raise HTTPException(status_code=404, detail="健康診断データが見つかりません")
    return records

# 健診データの全件取得（テストや管理者用）
@router.get("/health-records", response_model=list[HealthRecordResponse])
def read_all_records(db: Session = Depends(get_db)):
    records = db.query(HealthRecord).all()
    return records

# 健診データの更新
@router.put("/health-records/{id}", response_model=HealthRecordUpdate)
def update_health_record(id: str, record_update: HealthRecordUpdate, db: Session = Depends(get_db)):
    db_record = db.query(HealthRecord).filter(HealthRecord.id == id).first()
    if not db_record:
        raise HTTPException(status_code=404, detail="Record not found")
    
    for key, value in record_update.dict(exclude_unset=True).items():
        setattr(db_record, key, value)
    
    db.commit()
    db.refresh(db_record)
    return db_record

# 健診データの削除
@router.delete("/health-records/{id}", response_model=dict)
def delete_health_record(id: str, db: Session = Depends(get_db)):
    db_record = db.query(HealthRecord).filter(HealthRecord.id == id).first()
    if not db_record:
        raise HTTPException(status_code=404, detail="Record not found")
    
    db.delete(db_record)
    db.commit()
    return {"message": "Record deleted successfully"}

# 栄養タイプ判定エンドポイント
@router.get("/health/recommendation/{user_id}", response_model=list[str])
def get_nutrition_recommendation(user_id: str, db: Session = Depends(get_db)):
    records = get_health_records(db, user_id)
    if not records:
        raise HTTPException(status_code=404, detail="健診データが見つかりません")

    latest = sorted(records, key=lambda x: x.date, reverse=True)[0]
    latest_dict = jsonable_encoder(latest)
    nutrition_types = analyze_health_data(latest_dict)
    return nutrition_types
