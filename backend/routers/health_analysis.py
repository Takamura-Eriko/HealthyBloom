from fastapi import APIRouter, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from database import get_db
from crud import get_health_records
from utils.health_analysis import analyze_health_data

router = APIRouter(prefix="/health", tags=["Health Analysis"])

@router.get("/recommendation/{user_id}", response_model=list[str])
def get_nutrition_recommendation(user_id: str, db: Session = Depends(get_db)):
    records = get_health_records(db, user_id)
    if not records:
        raise HTTPException(status_code=404, detail="健診データが見つかりません")

    # 最新の健診データを選ぶ（降順ソート）
    latest = sorted(records, key=lambda x: x.date, reverse=True)[0]
    latest_dict = jsonable_encoder(latest)

    # 栄養タイプを判定
    nutrition_types = analyze_health_data(latest_dict)

    return nutrition_types