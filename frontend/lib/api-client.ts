/**
 * 汎用APIクライアント
 * 様々なAPIエンドポイントに対応できる柔軟な設計
 */

// APIリクエストのオプション型
export interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE"
  headers?: Record<string, string>
  body?: any
  params?: Record<string, string>
  apiKey?: string
}

// APIレスポンスの型
export interface ApiResponse<T> {
  data: T | null
  error: string | null
  status: number
}

// APIクライアント関数
export async function apiClient<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<ApiResponse<T>> {
  try {
    const { method = "GET", headers = {}, body, params = {}, apiKey } = options

    // URLパラメータの構築
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      queryParams.append(key, value)
    })

    // APIキーがある場合はパラメータに追加
    if (apiKey) {
      queryParams.append("apiKey", apiKey)
    }

    // URLの構築
    const url = `${endpoint}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`

    // リクエストオプションの構築
    const requestOptions: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    }

    // リクエストの実行
    const response = await fetch(url, requestOptions)
    const data = await response.json()

    return {
      data,
      error: null,
      status: response.status,
    }
  } catch (error) {
    console.error("API request failed:", error)
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
      status: 500,
    }
  }
}

// APIキーの取得（環境変数またはデモキー）
export function getApiKey(apiName: string): string {
  // 環境変数からAPIキーを取得
  const envKey = process.env[`NEXT_PUBLIC_${apiName.toUpperCase()}_API_KEY`]

  // デモ用のAPIキー
  const demoKeys: Record<string, string> = {
    recipe: "demo_recipe_api_key_123",
    exercise: "demo_exercise_api_key_456",
    nutrition: "demo_nutrition_api_key_789",
  }

  // 環境変数のキーがあればそれを使用、なければデモキーを使用
  return envKey || demoKeys[apiName.toLowerCase()] || "demo_api_key"
}

