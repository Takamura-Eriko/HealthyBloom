import { apiClient, getApiKey } from "./api-client"

// 運動APIのベースURL
const EXERCISE_API_BASE_URL = "https://api.example.com/exercises"

// 運動の難易度
export type DifficultyLevel = "beginner" | "intermediate" | "advanced"

// 運動のカテゴリ
export type ExerciseCategory = "cardio" | "strength" | "flexibility" | "balance" | "yoga" | "pilates"

// 運動の型
export interface Exercise {
  id: string
  title: string
  description: string
  imageUrl: string
  category: ExerciseCategory
  difficulty: DifficultyLevel
  duration: number // 分単位
  caloriesBurned: number // 30分あたりの消費カロリー（kcal）
  targetMuscles: string[]
  steps: string[]
  tips?: string[]
  benefits: string[]
  contraindications?: string[] // 禁忌事項（こんな人は避けた方がいい）
  equipment?: string[] // 必要な器具
  variations?: string[] // バリエーション
}

// 運動検索パラメータの型
export interface ExerciseSearchParams {
  query?: string
  category?: ExerciseCategory
  difficulty?: DifficultyLevel
  maxDuration?: number
  targetMuscles?: string[]
  equipment?: string[]
  page?: number
  limit?: number
}

// 運動検索結果の型
export interface ExerciseSearchResult {
  exercises: Exercise[]
  total: number
  page: number
  limit: number
}

// 運動を検索する関数
export async function searchExercises(params: ExerciseSearchParams): Promise<ExerciseSearchResult> {
  try {
    const apiKey = getApiKey("exercise")

    const response = await apiClient<ExerciseSearchResult>(`${EXERCISE_API_BASE_URL}/search`, {
      params: {
        ...(params.query && { query: params.query }),
        ...(params.category && { category: params.category }),
        ...(params.difficulty && { difficulty: params.difficulty }),
        ...(params.maxDuration && { maxDuration: params.maxDuration.toString() }),
        ...(params.targetMuscles && { targetMuscles: params.targetMuscles.join(",") }),
        ...(params.equipment && { equipment: params.equipment.join(",") }),
        page: (params.page || 1).toString(),
        limit: (params.limit || 10).toString(),
      },
      apiKey,
    })

    if (response.error) {
      throw new Error(response.error)
    }

    return response.data || { exercises: [], total: 0, page: 1, limit: 10 }
  } catch (error) {
    console.error("Failed to search exercises:", error)
    // APIが失敗した場合はモックデータを返す
    return getMockExerciseSearchResult(params)
  }
}

// 運動の詳細を取得する関数
export async function getExerciseById(id: string): Promise<Exercise | null> {
  try {
    const apiKey = getApiKey("exercise")

    const response = await apiClient<Exercise>(`${EXERCISE_API_BASE_URL}/${id}`, {
      apiKey,
    })

    if (response.error) {
      throw new Error(response.error)
    }

    return response.data
  } catch (error) {
    console.error(`Failed to get exercise with ID ${id}:`, error)
    // APIが失敗した場合はモックデータを返す
    return getMockExerciseById(id)
  }
}

// 運動プランを取得する関数
export async function getExercisePlan(params: {
  goal: string
  fitnessLevel: DifficultyLevel
  timeAvailable: number
}): Promise<any> {
  try {
    const apiKey = getApiKey("exercise")

    const response = await apiClient<any>(`${EXERCISE_API_BASE_URL}/plan`, {
      method: "POST",
      body: params,
      apiKey,
    })

    if (response.error) {
      throw new Error(response.error)
    }

    return response.data
  } catch (error) {
    console.error("Failed to get exercise plan:", error)
    // APIが失敗した場合はモックデータを返す
    return getMockExercisePlan(params)
  }
}

// モックの運動検索結果を返す関数
function getMockExerciseSearchResult(params: ExerciseSearchParams): ExerciseSearchResult {
  // モックデータ（実際のAPIが利用できない場合のフォールバック）
  const mockExercises: Exercise[] = [
    {
      id: "1",
      title: "ウォーキング",
      description: "最も基本的な有酸素運動で、血圧を下げる効果があります。",
      imageUrl: "/placeholder.svg?height=200&width=300",
      category: "cardio",
      difficulty: "beginner",
      duration: 30,
      caloriesBurned: 150,
      targetMuscles: ["脚", "臀部", "心肺機能"],
      steps: [
        "背筋を伸ばし、肩の力を抜いた姿勢で立ちます。",
        "視線は前方に向け、あごを引きます。",
        "かかとから着地し、つま先で蹴り出すように歩きます。",
        "腕は自然に振り、歩幅は少し広めにとります。",
        "呼吸は自然に行い、会話ができる程度の速さで歩きます。",
      ],
      benefits: ["血圧の低下", "心肺機能の向上", "脂肪燃焼", "ストレス軽減", "骨密度の向上"],
      tips: [
        "歩く前後にストレッチを行うと効果的です。",
        "水分補給を忘れずに行いましょう。",
        "徐々に歩く距離や時間を増やしていきましょう。",
      ],
      contraindications: ["重度の関節痛がある場合は医師に相談してください。"],
    },
    {
      id: "2",
      title: "ヨガ - 太陽礼拝",
      description: "一連の流れるような動きで、柔軟性と筋力を向上させるヨガのポーズです。",
      imageUrl: "/placeholder.svg?height=200&width=300",
      category: "yoga",
      difficulty: "intermediate",
      duration: 15,
      caloriesBurned: 100,
      targetMuscles: ["全身", "背中", "腹部", "腕"],
      steps: [
        "山のポーズで始めます。足を揃えて立ち、手を胸の前で合わせます。",
        "息を吸いながら、手を頭上に伸ばします。",
        "息を吐きながら、前屈します。",
        "息を吸いながら、上体を少し持ち上げ、視線を前に向けます。",
        "息を吐きながら、両手を床につけ、足を後ろに伸ばしてプランクのポーズをとります。",
        "息を吸いながら、腕を曲げて体を床に近づけます（チャトランガ）。",
        "息を吐きながら、胸を持ち上げてコブラのポーズをとります。",
        "息を吸いながら、お尻を持ち上げて逆V字のポーズ（ダウンドッグ）をとります。",
        "息を吐きながら、足を手元に戻し、前屈します。",
        "息を吸いながら、上体を起こし、手を頭上に伸ばします。",
        "息を吐きながら、山のポーズに戻ります。",
      ],
      benefits: ["柔軟性の向上", "筋力の向上", "ストレス軽減", "血液循環の改善", "姿勢の改善"],
      tips: [
        "呼吸と動きを同期させることが重要です。",
        "無理をせず、自分のペースで行いましょう。",
        "朝の習慣にすると一日を活力的に始められます。",
      ],
      contraindications: [
        "高血圧や心臓疾患がある場合は医師に相談してください。",
        "妊娠中は一部のポーズを避けるべきです。",
      ],
    },
  ]

  // 検索条件に基づいてフィルタリング
  let filteredExercises = [...mockExercises]

  if (params.query) {
    const query = params.query.toLowerCase()
    filteredExercises = filteredExercises.filter(
      (exercise) => exercise.title.toLowerCase().includes(query) || exercise.description.toLowerCase().includes(query),
    )
  }

  if (params.category) {
    filteredExercises = filteredExercises.filter((exercise) => exercise.category === params.category)
  }

  if (params.difficulty) {
    filteredExercises = filteredExercises.filter((exercise) => exercise.difficulty === params.difficulty)
  }

  if (params.maxDuration) {
    filteredExercises = filteredExercises.filter((exercise) => exercise.duration <= params.maxDuration!)
  }

  if (params.targetMuscles && params.targetMuscles.length > 0) {
    filteredExercises = filteredExercises.filter((exercise) =>
      params.targetMuscles!.some((muscle) => exercise.targetMuscles.includes(muscle)),
    )
  }

  if (params.equipment && params.equipment.length > 0) {
    filteredExercises = filteredExercises.filter((exercise) =>
      exercise.equipment ? params.equipment!.some((eq) => exercise.equipment!.includes(eq)) : false,
    )
  }

  // ページネーション
  const page = params.page || 1
  const limit = params.limit || 10
  const start = (page - 1) * limit
  const end = start + limit
  const paginatedExercises = filteredExercises.slice(start, end)

  return {
    exercises: paginatedExercises,
    total: filteredExercises.length,
    page,
    limit,
  }
}

// モックの運動詳細を返す関数
function getMockExerciseById(id: string): Exercise | null {
  // モックデータ（実際のAPIが利用できない場合のフォールバック）
  const mockExercises: Record<string, Exercise> = {
    "1": {
      id: "1",
      title: "ウォーキング",
      description: "最も基本的な有酸素運動で、血圧を下げる効果があります。",
      imageUrl: "/placeholder.svg?height=200&width=300",
      category: "cardio",
      difficulty: "beginner",
      duration: 30,
      caloriesBurned: 150,
      targetMuscles: ["脚", "臀部", "心肺機能"],
      steps: [
        "背筋を伸ばし、肩の力を抜いた姿勢で立ちます。",
        "視線は前方に向け、あごを引きます。",
        "かかとから着地し、つま先で蹴り出すように歩きます。",
        "腕は自然に振り、歩幅は少し広めにとります。",
        "呼吸は自然に行い、会話ができる程度の速さで歩きます。",
      ],
      benefits: ["血圧の低下", "心肺機能の向上", "脂肪燃焼", "ストレス軽減", "骨密度の向上"],
      tips: [
        "歩く前後にストレッチを行うと効果的です。",
        "水分補給を忘れずに行いましょう。",
        "徐々に歩く距離や時間を増やしていきましょう。",
      ],
      contraindications: ["重度の関節痛がある場合は医師に相談してください。"],
    },
    "2": {
      id: "2",
      title: "ヨガ - 太陽礼拝",
      description: "一連の流れるような動きで、柔軟性と筋力を向上させるヨガのポーズです。",
      imageUrl: "/placeholder.svg?height=200&width=300",
      category: "yoga",
      difficulty: "intermediate",
      duration: 15,
      caloriesBurned: 100,
      targetMuscles: ["全身", "背中", "腹部", "腕"],
      steps: [
        "山のポーズで始めます。足を揃えて立ち、手を胸の前で合わせます。",
        "息を吸いながら、手を頭上に伸ばします。",
        "息を吐きながら、前屈します。",
        "息を吸いながら、上体を少し持ち上げ、視線を前に向けます。",
        "息を吐きながら、両手を床につけ、足を後ろに伸ばしてプランクのポーズをとります。",
        "息を吸いながら、腕を曲げて体を床に近づけます（チャトランガ）。",
        "息を吐きながら、胸を持ち上げてコブラのポーズをとります。",
        "息を吸いながら、お尻を持ち上げて逆V字のポーズ（ダウンドッグ）をとります。",
        "息を吐きながら、足を手元に戻し、前屈します。",
        "息を吸いながら、上体を起こし、手を頭上に伸ばします。",
        "息を吐きながら、山のポーズに戻ります。",
      ],
      benefits: ["柔軟性の向上", "筋力の向上", "ストレス軽減", "血液循環の改善", "姿勢の改善"],
      tips: [
        "呼吸と動きを同期させることが重要です。",
        "無理をせず、自分のペースで行いましょう。",
        "朝の習慣にすると一日を活力的に始められます。",
      ],
      contraindications: [
        "高血圧や心臓疾患がある場合は医師に相談してください。",
        "妊娠中は一部のポーズを避けるべきです。",
      ],
    },
  }

  return mockExercises[id] || null
}

// モックの運動プランを返す関数
function getMockExercisePlan(params: {
  goal: string
  fitnessLevel: DifficultyLevel
  timeAvailable: number
}): any {
  // モックデータ（実際のAPIが利用できない場合のフォールバック）
  const mockPlans: Record<string, any> = {
    weight_loss: {
      title: "体重減少プラン",
      description: "脂肪燃焼と筋力向上を組み合わせたプログラムで、効率的に体重を減らします。",
      weeklyPlan: [
        {
          day: "月曜日",
          exercises: [
            { id: "1", title: "ウォーキング", duration: 30 },
            { id: "3", title: "腹筋運動", duration: 10 },
          ],
        },
        {
          day: "火曜日",
          exercises: [
            { id: "4", title: "軽いジョギング", duration: 20 },
            { id: "5", title: "スクワット", duration: 10 },
          ],
        },
        {
          day: "水曜日",
          exercises: [{ id: "2", title: "ヨガ - 太陽礼拝", duration: 15 }],
        },
        {
          day: "木曜日",
          exercises: [{ id: "6", title: "サイクリング", duration: 30 }],
        },
        {
          day: "金曜日",
          exercises: [
            { id: "7", title: "腕立て伏せ", duration: 10 },
            { id: "8", title: "プランク", duration: 5 },
            { id: "9", title: "ランジ", duration: 10 },
          ],
        },
        {
          day: "土曜日",
          exercises: [{ id: "10", title: "水泳", duration: 30 }],
        },
        {
          day: "日曜日",
          exercises: [{ id: "11", title: "ストレッチ", duration: 15 }],
        },
      ],
      tips: [
        "運動と併せて、バランスの取れた食事を心がけましょう。",
        "水分をしっかり摂取しましょう。",
        "十分な睡眠を取りましょう。",
        "無理をせず、徐々に運動量を増やしていきましょう。",
      ],
    },
    blood_pressure: {
      title: "血圧管理プラン",
      description: "血圧を下げるための有酸素運動と軽い筋力トレーニングを組み合わせたプログラムです。",
      weeklyPlan: [
        {
          day: "月曜日",
          exercises: [{ id: "1", title: "ウォーキング", duration: 30 }],
        },
        {
          day: "火曜日",
          exercises: [
            { id: "12", title: "軽いストレッチ", duration: 15 },
            { id: "13", title: "深呼吸エクササイズ", duration: 10 },
          ],
        },
        {
          day: "水曜日",
          exercises: [{ id: "1", title: "ウォーキング", duration: 30 }],
        },
        {
          day: "木曜日",
          exercises: [{ id: "2", title: "ヨガ - 太陽礼拝", duration: 15 }],
        },
        {
          day: "金曜日",
          exercises: [{ id: "1", title: "ウォーキング", duration: 30 }],
        },
        {
          day: "土曜日",
          exercises: [{ id: "14", title: "軽い水中ウォーキング", duration: 20 }],
        },
        {
          day: "日曜日",
          exercises: [{ id: "15", title: "リラクゼーションエクササイズ", duration: 15 }],
        },
      ],
      tips: [
        "塩分の摂取を控えましょう。",
        "アルコールは適量を心がけましょう。",
        "ストレスを溜めないようにしましょう。",
        "定期的に血圧を測定しましょう。",
      ],
    },
  }

  // 目標に基づいてプランを選択
  let plan = mockPlans["weight_loss"] // デフォルト

  if (
    params.goal.toLowerCase().includes("blood") ||
    params.goal.toLowerCase().includes("pressure") ||
    params.goal.toLowerCase().includes("血圧")
  ) {
    plan = mockPlans["blood_pressure"]
  }

  // フィットネスレベルに応じて調整
  if (params.fitnessLevel === "beginner") {
    plan.weeklyPlan.forEach((day: any) => {
      day.exercises.forEach((exercise: any) => {
        exercise.duration = Math.max(10, exercise.duration - 5)
      })
    })
  } else if (params.fitnessLevel === "advanced") {
    plan.weeklyPlan.forEach((day: any) => {
      day.exercises.forEach((exercise: any) => {
        exercise.duration = exercise.duration + 10
      })
    })
  }

  // 利用可能な時間に応じて調整
  if (params.timeAvailable < 30) {
    plan.weeklyPlan.forEach((day: any) => {
      // 運動時間が長いものを短くする
      day.exercises = day.exercises.map((exercise: any) => {
        return {
          ...exercise,
          duration: Math.min(exercise.duration, params.timeAvailable),
        }
      })

      // 合計時間が利用可能時間を超える場合、一部の運動を削除
      let totalTime = day.exercises.reduce((acc: number, curr: any) => acc + curr.duration, 0)
      while (totalTime > params.timeAvailable && day.exercises.length > 1) {
        day.exercises.pop()
        totalTime = day.exercises.reduce((acc: number, curr: any) => acc + curr.duration, 0)
      }
    })
  }

  return plan
}

