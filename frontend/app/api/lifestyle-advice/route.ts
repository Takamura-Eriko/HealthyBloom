import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { saveLifestyleAdvice, getUserLifestyleAdvice } from "@/lib/db"

// 生活習慣アドバイスを保存するAPI
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
    if (!data.category || !data.title || !data.description) {
      return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 })
    }

    // データを保存
    const id = await saveLifestyleAdvice({
      ...data,
      userId,
    })

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error("生活習慣アドバイス保存エラー:", error)
    return NextResponse.json({ error: "データの保存に失敗しました" }, { status: 500 })
  }
}

// 生活習慣アドバイスを取得するAPI
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    // 認証チェック
    if (!session || !session.user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    const userId = session.user.id
    const url = new URL(request.url)
    const category = url.searchParams.get("category")

    // 生活習慣アドバイスを取得
    const advice = await getUserLifestyleAdvice(userId, category || undefined)

    return NextResponse.json(advice)
  } catch (error) {
    console.error("生活習慣アドバイス取得エラー:", error)
    return NextResponse.json({ error: "データの取得に失敗しました" }, { status: 500 })
  }
}

