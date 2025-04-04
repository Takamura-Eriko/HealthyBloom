// FastAPIのベースURL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

// 健康データの型定義
export interface HealthData {
  id?: string
  user_id: string
  date: string
  age?: number
  gender?: string
  height?: number
  weight?: number
  bmi?: number
  blood_pressure_systolic: number
  blood_pressure_diastolic: number
  blood_sugar: number
  hba1c?: number
  cholesterol_total?: number
  cholesterol_hdl?: number
  cholesterol_ldl?: number
  triglycerides?: number
  liver_got?: number
  liver_gpt?: number
  liver_r_gpt?: number
  }

// 生活習慣アドバイスの型定義
export interface LifestyleAdvice {
  id?: string
  user_id: string
  category: string
  title: string
  description: string
  createdAt?: string
}

// 食事提案の型定義
export interface MealSuggestion {
  id?: string
  user_id: string
  title: string
  description: string
  nutritionType: string[]
  createdAt?: string
}

// 健康データを保存
export async function saveHealthData(data: HealthData): Promise<string> {
  console.log(data)
  console.log(JSON.stringify(data))
  try {
    const response = await fetch(`${API_BASE_URL}/health-records`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const result = await response.json()
    return result.id
  } catch (error) {
    console.error("Failed to save health data:", error)
    throw error
  }
}

// ユーザーの健康データを取得
export async function getUserHealthData(userId: string): Promise<HealthData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/health-records?userId=${userId}`)

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to get user health data:", error)
    return []
  }
}

// IDで健康データを取得
export async function getHealthDataById(id: string): Promise<HealthData | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/health-records/${id}`)

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Failed to get health data with ID ${id}:`, error)
    return null
  }
}

// 健康データを削除
export async function deleteHealthData(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/health-records/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }
  } catch (error) {
    console.error(`Failed to delete health data with ID ${id}:`, error)
    throw error
  }
}

// 生活習慣アドバイスを保存
export async function saveLifestyleAdvice(data: Omit<LifestyleAdvice, "id">): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/lifestyle-advice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const result = await response.json()
    return result.id
  } catch (error) {
    console.error("Failed to save lifestyle advice:", error)
    throw error
  }
}

// ユーザーの生活習慣アドバイスを取得
export async function getUserLifestyleAdvice(userId: string, category?: string): Promise<LifestyleAdvice[]> {
  try {
    let url = `${API_BASE_URL}/lifestyle-advice?userId=${userId}`
    if (category) {
      url += `&category=${category}`
    }

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to get user lifestyle advice:", error)
    return []
  }
}

// 食事提案を保存
export async function saveMealSuggestion(data: Omit<MealSuggestion, "id">): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/meal-suggestions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const result = await response.json()
    return result.id
  } catch (error) {
    console.error("Failed to save meal suggestion:", error)
    throw error
  }
}

// ユーザーの食事提案を取得
export async function getUserMealSuggestions(userId: string, nutritionType?: string): Promise<MealSuggestion[]> {
  try {
    let url = `${API_BASE_URL}/meal-suggestions?userId=${userId}`
    if (nutritionType) {
      url += `&nutritionType=${nutritionType}`
    }

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to get user meal suggestions:", error)
    return []
  }
}
