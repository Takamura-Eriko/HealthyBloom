import firebase_admin
from firebase_admin import auth, credentials
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from database import get_db
from sqlalchemy.orm import Session
import models
import schemas  # 追加
from passlib.context import CryptContext  # パスワードハッシュ化

cred = credentials.Certificate("firebase_credentials.json")
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")  # パスワードのハッシュ化設定

class Token(BaseModel):
    token: str

def verify_firebase_token(token: str):
    try:
        return auth.verify_id_token(token)
    except:
        raise HTTPException(status_code=401, detail="Invalid token")
   
def create_user(user_data: schemas.UserCreate):
    try:
       user = auth.create_user(
           email=user_data.email,
           email_verified=False,
           password=user_data.password,
           display_name=user_data.name,
           disabled=False
       )
       print('Successfully created new user: {0}'.format(user.uid))
    except Exception as e:
       print('Error creating new user:', e)

@router.post("/auth/signup")
async def signup(token_request: Token, user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    print("###auth.py signup###")
    print(f"Received Token: {token_request.token}")
    print(f"Received User Data: {user_data}")

    # Firebase トークン検証
    user = create_user(user_data)
   
    # パスワードのハッシュ化
    hashed_password = pwd_context.hash(user_data.password)

    # 新規ユーザーを作成
    new_user = models.User(
        email=user_data.email,
        name=user_data.name,
        password_hash=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registration successful",
        "user": {
            "email": new_user.email,
            "name": new_user.name,
            "id": str(new_user.id),
        },
    }


@router.post("/auth/login")
async def login(token_request: Token, db: Session = Depends(get_db)):
    print("###auth.py router.post###")
    print(f"auth.py Received Token: {token_request.token}")  # デバッグ用

    decoded_token = verify_firebase_token(token_request.token)
    user_uid = decoded_token.get("uid")
    user_email = decoded_token.get("email")

    if not user_email:
        raise HTTPException(status_code=400, detail="Email not found in token")

    user = db.query(models.User).filter(models.User.email == user_email).first()

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "message": "Authentication successful",
        "user": {
            "email": user.email,
            "name": user.name,
            "id": str(user.id),
        },
    }


@router.get("/protected")
def protected_route(token: str = Depends(verify_firebase_token)):
    """
    認証済みユーザーのみがアクセスできるエンドポイント
    """
    return {"message": "認証成功", "user": token}

