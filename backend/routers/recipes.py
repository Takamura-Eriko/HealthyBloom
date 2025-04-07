from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import crud, schemas
from database import get_db

router = APIRouter(prefix="/recipes", tags=["Recipes"])

# 全レシピ取得
@router.get("/", response_model=list[schemas.RecipeResponse])
def get_recipes(db: Session = Depends(get_db)):
    return crud.get_recipes(db)

# 週間メニュー取得（モック）
@router.get("/weekly-menu")
def get_weekly_menu():
    return [
        {
            "day": "月曜日",
            "breakfast": {
                "id": "b1",
                "title": "全粒粉トーストとヨーグルト",
                "nutritionType": ["high-fiber", "high-protein"],
                "cookingTime": 5,
                "isQuick": True
            },
            "lunch": {
                "id": "l1",
                "title": "時短！高タンパク豆腐丼",
                "nutritionType": ["high-protein", "low-fat"],
                "cookingTime": 10,
                "isQuick": True
            },
            "dinner": {
                "id": "d1",
                "title": "減塩でも美味しい和風煮物",
                "nutritionType": ["low-salt", "high-fiber"],
                "cookingTime": 40,
                "isQuick": False
            }
        },
        {
            "day": "火曜日",
            "breakfast": {
                "id": "b2",
                "title": "野菜スムージーとナッツ",
                "nutritionType": ["high-fiber", "healthy-fat"],
                "cookingTime": 5,
                "isQuick": True
            },
            "lunch": {
                "id": "l2",
                "title": "血糖値を抑える地中海風サラダ",
                "nutritionType": ["low-sugar", "healthy-fat"],
                "cookingTime": 15,
                "isQuick": True
            },
            "dinner": {
                "id": "d2",
                "title": "低塩・高タンパクの和風定食",
                "nutritionType": ["low-salt", "high-protein"],
                "cookingTime": 30,
                "isQuick": False
            }
        },
        # 必要に応じて水曜〜日曜も追加可能
    ]
