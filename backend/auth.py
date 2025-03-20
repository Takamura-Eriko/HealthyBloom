import firebase_admin
from firebase_admin import auth, credentials
from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# Firebase 認証情報の読み込み
cred = credentials.Certificate("firebase_credentials.json")
firebase_admin.initialize_app(cred)

# HTTP 認証スキーム（Bearer トークンを使う）
security = HTTPBearer()

def verify_firebase_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    Firebase Authentication の JWT トークンを検証
    """
    token = credentials.credentials  # Authorization ヘッダーからトークンを取得
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token  # 成功すればデコードしたユーザー情報を返す
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid authentication token")
