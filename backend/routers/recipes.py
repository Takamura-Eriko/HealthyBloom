from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

import crud, schemas
from database import get_db
from routers.meal_plans import generate_meal_plan  # 新APIを内部で使用

router = APIRouter(prefix="/recipes", tags=["Recipes"])


#  レシピ検索（新規追加）
@router.get("/search", response_model=list[schemas.RecipeResponse])
def search_recipes(query: str = "", db: Session = Depends(get_db)):
    """
    タイトルに部分一致するレシピを検索します。
    使用例: /recipes/search?query=スムージー
    """
    return crud.search_recipes(db, query=query)


# 全レシピ取得
@router.get("/", response_model=list[schemas.RecipeResponse])
def get_recipes(db: Session = Depends(get_db)):
    return crud.get_recipes(db)


#  週次メニュー生成（GPT + 健診データ）
@router.post("/weekly-menu2/{user_id}")
def get_weekly_menu2(user_id: UUID, db: Session = Depends(get_db)):
    """
    健診データとGPTを使って1週間の食事プラン（week_plan）を生成し返す。
    """
    try:
        meal_plan = generate_meal_plan(user_id=user_id, db=db)
        if hasattr(meal_plan, "plan_json") and "week_plan" in meal_plan.plan_json:
            return {
                "user_id": str(meal_plan.user_id),
                "start_date": str(meal_plan.start_date),
                "end_date": str(meal_plan.end_date),
                "plan_json": {
                    "week_plan": meal_plan.plan_json["week_plan"]
                },
                "id": str(meal_plan.id),
                "created_at": str(meal_plan.created_at)
            }
        else:
            raise HTTPException(status_code=500, detail="生成されたデータが不完全です")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"エラーが発生しました: {str(e)}")
