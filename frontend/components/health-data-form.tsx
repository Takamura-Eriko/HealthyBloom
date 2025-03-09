"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { useState } from "react"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth"
import { saveHealthData } from "@/lib/db"

const healthDataSchema = z.object({
  date: z.string().min(1, {
    message: "日付を入力してください",
  }),
  height: z.string().optional(),
  weight: z.string().optional(),
  bmi: z.string().optional(),
  systolicBP: z.string().optional(),
  diastolicBP: z.string().optional(),
  pulse: z.string().optional(),
  bloodSugar: z.string().optional(),
  hdlCholesterol: z.string().optional(),
  ldlCholesterol: z.string().optional(),
  triglycerides: z.string().optional(),
  uricAcid: z.string().optional(),
  ast: z.string().optional(),
  alt: z.string().optional(),
  gammaGTP: z.string().optional(),
})

// 正常値の範囲
const normalRanges = {
  bmi: { min: 18.5, max: 25 },
  systolicBP: { min: 90, max: 120 },
  diastolicBP: { min: 60, max: 80 },
  pulse: { min: 60, max: 100 },
  bloodSugar: { min: 70, max: 100 },
  hdlCholesterol: { min: 40, max: 60 },
  ldlCholesterol: { min: 0, max: 100 },
  triglycerides: { min: 0, max: 150 },
  uricAcid: { min: 3.5, max: 7.2 },
  ast: { min: 10, max: 40 },
  alt: { min: 7, max: 56 },
  gammaGTP: { min: 0, max: 73 },
}

export default function HealthDataForm() {
  const [abnormalValues, setAbnormalValues] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()

  const form = useForm<z.infer<typeof healthDataSchema>>({
    resolver: zodResolver(healthDataSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      height: "",
      weight: "",
      bmi: "",
      systolicBP: "",
      diastolicBP: "",
      pulse: "",
      bloodSugar: "",
      hdlCholesterol: "",
      ldlCholesterol: "",
      triglycerides: "",
      uricAcid: "",
      ast: "",
      alt: "",
      gammaGTP: "",
    },
  })

  function checkAbnormalValues(data: z.infer<typeof healthDataSchema>) {
    const abnormal: string[] = []

    Object.entries(normalRanges).forEach(([key, range]) => {
      const value = Number.parseFloat(data[key as keyof z.infer<typeof healthDataSchema>] || "0")
      if (value && (value < range.min || value > range.max)) {
        abnormal.push(key)
      }
    })

    setAbnormalValues(abnormal)
    return abnormal
  }

  async function onSubmit(data: z.infer<typeof healthDataSchema>) {
    if (!user) {
      toast({
        title: "エラー",
        description: "ログインが必要です",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    const abnormal = checkAbnormalValues(data)

    try {
      // 数値データを変換
      const numericData: Record<string, number | null> = {}
      Object.entries(data).forEach(([key, value]) => {
        if (key === "date") return
        numericData[key] = value ? Number.parseFloat(value) : null
      })

      // Firestoreにデータを保存
      await saveHealthData({
        userId: user.uid,
        date: data.date,
        ...numericData,
      })

      if (abnormal.length > 0) {
        toast({
          title: "健康データを保存しました",
          description: "一部の値が正常範囲外です。詳細を確認してください。",
          variant: "destructive",
        })
      } else {
        toast({
          title: "健康データを保存しました",
          description: "すべての値は正常範囲内です。",
        })
      }
    } catch (error) {
      console.error("データ保存エラー:", error)
      toast({
        title: "エラー",
        description: "データの保存に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // BMIを自動計算
  const calculateBMI = () => {
    const height = Number.parseFloat(form.getValues("height"))
    const weight = Number.parseFloat(form.getValues("weight"))

    if (height && weight) {
      const heightInMeters = height / 100
      const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1)
      form.setValue("bmi", bmi)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>検査日</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>身長 (cm)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="例: 165"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      setTimeout(calculateBMI, 100)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>体重 (kg)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="例: 60"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      setTimeout(calculateBMI, 100)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bmi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>BMI</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="自動計算"
                    {...field}
                    className={abnormalValues.includes("bmi") ? "border-destructive" : ""}
                    readOnly
                  />
                </FormControl>
                {abnormalValues.includes("bmi") && (
                  <FormDescription className="text-destructive">正常範囲: 18.5-25</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 他のフォームフィールドは省略（元のコードと同じ） */}

        {abnormalValues.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>注意</AlertTitle>
            <AlertDescription>一部の値が正常範囲外です。赤枠で表示されている項目を確認してください。</AlertDescription>
          </Alert>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "保存中..." : "保存する"}
        </Button>
      </form>
    </Form>
  )
}

