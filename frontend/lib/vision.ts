"use server"

import { ImageAnnotatorClient } from "@google-cloud/vision"

// Google Cloud Vision APIクライアントの初期化
// 注: 実際の実装では、適切な認証情報を設定する必要があります
const client = new ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
})

// 画像からテキストを抽出するOCR処理
export async function extractTextFromImage(imageUrl: string) {
  try {
    const [result] = await client.textDetection(imageUrl)
    const detections = result.textAnnotations || []

    if (detections.length === 0) {
      return { success: false, error: "テキストが検出されませんでした" }
    }

    // 検出されたすべてのテキスト
    const fullText = detections[0].description || ""

    // 健康データの抽出（正規表現を使用）
    const extractedData = extractHealthDataFromText(fullText)

    return {
      success: true,
      fullText,
      extractedData,
    }
  } catch (error) {
    console.error("OCR処理エラー:", error)
    return {
      success: false,
      error: "画像の処理中にエラーが発生しました",
    }
  }
}

// テキストから健康データを抽出する関数
function extractHealthDataFromText(text: string) {
  // 正規表現パターン
  const patterns = {
    height: /身長[：:]\s*(\d+\.?\d*)/,
    weight: /体重[：:]\s*(\d+\.?\d*)/,
    bmi: /BMI[：:]\s*(\d+\.?\d*)/,
    systolicBP: /収縮期血圧[：:]\s*(\d+)/,
    diastolicBP: /拡張期血圧[：:]\s*(\d+)/,
    bloodSugar: /血糖値[：:]\s*(\d+)/,
    hdlCholesterol: /HDL[：:]\s*(\d+)/,
    ldlCholesterol: /LDL[：:]\s*(\d+)/,
    triglycerides: /中性脂肪[：:]\s*(\d+)/,
    uricAcid: /尿酸[：:]\s*(\d+\.?\d*)/,
    ast: /AST[：:]\s*(\d+)/,
    alt: /ALT[：:]\s*(\d+)/,
    gammaGTP: /γ-?GTP[：:]\s*(\d+)/,
  }

  const extractedData: Record<string, number | null> = {}

  // 各項目を正規表現で抽出
  Object.entries(patterns).forEach(([key, pattern]) => {
    const match = text.match(pattern)
    extractedData[key] = match ? Number.parseFloat(match[1]) : null
  })

  return extractedData
}

