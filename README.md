# 🌱 HealthyBloom – 健康管理アプリ  
**バックエンド：FastAPI + PostgreSQL**

**HealthyBloom** は、健康診断の結果を **OCR解析** し、**1週間分の食事メニューを提案** する健康管理アプリです。  
個人の健康データを効率的に管理し、最適な食事プランを提供します。  

---

## 🚀 **アプリのコア機能**

### 🏥 **1. 健康診断結果の管理**
- ✅ **画像アップロード（OCR解析）**
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
| **画像解析** | Google Vision API（OCR解析） |
| **食事提案** | Python（ルールベース + AIモデル拡張可） |
| **非同期処理** | Celery + Redis（OCR解析やメニュー生成を高速化） |
| **デプロイ** | AWS Lambda / Docker（短期間で展開可能） |

---

📌 **このアプリは、健康管理をより簡単で効果的にすることを目指しています！**  
今後のアップデートでさらなる機能拡張を予定しています 🚀✨



コーディング規約
1. プロジェクト構成
バックエンド構成:
app/：アプリケーションのメインコード
models/：SQLAlchemyのモデル定義
schemas/：Pydanticモデル（リクエスト/レスポンスバリデーション）
services/：ビジネスロジック
api/：FastAPIのエンドポイント
utils/：ユーティリティ関数（OCR解析、データ処理）
tests/：テストコード
unit_tests/：ユニットテスト
integration_tests/：統合テスト
docker/：Docker関連ファイル（Dockerfile、docker-compose.yml）
2. 命名規則
ファイル名: スネークケース（例: user_service.py, ocr_parser.py）
クラス名: キャメルケース（例: HealthRecord, MealPlanService）
関数名/変数名: スネークケース（例: parse_ocr_data, generate_meal_plan）
3. コードの書き方
インデント: 4スペース
行の長さ: 1行は最大80文字。長すぎる場合は改行を使用。
空白:
演算子の前後にはスペースを1つ挿入（例: a + b, x = y）
カンマの後には1スペースを挿入（例: create_user(name, age, email)）
変数や関数の引数、戻り値に型アノテーションを使用（例: def get_user_by_id(user_id: int) -> User:）
4. データベース
SQLAlchemyモデル:
モデルクラスにはBaseを継承（例: class User(Base):）
テーブル名は常に小文字のスネークケース（例: users, meal_plans）
外部キーは関連するモデルをForeignKeyとして定義
DB接続:
DB接続の設定は.envファイルで管理し、SQLAlchemyの設定でロード（例: DATABASE_URL）
トランザクション管理はsessionを使用し、適切にコミットまたはロールバックする
5. API設計
エンドポイント:
エンドポイント名は動詞を避け、名詞を使ってリソースを表現（例: GET /health-records, POST /meal-plans）
HTTPメソッドに適切な動作をマッピング（例: GETは取得、POSTは作成、PUTは更新、DELETEは削除）
エラーハンドリング:
不正なリクエストやデータに対しては適切なHTTPステータスコードを返す（例: 400 Bad Request、404 Not Found）
エラーメッセージはJSON形式で返す（例: {"detail": "Invalid data"}）

7. 認証・認可
Firebase Authentication:
FirebaseのJWTトークンを使用してAPIリクエストを認証
各エンドポイントで認証されたユーザーのみがアクセス可能
APIリクエストヘッダーにAuthorization: Bearer <token>を設定
8. テスト
ユニットテスト:
各サービス関数やユーティリティ関数のユニットテストを必ず作成
FastAPIのTestClientを使ってAPIエンドポイントのテスト
統合テスト:
データベースや外部APIとの連携部分の統合テストを作成
CI/CDパイプラインで自動テストを実行
9. ドキュメンテーション
API仕様書:
FastAPIにはSwagger UI（/docs）とReDoc（/redoc）がデフォルトで組み込まれているため、それを活用
エンドポイントのリクエスト/レスポンス例を記載
各エンドポイントに説明を付けて、Swagger UIで自動生成されるドキュメントに反映
コードコメント:
複雑な処理やロジックには必ずコメントを記載
クラスや関数には簡潔なドキュメンテーションコメント（例: """This function calculates..."""）
10. デプロイ
AWS Lambda:
サーバーレス環境で動作するように、FastAPIをAWS Lambda用に設定（ZappaやAWS Chaliceを使用）
AWS LambdaとAPI Gatewayを使ってデプロイ
Docker:
Dockerコンテナを使用してアプリケーションを環境に依存せず展開
Dockerfileを使ってバックエンドをコンテナ化
11. CI/CD
GitHub Actions:
プッシュやプルリクエスト時に自動でユニットテストを実行
デプロイメント前にテストがすべて通過していることを確認
自動デプロイメントを設定（例: AWSに自動でデプロイ）


