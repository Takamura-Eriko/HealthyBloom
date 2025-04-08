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



# 週間メニュー取得（モック）
@router.get("/weekly-menu2")
def get_weekly_menu2():
    return {
    "user_id": "b74ca31d-c7f7-4029-b5ca-197aa6adb0d8",
    "start_date": "2025-04-07",
    "end_date": "2025-04-13",
    "plan_json": {
        "week_plan": [
            {
                "day": "月曜日",
                "lunch": {
                    "title": "鶏胸肉のグリルとサラダ",
                    "isQuick": True,
                    "cookingTime": 15,
                    "nutritionType": [
                        "high-protein",
                        "low-fat",
                        "low-salt"
                    ]
                },
                "dinner": {
                    "title": "豆腐と野菜の煮物",
                    "isQuick": False,
                    "cookingTime": 30,
                    "nutritionType": [
                        "low-salt",
                        "high-fiber"
                    ]
                },
                "breakfast": {
                    "title": "全粒粉トーストとフルーツヨーグルト",
                    "isQuick": True,
                    "cookingTime": 5,
                    "nutritionType": [
                        "high-fiber",
                        "high-protein"
                    ]
                }
            },
            {
                "day": "火曜日",
                "lunch": {
                    "title": "鮭のソテーとブロッコリー",
                    "isQuick": True,
                    "cookingTime": 15,
                    "nutritionType": [
                        "high-protein",
                        "low-salt"
                    ]
                },
                "dinner": {
                    "title": "野菜たっぷりのミネストローネ",
                    "isQuick": False,
                    "cookingTime": 45,
                    "nutritionType": [
                        "low-salt",
                        "high-fiber"
                    ]
                },
                "breakfast": {
                    "title": "オートミールとフレッシュフルーツ",
                    "isQuick": True,
                    "cookingTime": 10,
                    "nutritionType": [
                        "high-fiber",
                        "low-fat"
                    ]
                }
            },
            {
                "day": "水曜日",
                "lunch": {
                    "title": "鶏肉とキノコの炒め物",
                    "isQuick": True,
                    "cookingTime": 20,
                    "nutritionType": [
                        "high-protein",
                        "low-fat",
                        "low-salt"
                    ]
                },
                "dinner": {
                    "title": "豆腐と野菜のスープ",
                    "isQuick": False,
                    "cookingTime": 30,
                    "nutritionType": [
                        "low-salt",
                        "high-fiber"
                    ]
                },
                "breakfast": {
                    "title": "ベーコンと卵のサンドイッチ",
                    "isQuick": True,
                    "cookingTime": 10,
                    "nutritionType": [
                        "high-fiber",
                        "high-protein"
                    ]
                }
            },
            {
                "day": "木曜日",
                "lunch": {
                    "title": "鶏胸肉のサラダ",
                    "isQuick": True,
                    "cookingTime": 15,
                    "nutritionType": [
                        "high-protein",
                        "low-fat",
                        "low-salt"
                    ]
                },
                "dinner": {
                    "title": "野菜と豆腐の煮物",
                    "isQuick": False,
                    "cookingTime": 30,
                    "nutritionType": [
                        "low-salt",
                        "high-fiber"
                    ]
                },
                "breakfast": {
                    "title": "バナナとヨーグルトのスムージー",
                    "isQuick": True,
                    "cookingTime": 5,
                    "nutritionType": [
                        "high-fiber",
                        "high-protein"
                    ]
                }
            },
            {
                "day": "金曜日",
                "lunch": {
                    "title": "鶏胸肉のグリルとサラダ",
                    "isQuick": True,
                    "cookingTime": 15,
                    "nutritionType": [
                        "high-protein",
                        "low-fat",
                        "low-salt"
                    ]
                },
                "dinner": {
                    "title": "豆腐と野菜の煮物",
                    "isQuick": False,
                    "cookingTime": 30,
                    "nutritionType": [
                        "low-salt",
                        "high-fiber"
                    ]
                },
                "breakfast": {
                    "title": "全粒粉トーストとフルーツヨーグルト",
                    "isQuick": True,
                    "cookingTime": 5,
                    "nutritionType": [
                        "high-fiber",
                        "high-protein"
                    ]
                }
            },
            {
                "day": "土曜日",
                "lunch": {
                    "title": "鮭のソテーとブロッコリー",
                    "isQuick": True,
                    "cookingTime": 15,
                    "nutritionType": [
                        "high-protein",
                        "low-salt"
                    ]
                },
                "dinner": {
                    "title": "野菜たっぷりのミネストローネ",
                    "isQuick": False,
                    "cookingTime": 45,
                    "nutritionType": [
                        "low-salt",
                        "high-fiber"
                    ]
                },
                "breakfast": {
                    "title": "オートミールとフレッシュフルーツ",
                    "isQuick": True,
                    "cookingTime": 10,
                    "nutritionType": [
                        "high-fiber",
                        "low-fat"
                    ]
                }
            },
            {
                "day": "日曜日",
                "lunch": {
                    "title": "鶏肉とキノコの炒め物",
                    "isQuick": True,
                    "cookingTime": 20,
                    "nutritionType": [
                        "high-protein",
                        "low-fat",
                        "low-salt"
                    ]
                },
                "dinner": {
                    "title": "豆腐と野菜のスープ",
                    "isQuick": False,
                    "cookingTime": 30,
                    "nutritionType": [
                        "low-salt",
                        "high-fiber"
                    ]
                },
                "breakfast": {
                    "title": "ベーコンと卵のサンドイッチ",
                    "isQuick": True,
                    "cookingTime": 10,
                    "nutritionType": [
                        "high-fiber",
                        "high-protein"
                    ]
                }
            }
        ]
    },
    "id": "a5435c67-a8e2-488f-b27a-770689da5e58",
    "created_at": "2025-04-07T22:40:33.862485"
}