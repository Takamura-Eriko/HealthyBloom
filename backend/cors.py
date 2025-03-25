from fastapi.middleware.cors import CORSMiddleware

def setup_cors(app):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],  # フロントエンドの URL
        allow_credentials=True,
        allow_methods=["*"],  # すべての HTTP メソッドを許可
        allow_headers=["*"],  # すべてのヘッダーを許可
    )