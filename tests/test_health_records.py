import sys
import os
import uuid
from datetime import date

# backend ディレクトリをモジュールパスに追加
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_create_health_record():
    # 先にテスト用ユーザーを作成
    user_payload = {
        "email": f"test_{uuid.uuid4().hex[:8]}@example.com",
        "name": "テストユーザー",
        "password": "testpass123"
    }
    user_response = client.post("/users/create", json=user_payload)
    assert user_response.status_code == 200
    user_id = user_response.json()["id"]

    payload = {
        "user_id": user_id,
        "date": date.today().isoformat(),
        "age": 35,
        "gender": "male",
        "height": 172.0,
        "weight": 68.0,
        "bmi": 23.0,
        "blood_pressure_systolic": 120,
        "blood_pressure_diastolic": 80,
        "blood_sugar": 90.0,
        "hba1c": 5.5,
        "cholesterol_total": 180.0,
        "cholesterol_hdl": 50.0,
        "cholesterol_ldl": 110.0,
        "triglycerides": 100.0,
        "liver_got": 25.0,
        "liver_gpt": 28.0,
        "liver_r_gpt": 30.0,
        "anomalies": {}
    }

    response = client.post("/health-records", json=payload)
    assert response.status_code == 200
    assert response.json()["user_id"] == user_id
