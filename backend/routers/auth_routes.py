from fastapi import APIRouter, Depends
from auth import verify_firebase_token

router = APIRouter()

@router.get("/protected")
def protected_route(user=Depends(verify_firebase_token)):
    """
    認証済みユーザーのみがアクセスできるエンドポイント
    """
    return {"message": "認証成功", "user": user}
