import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { extractTextFromImage } from "@/lib/vision"

// OCR処理を行うAPI
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    // 認証チェック
    if (!session || !session.user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json({ error: "画像URLが指定されていません" }, { status: 400 })
    }

    // 画像からテキストを抽出
    const result = await extractTextFromImage(imageUrl)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("OCR処理エラー:", error)
    return NextResponse.json({ error: "OCR処理に失敗しました" }, { status: 500 })
  }
}

