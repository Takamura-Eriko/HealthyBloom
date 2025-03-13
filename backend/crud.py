from sqlalchemy.orm import Session
from models import HealthRecord
from schemas import HealthRecordCreate
import uuid

# 健診データを保存
def create_health_record(db: Session, record: HealthRecordCreate):
    db_record = HealthRecord(id=str(uuid.uuid4()), **record.dict())
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

# 健診データを取得
def get_health_records(db: Session, user_id: str):
    return db.query(HealthRecord).filter(HealthRecord.user_id == user_id).all()
