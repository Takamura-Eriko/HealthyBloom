import { type NextRequest, NextResponse } from "next/server"
import { searchExercises, getExerciseById, getExercisePlan } from "@/lib/exercise-api"

// 運動を検索するAPI
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    // IDが指定されている場合は特定の運動を取得
    if (id) {
      const exercise = await getExerciseById(id)
      if (!exercise) {
        return NextResponse.json({ error: "Exercise not found" }, { status: 404 })
      }
      return NextResponse.json(exercise)
    }

    // 検索パラメータを取得
    const query = url.searchParams.get("query") || undefined
    const category = (url.searchParams.get("category") as any) || undefined
    const difficulty = (url.searchParams.get("difficulty") as any) || undefined
    const maxDuration = url.searchParams.get("maxDuration")
      ? Number.parseInt(url.searchParams.get("maxDuration")!)
      : undefined
    const targetMuscles = url.searchParams.get("targetMuscles")?.split(",") || undefined
    const equipment = url.searchParams.get("equipment")?.split(",") || undefined
    const page = url.searchParams.get("page") ? Number.parseInt(url.searchParams.get("page")!) : 1
    const limit = url.searchParams.get("limit") ? Number.parseInt(url.searchParams.get("limit")!) : 10

    // 運動を検索
    const result = await searchExercises({
      query,
      category,
      difficulty,
      maxDuration,
      targetMuscles,
      equipment,
      page,
      limit,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Exercise API error:", error)
    return NextResponse.json({ error: "Failed to fetch exercises" }, { status: 500 })
  }
}

// 運動プランを取得するAPI
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { goal, fitnessLevel, timeAvailable } = body

    if (!goal || !fitnessLevel || !timeAvailable) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const plan = await getExercisePlan({
      goal,
      fitnessLevel,
      timeAvailable,
    })

    return NextResponse.json(plan)
  } catch (error) {
    console.error("Exercise plan API error:", error)
    return NextResponse.json({ error: "Failed to generate exercise plan" }, { status: 500 })
  }
}

