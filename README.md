# 🌱 HealthyBloom – 健康管理アプリ  
**バックエンド：FastAPI + PostgreSQL**

**HealthyBloom** は、健康診断の結果を **OCR解析** し、**1週間分の食事メニューを提案** する健康管理アプリです。  
個人の健康データを効率的に管理し、最適な食事プランを提供します。  

---

## 🚀 **アプリのコア機能**

### 🏥 **1. 健康診断結果の管理**
- ✅ **手入力での健診データ登録**
- ✅ **異常値の自動ハイライト表示**
- ✅ **過去データの保存 & グラフ化**

### 🍽 **2. 食事提案**
- ✅ **健診データに基づいた個別の食事メニュー提案**
- ✅ **1週間分のカスタムメニュー生成**
- ✅ **レシピと栄養バランス情報の提供**

---

## 🛠 **技術スタック**

| 項目         | 使用技術 |
|-------------|-------------------------------|
| **バックエンド** | FastAPI（Python） |
| **データベース** | PostgreSQL（リレーショナルDB） |
| **ORM** | SQLAlchemy（DB操作） |
| **認証** | Firebase Authentication（JWTトークン管理） |
| **食事提案** | Python（ルールベース + AIモデル拡張可） |
| **非同期処理** | Celery + Redis（OCR解析やメニュー生成を高速化） |
| **デプロイ** | AWS Lambda / Docker（短期間で展開可能） |


## **API設計**

### **エンドポイントのルール**

#### 健康診断データ
- **GET** `/health-records` － 健康診断データの取得
- **POST** `/health-records` － 健康診断データの登録
- **PUT** `/health-records/{id}` － 健康診断データの更新
- **DELETE** `/health-records/{id}` － 健康診断データの削除

#### ユーザー情報
- **POST** `/auth/login` － Firebase JWT 認証
- **GET** `/user/profile` － ユーザー情報取得
- **POST** `/user/update` － ユーザー情報更新

#### 食事メニュー情報
- **GET** `/plan/meal` － 簡易食事プラン取得
- **GET** `/plan/exercise` － 簡易運動プラン取得
- **POST** `/progress/log` － 体重記録登録
- **GET** `/progress/report` － 進捗データ取得


## **コーディング規約**

### 1. プロジェクト構成
- **バックエンド構成:**
  - `app/`：アプリケーションのメインコード
  - `models/`：SQLAlchemyのモデル定義
  - `schemas/`：Pydanticモデル（リクエスト/レスポンスバリデーション）
  - `services/`：ビジネスロジック
  - `api/`：FastAPIのエンドポイント
  - `utils/`：ユーティリティ関数（OCR解析、データ処理）
  - `tests/`：テストコード
    - `unit_tests/`：ユニットテスト
    - `integration_tests/`：統合テスト
  - `docker/`：Docker関連ファイル（Dockerfile、docker-compose.yml）

### 2. 命名規則
- **ファイル名**: スネークケース（例: `user_service.py`, `ocr_parser.py`）
- **クラス名**: キャメルケース（例: `HealthRecord`, `MealPlanService`）
- **関数名/変数名**: スネークケース（例: `parse_ocr_data`, `generate_meal_plan`）

### 3. コードの書き方
- **インデント**: 4スペース
- **行の長さ**: 1行は最大80文字。長すぎる場合は改行を使用。
- **空白**:
  - 演算子の前後にはスペースを1つ挿入（例: `a + b`, `x = y`）
  - カンマの後には1スペースを挿入（例: `create_user(name, age, email)`）
  - 変数や関数の引数、戻り値に型アノテーションを使用（例: `def get_user_by_id(user_id: int) -> User:`）

### 4. データベース
- **SQLAlchemyモデル**:
  - モデルクラスには`Base`を継承（例: `class User(Base):`）
  - テーブル名は常に小文字のスネークケース（例: `users`, `meal_plans`）
  - 外部キーは関連するモデルを`ForeignKey`として定義
- **DB接続**:
  - DB接続の設定は`.env`ファイルで管理し、SQLAlchemyの設定でロード（例: `DATABASE_URL`）
  - トランザクション管理は`session`を使用し、適切にコミットまたはロールバックする

### 5. API設計
- **エンドポイント**:
  - エンドポイント名は動詞を避け、名詞を使ってリソースを表現（例: `GET /health-records`, `POST /meal-plans`）
  - HTTPメソッドに適切な動作をマッピング（例: `GET`は取得、`POST`は作成、`PUT`は更新、`DELETE`は削除）
- **エラーハンドリング**:
  - 不正なリクエストやデータに対しては適切なHTTPステータスコードを返す（例: `400 Bad Request`, `404 Not Found`）
  - エラーメッセージはJSON形式で返す（例: `{"detail": "Invalid data"}`）

### 6. OCR解析
- **Google Vision APIの使用**:
  - OCR解析は非同期で行い、CeleryとRedisを利用してバックグラウンドで処理
  - OCR解析後の結果はデータベースに保存、必要に応じて補完や手入力を促す
  - OCR処理は`OCRService`クラスで実装し、共通のインターフェースを提供

### 7. 認証・認可
- **Firebase Authentication**:
  - FirebaseのJWTトークンを使用してAPIリクエストを認証
  - 各エンドポイントで認証されたユーザーのみがアクセス可能
  - APIリクエストヘッダーに`Authorization: Bearer <token>`を設定

### 8. テスト
- **ユニットテスト**:
  - 各サービス関数やユーティリティ関数のユニットテストを必ず作成
  - FastAPIの`TestClient`を使ってAPIエンドポイントのテスト
- **統合テスト**:
  - データベースや外部APIとの連携部分の統合テストを作成
  - CI/CDパイプラインで自動テストを実行

### 9. ドキュメンテーション
- **API仕様書**:
  - FastAPIにはSwagger UI（`/docs`）とReDoc（`/redoc`）がデフォルトで組み込まれているため、それを活用
  - エンドポイントのリクエスト/レスポンス例を記載
  - 各エンドポイントに説明を付けて、Swagger UIで自動生成されるドキュメントに反映
- **コードコメント**:
  - 複雑な処理やロジックには必ずコメントを記載
  - クラスや関数には簡潔なドキュメンテーションコメント（例: `"""This function calculates..."""`）

### 10. デプロイ
- **AWS Lambda**:
  - サーバーレス環境で動作するように、FastAPIをAWS Lambda用に設定（ZappaやAWS Chaliceを使用）
  - AWS LambdaとAPI Gatewayを使ってデプロイ
- **Docker**:
  - Dockerコンテナを使用してアプリケーションを環境に依存せず展開
  - Dockerfileを使ってバックエンドをコンテナ化

### 11. CI/CD
- **GitHub Actions**:
  - プッシュやプルリクエスト時に自動でユニットテストを実行
  - デプロイメント前にテストがすべて通過していることを確認
  - 自動デプロイメントを設定（例: AWSに自動でデプロイ）

## 🌱 プロジェクト紹介動画

📽️ [HealthyBloom を見る](./HealthyBloom_compressed.mp4)  
※「View raw」を押すと動画が再生されます。

## 🧪 テスト設計書

📄 詳細は [tests/test_plan.md](./tests/test_plan.md) をご覧ください。


## 🚀 運用・デプロイ設計

### 📦 デプロイ環境

- バックエンド：FastAPI + PostgreSQL
- インフラ候補：
  - ローカル開発用：Docker（PostgreSQL含む）
  - 本番運用：Render, Railway, Fly.io, AWS Lambda（コスト最小）
  - CI/CD：GitHub Actions（今後追加可）

---

### ⚙️ デプロイフロー（例：Render 使用時）

1. GitHub リポジトリと Render を連携
2. `main` ブランチに push すると自動デプロイ
3. `render.yaml` または `Dockerfile` で環境定義
4. 環境変数（Firebaseキー・DB接続情報など）を Render 側で設定

---

### 🛠 開発・運用フロー

| 項目             | 方法                                    |
|------------------|-----------------------------------------|
| 開発ブランチ管理 | GitHub Flow（`main` + feature/test ブランチ） |
| テスト           | `pytest`, `TESTING=1 pytest tests/`     |
| 本番反映         | `main` にマージ → Renderで自動デプロイ |
| Firebase連携     | `.env` / Renderの環境変数で制御         |

---

### 💰 運用コスト（想定）

| 項目         | サービス例 | 月額費用（目安） |
|--------------|------------|------------------|
| Render（Web）| Render     | 約$0〜7          |
| DB（PostgreSQL） | Supabase / Render | $0〜25（無料枠あり） |
| Firebase     | 無料枠あり | 〜$0（ログインのみ） |

---

### 🔐 セキュリティとバックアップ

- Firebaseのキーは `.env` 経由で読み込み
- DB定期バックアップ（Supabase, Railway などで自動化）
- ユーザー認証は Firebase Authentication に一任

---

## ✅ 今後の改善予定（任意）

- CI/CDの自動テスト（GitHub Actions）
- Dockerコンテナ化と本番用環境変数管理
- 本番エラー監視ツール（Sentryなど）の導入

- ## 📊 パフォーマンス・負荷試験設計

本アプリでは、将来的なスケーラビリティと信頼性の確保のため、以下の観点で性能計測と改善設計を行います。

---

### 🎯 目的

- APIの応答速度・同時アクセス時の安定性を測定
- DBアクセスの最適化（インデックス・クエリ効率）
- キャッシュ導入によるレスポンス高速化の余地を評価

---

### 🧪 使用ツール・技術（計測/改善に使用）

| 分類         | ツール・方法                        | 補足                                   |
|--------------|-------------------------------------|----------------------------------------|
| 負荷試験     | Locust / Apache Benchmark (ab)     | `/health-records`などのAPIを対象に試験 |
| 応答時間測定 | curl + `time` コマンド             | シンプルに応答時間を測定              |
| DB最適化     | `EXPLAIN ANALYZE`（PostgreSQL）     | クエリの処理コストを確認              |
| キャッシュ   | Redis（想定）＋FastAPI Depends構成 | 頻出APIに対応予定                      |

---

### 📈 想定する負荷テスト例

```bash
ab -n 100 -c 10 http://localhost:8000/health-records
```

## 🧾 ログ設計・運用方針

### バックエンド（FastAPI）

- Python標準ライブラリ `logging` を使用し、`logging_config.py` に設定を集約
- ログは `INFO`, `DEBUG`, `WARNING`, `ERROR` のレベルで出力
- 主要API処理に `logger` を挿入して運用・監視を想定

#### 使用例：

```python
from logging_config import logger

logger.info("ユーザー登録完了")
logger.warning("ユーザー情報なし")
logger.error("トークン認証失敗")



