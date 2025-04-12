from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session

from uuid import UUID
from typing import List
import json
import crud, schemas
from models import HealthRecord
from database import get_db
import os
from dotenv import load_dotenv
from datetime import timedelta

# OpenAI 1.x 対応
from openai import OpenAI

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

router = APIRouter(prefix="/meal_plans", tags=["Meal Plans"])


# ▼ 曜日順整形のためのユーティリティ関数
def sort_week_plan(plan_json: dict) -> dict:
    """GPTが返す曜日順を正しい順（月→日）に整える"""
    week_order = ["月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日", "日曜日"]

    if "week_plan" not in plan_json or not isinstance(plan_json["week_plan"], list):
        return plan_json

    sorted_plan = sorted(
        plan_json["week_plan"],
        key=lambda day: week_order.index(day.get("day", "月曜日")) if day.get("day") in week_order else 999
    )

    plan_json["week_plan"] = sorted_plan
    return plan_json


@router.post("/", response_model=schemas.MealPlanResponse)
def create_meal_plan(meal_plan: schemas.MealPlanCreate, db: Session = Depends(get_db)):
    return crud.create_meal_plan(db, meal_plan)



@router.get("/{meal_plan_id}", response_model=schemas.MealPlanResponse)
def get_meal_plan(meal_plan_id: UUID, db: Session = Depends(get_db)):
    meal_plan = crud.get_meal_plan(db, meal_plan_id)

    if meal_plan is None:
        raise HTTPException(status_code=404, detail="Meal plan not found")

    meals = db.query(models.Meal).filter(models.Meal.user_id == user_id).all()

    return schemas.MealPlanDetailResponse(
        id=meal_plan.id,
        user_id=user_id,
        start_date=meal_plan.start_date,
        end_date=meal_plan.end_date,
        created_at=meal_plan.created_at,
        meals=[
            schemas.MealResponse(
                id=meal.id,
                user_id=meal.user_id,
                date=meal.date,
                meal_type=meal.meal_type,
                recipe_id=meal.recipe_id,
                created_at=meal.created_at
            ) for meal in meals
        ]
    )

# 健診データをもとに1週間の食事プランを生成
@router.post("/generate", response_model=schemas.MealPlanResponse)
def generate_meal_plan(
    meal_request: schemas.MealPlanGenerate = Body(...),
    db: Session = Depends(get_db)
):
    """
    健診データに基づいて1週間の食事メニューを生成するAPI
    """
    user = db.query(models.User).filter(models.User.id == meal_request.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 既存のレシピを取得
    recipes = db.query(models.Recipe).all()
    if not recipes:
        raise HTTPException(status_code=404, detail="No recipes found")

    # MealPlan 作成
    meal_plan = models.MealPlan(
        user_id=meal_request.user_id,
        start_date=meal_request.start_date,
        end_date=meal_request.end_date
    )
    db.add(meal_plan)
    db.commit()
    db.refresh(meal_plan)

    # 各日の食事をランダムに割り当て
    days = (meal_request.end_date - meal_request.start_date).days + 1
    for i in range(days):
        for meal_type in ["breakfast", "lunch", "dinner"]:
            meal = models.Meal(
                user_id=meal_request.user_id,
                date=meal_request.start_date + timedelta(days=i),
                meal_type=meal_type,
                recipe_id=random.choice(recipes).id
            )
            db.add(meal)

    db.commit()
    return meal_plan


@router.get("/user/{user_id}", response_model=List[schemas.MealPlanResponse])
def get_meal_plans_by_user(user_id: UUID, db: Session = Depends(get_db)):
    meal_plans = crud.get_meal_plans_by_user(db, user_id)
    return meal_plans


@router.post("/generate/{user_id}", response_model=schemas.MealPlanResponse)
def generate_meal_plan(user_id: UUID, db: Session = Depends(get_db)):
    record = (
        db.query(HealthRecord)
        .filter(HealthRecord.user_id == user_id)
        .order_by(HealthRecord.date.desc())
        .first()
    )

    if not record:
        raise HTTPException(status_code=404, detail="健康診断データが見つかりません")
    

    start_date = record.date
    end_date = start_date + timedelta(days=6)

    crud.delete_meal_plan_in_same_week(db, user_id, record.date, end_date)



    prompt = f"""
あなたは日本語で返答する管理栄養士です。以下の健康診断データに基づき、1週間分の食事メニュー（朝・昼・夕）を構造化JSON形式で提案してください。
栄養分類名も日本語で記載してください。

必ずJSON形式のみで返してください。説明・補足・コメント・空行は禁止です。
出力は必ず次のような形式でお願いします：

出力形式の例：
{{
  "week_plan": [
    {{
      "day": "月曜日",
      "breakfast": {{
            "title": "全粒粉トーストとヨーグルト",
            "nutritionType": [
                "high-fiber",
                "high-protein"
            ],
            "cookingTime": 5,
            "isQuick": true
        }},
        "lunch": {{
            "title": "時短！高タンパク豆腐丼",
            "nutritionType": [
                "high-protein",
                "low-fat"
            ],
            "cookingTime": 10,
            "isQuick": true
        }},
        "dinner": {{
            "title": "減塩でも美味しい和風煮物",
            "nutritionType": [
                "low-salt",
                "high-fiber"
            ],
            "cookingTime": 40,
            "isQuick": false
        }}
    }}
  ]
}}

健康診断データ:
年齢: {record.age}歳
性別: {record.gender}
身長: {record.height}cm
体重: {record.weight}kg
BMI: {record.bmi}
血圧: {record.blood_pressure_systolic}/{record.blood_pressure_diastolic}
血糖値: {record.blood_sugar}
HbA1c: {record.hba1c}
コレステロール（LDL）: {record.cholesterol_ldl}
HDL: {record.cholesterol_hdl}
中性脂肪: {record.triglycerides}
肝機能: GOT {record.liver_got}, GPT {record.liver_gpt}, γ-GTP: {record.liver_r_gpt}
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "あなたは管理栄養士です。出力はJSONオブジェクトのみで返してください。コメント、補足、空行は禁止です。"},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )
        content = response.choices[0].message.content
        print("GPTの出力:\n", content)

        with open("gpt_output_debug.json", "w", encoding="utf-8") as f:
            f.write(content)


        try:
            plan_json = json.loads(content)
            plan_json = sort_week_plan(plan_json)  # 曜日順整形をここで実行

        except json.JSONDecodeError as e:
            print("JSON解析エラー:", e)
            raise HTTPException(
                status_code=500,
                detail=f"GPTの出力が不正なJSONです: {str(e)}\n\n出力内容:\n{content}"
            )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"GPT全体の処理中にエラーが発生しました: {str(e)}")

    end_date = record.date + timedelta(days=6)

    # 同一週のMealPlanがあれば削除（重複防止）
    crud.delete_meal_plan_in_same_week(db, user_id, record.date, end_date)

    meal_plan_create = schemas.MealPlanCreate(
        user_id=user_id,
        start_date=record.date,
        end_date=end_date,
        plan_json=plan_json
    )
    return crud.create_meal_plan(db, meal_plan_create)

