import firebase_admin
from firebase_admin import auth, credentials
# from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from database import get_db
from sqlalchemy.orm import Session

cred = credentials.Certificate("firebase_credentials.json")
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

router = APIRouter()

class Token(BaseModel):
    token: str

def verify_firebase_token(token: str):
    try:
        return auth.verify_id_token(token)
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/auth/login")
async def login(token_request: Token, db: Session = Depends(get_db)):
    print("###auth.py router.post###")
    print(f"auth.py Received Token: {token_request.token}")  # トークンが受け取られているか確認
    decoded_token = verify_firebase_token(token_request.token)
    return {"message": "Authenticated", "user": decoded_token}

@router.get("/protected")
def protected_route(token: str = Depends(verify_firebase_token)):
    """
    認証済みユーザーのみがアクセスできるエンドポイント
    """
    return {"message": "認証成功", "user": token}

