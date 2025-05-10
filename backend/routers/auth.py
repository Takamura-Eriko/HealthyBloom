import os
import firebase_admin
from firebase_admin import auth, credentials
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from database import get_db
from sqlalchemy.orm import Session
import models
import schemas
from passlib.context import CryptContext
from logging_config import logger  # ログ追加

# Firebase 初期化（TESTING=1 ならスキップ）
if os.getenv("TESTING") != "1":
    cred = credentials.Certificate("firebase_credentials.json")
    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred)
        logger.info("Firebase initialized")

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class Token(BaseModel):
    token: str


def verify_firebase_token(token: str):
    try:
        return auth.verify_id_token(token)
    except Exception as e:
        logger.error(f"トークン検証失敗: {e}")
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
        logger.info(f"Firebase user created: {user.uid}")
        return user
    except Exception as e:
        logger.error(f"Firebase user creation failed: {e}")
        return None


@router.post("/auth/signup")
async def signup(token_request: Token, user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    logger.debug("Signup endpoint called")
    logger.debug(f"Token received: {token_request.token}")
    logger.debug(f"User data received: {user_data}")

    user = create_user(user_data)
    if user is None:
        raise HTTPException(status_code=500, detail="Firebase user creation failed")

    hashed_password = pwd_context.hash(user_data.password)

    new_user = models.User(
        email=user_data.email,
        name=user_data.name,
        password_hash=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    logger.info(f"User registered in DB: {new_user.email}")

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
    logger.debug("Login endpoint called")
    logger.debug(f"Token received: {token_request.token}")

    decoded_token = verify_firebase_token(token_request.token)
    user_email = decoded_token.get("email")

    if not user_email:
        logger.warning("Token did not contain an email")
        raise HTTPException(status_code=400, detail="Email not found in token")

    user = db.query(models.User).filter(models.User.email == user_email).first()

    if user is None:
        logger.warning(f"User not found in DB: {user_email}")
        raise HTTPException(status_code=404, detail="User not found")

    logger.info(f"Login successful: {user.email}")

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
    logger.info("Protected route accessed")
    return {"message": "認証成功", "user": token}
