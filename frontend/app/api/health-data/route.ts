import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { saveHealthData, getUserHealthData, getHealthDataById, deleteHealthData } from "@/lib/db"

// 健康データを保存するAPI
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
    if (!data.date) {
      return NextResponse.json({ error: "日付は必須です" }, { status: 400 })
    }

    // データを保存
    const id = await saveHealthData({
      ...data,
      userId,
    })

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error("健康データ保存エラー:", error)
    return NextResponse.json({ error: "データの保存に失敗しました" }, { status: 500 })
  }
}

// ユーザーの健康データを取得するAPI
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    // 認証チェック
    if (!session || !session.user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    const userId = session.user.id
    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    // 特定のデータを取得
    if (id) {
      const healthData = await getHealthDataById(id)

      // データが存在しない、または他のユーザーのデータにアクセスしようとしている場合
      if (!healthData || healthData.user_id !== userId) {
        return NextResponse.json({ error: "データが見つかりません" }, { status: 404 })
      }

      return NextResponse.json(healthData)
    }

    // ユーザーのすべての健康データを取得
    const healthData = await getUserHealthData(userId)
    return NextResponse.json(healthData)
  } catch (error) {
    console.error("健康データ取得エラー:", error)
    return NextResponse.json({ error: "データの取得に失敗しました" }, { status: 500 })
  }
}

// 健康データを削除するAPI
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession()

    // 認証チェック
    if (!session || !session.user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    const userId = session.user.id
    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "IDが指定されていません" }, { status: 400 })
    }

    // データが存在するか、そしてそれが現在のユーザーのものかを確認
    const healthData = await getHealthDataById(id)

    if (!healthData) {
      return NextResponse.json({ error: "データが見つかりません" }, { status: 404 })
    }

    if (healthData.user_id !== userId) {
      return NextResponse.json({ error: "このデータを削除する権限がありません" }, { status: 403 })
    }

    // データを削除
    await deleteHealthData(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("健康データ削除エラー:", error)
    return NextResponse.json({ error: "データの削除に失敗しました" }, { status: 500 })
  }
}

