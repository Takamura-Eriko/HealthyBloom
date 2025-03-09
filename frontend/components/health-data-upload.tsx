"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth"
import { uploadImage } from "@/lib/storage"
import { toast } from "@/components/ui/use-toast"
import { saveHealthData } from "@/lib/db"

export default function HealthDataUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [extractedData, setExtractedData] = useState<Record<string, number | null> | null>(null)
  const { user } = useAuth()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    setError(null)
    setSuccess(false)
    setExtractedData(null)

    if (selectedFile) {
      // 画像ファイルのみ許可
      if (!selectedFile.type.startsWith("image/")) {
        setError("画像ファイルを選択してください")
        setPreview(null)
        return
      }

      // プレビュー表示
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setPreview(null)
    }
  }

  const handleUpload = async () => {
    if (!file || !user) {
      setError("ファイルを選択してください")
      return
    }

    setUploading(true)
    setProgress(0)
    setError(null)
    setExtractedData(null)

    try {
      // Firebase Storageに画像をアップロード
      const imagePath = `health-reports/${user.uid}/${Date.now()}_${file.name}`
      const imageUrl = await uploadImage(file, imagePath, (progress) => {
        setProgress(progress)
      })

      // OCR処理のためのAPIを呼び出し
      const response = await fetch("/api/ocr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "画像の処理に失敗しました")
      }

      // 抽出されたデータを保存
      if (result.extractedData) {
        setExtractedData(result.extractedData)

        // Firestoreにデータを保存
        await saveHealthData({
          userId: user.uid,
          date: new Date().toISOString().split("T")[0],
          ...result.extractedData,
          imageUrl,
        })

        setSuccess(true)
        toast({
          title: "成功",
          description: "健康診断データの抽出と保存に成功しました",
        })
      } else {
        setError("データを抽出できませんでした")
      }
    } catch (err) {
      console.error("アップロードエラー:", err)
      setError("アップロードに失敗しました。もう一度お試しください。")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="health-report">健康診断結果の画像</Label>
        <Input id="health-report" type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
      </div>

      {preview && (
        <Card>
          <CardContent className="p-4">
            <div className="aspect-video relative rounded-md overflow-hidden border">
              <img
                src={preview || "/placeholder.svg"}
                alt="健康診断結果のプレビュー"
                className="object-contain w-full h-full"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">OCR処理中...</span>
          </div>
          <Progress value={progress} />
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && extractedData && (
        <Alert>
          <FileText className="h-4 w-4" />
          <AlertTitle>成功</AlertTitle>
          <AlertDescription>
            健康診断データの抽出に成功しました。以下のデータが保存されました：
            <ul className="mt-2 space-y-1 text-sm">
              {Object.entries(extractedData).map(
                ([key, value]) =>
                  value && (
                    <li key={key}>
                      {key}: {value}
                    </li>
                  ),
              )}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Button onClick={handleUpload} disabled={!file || uploading || !user} className="w-full sm:w-auto">
        {uploading ? (
          <span>処理中...</span>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            アップロードして解析
          </>
        )}
      </Button>
    </div>
  )
}

