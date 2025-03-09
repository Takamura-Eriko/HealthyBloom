import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { saveMealSuggestion, getUserMealSuggestions } from "@/lib/db"

// 食事提案を保存するAPI
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    // 認証チェック
    if (!session || !session.user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    const userId = session.user.id
    const data = await request.json()

    // データの検証
    if (!data.title || !data.description || !data.nutritionType) {
      return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 })
    }

    // データを保存
    const id = await saveMealSuggestion({
      ...data,
      userId,
    })

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error("食事提案保存エラー:", error)
    return NextResponse.json({ error: "データの保存に失敗しました" }, { status: 500 })
  }
}

// 食事提案を取得するAPI
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    // 認証チェック
    if (!session || !session.user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    const userId = session.user.id
    const url = new URL(request.url)
    const nutritionType = url.searchParams.get("nutritionType")

    // 食事提案を取得
    const mealSuggestions = await getUserMealSuggestions(userId, nutritionType || undefined)

    return NextResponse.json(mealSuggestions)
  } catch (error) {
    console.error("食事提案取得エラー:", error)
    return NextResponse.json({ error: "データの取得に失敗しました" }, { status: 500 })
  }
}

