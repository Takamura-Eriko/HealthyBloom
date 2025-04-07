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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

// TODO 項目名を修正する
const healthDataSchema = z.object({
  date: z.string().min(1, {
    message: "日付を入力してください",
  }),
  age: z.string().min(1, {
    message: "年齢を入力してください",
  }),
  gender: z.string().min(1, {
    message: "性別を選択してください",
  }),
  height: z.string().optional(),
  weight: z.string().optional(),
  bmi: z.string().optional(),
  blood_pressure_systolic: z.string().optional(),
  blood_pressure_diastolic: z.string().optional(),
  blood_sugar: z.string().optional(),
  hba1c: z.string().optional(),
  cholesterol_total: z.string().optional(),
  cholesterol_hdl: z.string().optional(),
  cholesterol_ldl: z.string().optional(),
  triglycerides: z.string().optional(),
  liver_got: z.string().optional(),
  liver_gpt: z.string().optional(),
  liver_r_gpt: z.string().optional(),
})

// 正常値の範囲
const normalRanges = {
  bmi: { min: 13, max: 60 },
  blood_pressure_systolic: { min: 90, max: 200},
  blood_pressure_diastolic: { min: 60, max: 80 },
  blood_sugar: { min: 60, max: 150 },
  hba1c: { min: 4.6, max: 8.0 },
  cholesterol_total: { min: 130, max: 273 },
  cholesterol_hdl: { min: 0, max: 70 },
  cholesterol_ldl: { min: 0, max: 190 },
  triglycerides: { min: 0, max: 240 },
  liver_got: { min: 10, max: 100 },
  liver_gpt: { min: 7, max: 100 },
  liver_r_gpt: { min: 0, max: 150 },
}

export default function HealthDataForm() {

  console.log("#HealthDataForm#")
  const router = useRouter() // ← ここで定義する！

  const [abnormalValues, setAbnormalValues] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()

  const form = useForm<z.infer<typeof healthDataSchema>>({
    resolver: zodResolver(healthDataSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      age: "",
      gender: "",
      height: "",
      weight: "",
      bmi: "",
      blood_pressure_systolic: "",
      blood_pressure_diastolic: "",
      blood_sugar: "",
      hba1c: "",
      cholesterol_total: "",
      cholesterol_hdl: "",
      cholesterol_ldl: "",
      triglycerides: "",
      liver_got: "",
      liver_gpt: "",
      liver_r_gpt: "",
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
      //TODO firebaseのuidから、userテーブルのuuidを取得する

      const token = await user.getIdToken();

      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
  
      if (!response.ok) {
        throw new Error("Authentication failed");
      }
  
      const userData = await response.json();

      console.log(userData)

      // Firestoreにデータを保存
      const healthData = {
        user_id: userData.user.id,
        date: data.date,
        gender: data.gender,
      } as any

      // 数値データを変換して追加
      // TODO 項目名を修正する
      console.log(data)
      if (data.age) healthData.age = Number.parseInt(data.age, 10)
      if (data.height) healthData.height = Number.parseFloat(data.height)
      if (data.weight) healthData.weight = Number.parseFloat(data.weight)
      if (data.bmi) healthData.bmi = Number.parseFloat(data.bmi)


      if (data.blood_pressure_systolic) healthData.blood_pressure_systolic = Number.parseFloat(data.blood_pressure_systolic)
      if (data.blood_pressure_diastolic) healthData.blood_pressure_diastolic = Number.parseFloat(data.blood_pressure_diastolic)
      if (data.blood_sugar) healthData.blood_sugar = Number.parseFloat(data.blood_sugar)
      if (data.hba1c) healthData.hba1c = Number.parseFloat(data.hba1c)
      if (data.cholesterol_total) healthData.cholesterol_total = Number.parseFloat(data.cholesterol_total)
      if (data.cholesterol_hdl) healthData.cholesterol_hdl = Number.parseFloat(data.cholesterol_hdl)
      if (data.cholesterol_ldl) healthData.cholesterol_ldl = Number.parseFloat(data.cholesterol_ldl)
      if (data.triglycerides) healthData.triglycerides = Number.parseFloat(data.triglycerides)
      if (data.liver_got) healthData.liver_got = Number.parseFloat(data.liver_got)
      if (data.liver_gpt) healthData.liver_gpt = Number.parseFloat(data.liver_gpt)
      if (data.liver_r_gpt) healthData.liver_r_gpt = Number.parseFloat(data.liver_r_gpt)


      console.log(healthData)

      await saveHealthData(healthData)

    
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
      router.push("/")

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
    const height = Number.parseFloat(form.getValues("height") || "0")
    const weight = Number.parseFloat(form.getValues("weight") || "0")

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
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>年齢</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="例: 40" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>性別</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="性別を選択" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">男性</SelectItem>
                    <SelectItem value="female">女性</SelectItem>
                    <SelectItem value="other">その他</SelectItem>
                  </SelectContent>
                </Select>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="blood_pressure_systolic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>最高血圧 (mmHg)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="例: 120"
                    {...field}
                    className={abnormalValues.includes("blood_pressure_systolic") ? "border-destructive" : ""}
                  />
                </FormControl>
                {abnormalValues.includes("blood_pressure_systolic") && (
                  <FormDescription className="text-destructive">正常範囲: 90-120</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="blood_pressure_diastolic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>最低血圧 (mmHg)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="例: 80"
                    {...field}
                    className={abnormalValues.includes("blood_pressure_diastolic") ? "border-destructive" : ""}
                  />
                </FormControl>
                {abnormalValues.includes("blood_pressure_diastolic") && (
                  <FormDescription className="text-destructive">正常範囲: 60-80</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="blood_sugar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>血糖値 (mg/dL)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="例: 90"
                    {...field}
                    className={abnormalValues.includes("blood_sugar") ? "border-destructive" : ""}
                  />
                </FormControl>
                {abnormalValues.includes("blood_sugar") && (
                  <FormDescription className="text-destructive">正常範囲: 70-100</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hba1c"
            render={({ field }) => (
              <FormItem>
                <FormLabel>HbA1c (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="例: 5.6"
                    {...field}
                    className={abnormalValues.includes("hba1c") ? "border-destructive" : ""}
                    step="0.1"
                  />
                </FormControl>
                {abnormalValues.includes("hba1c") && (
                  <FormDescription className="text-destructive">正常範囲: 4.6-6.2</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="cholesterol_total"
            render={({ field }) => (
              <FormItem>
                <FormLabel>総コレステロール (mg/dL)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="例: 180"
                    {...field}
                    className={abnormalValues.includes("cholesterol_total") ? "border-destructive" : ""}
                  />
                </FormControl>
                {abnormalValues.includes("cholesterol_total") && (
                  <FormDescription className="text-destructive">正常範囲: 130-220</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cholesterol_hdl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>HDLコレステロール (mg/dL)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="例: 50"
                    {...field}
                    className={abnormalValues.includes("cholesterol_hdl") ? "border-destructive" : ""}
                  />
                </FormControl>
                {abnormalValues.includes("cholesterol_hdl") && (
                  <FormDescription className="text-destructive">正常範囲: 40-60</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cholesterol_ldl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LDLコレステロール (mg/dL)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="例: 90"
                    {...field}
                    className={abnormalValues.includes("cholesterol_ldl") ? "border-destructive" : ""}
                  />
                </FormControl>
                {abnormalValues.includes("cholesterol_ldl") && (
                  <FormDescription className="text-destructive">正常範囲: 0-100</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="triglycerides"
            render={({ field }) => (
              <FormItem>
                <FormLabel>中性脂肪 (mg/dL)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="例: 100"
                    {...field}
                    className={abnormalValues.includes("triglycerides") ? "border-destructive" : ""}
                  />
                </FormControl>
                {abnormalValues.includes("triglycerides") && (
                  <FormDescription className="text-destructive">正常範囲: 0-150</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="liver_got"
            render={({ field }) => (
              <FormItem>
                <FormLabel>liver_got/AST (U/L)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="例: 25"
                    {...field}
                    className={abnormalValues.includes("liver_got") ? "border-destructive" : ""}
                  />
                </FormControl>
                {abnormalValues.includes("liver_got") && (
                  <FormDescription className="text-destructive">正常範囲: 10-40</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="liver_gpt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>liver_gpt/ALT (U/L)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="例: 25"
                    {...field}
                    className={abnormalValues.includes("liver_gpt") ? "border-destructive" : ""}
                  />
                </FormControl>
                {abnormalValues.includes("liver_gpt") && (
                  <FormDescription className="text-destructive">正常範囲: 7-56</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="liver_r_gpt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>γ-GTP (U/L)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="例: 30"
                    {...field}
                    className={abnormalValues.includes("liver_r_gpt") ? "border-destructive" : ""}
                  />
                </FormControl>
                {abnormalValues.includes("liver_r_gpt") && (
                  <FormDescription className="text-destructive">正常範囲: 0-73</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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

