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
  systolicBP: z.string().optional(),
  diastolicBP: z.string().optional(),
  bloodSugar: z.string().optional(),
  hba1c: z.string().optional(),
  totalCholesterol: z.string().optional(),
  hdlCholesterol: z.string().optional(),
  ldlCholesterol: z.string().optional(),
  triglycerides: z.string().optional(),
  got: z.string().optional(),
  gpt: z.string().optional(),
  rGpt: z.string().optional(),
})

// 正常値の範囲
const normalRanges = {
  bmi: { min: 18.5, max: 25 },
  systolicBP: { min: 90, max: 120 },
  diastolicBP: { min: 60, max: 80 },
  bloodSugar: { min: 70, max: 100 },
  hba1c: { min: 4.6, max: 6.2 },
  totalCholesterol: { min: 130, max: 220 },
  hdlCholesterol: { min: 40, max: 60 },
  ldlCholesterol: { min: 0, max: 100 },
  triglycerides: { min: 0, max: 150 },
  got: { min: 10, max: 40 },
  gpt: { min: 7, max: 56 },
  rGpt: { min: 0, max: 73 },
}

export default function HealthDataForm() {
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
      systolicBP: "",
      diastolicBP: "",
      bloodSugar: "",
      hba1c: "",
      totalCholesterol: "",
      hdlCholesterol: "",
      ldlCholesterol: "",
      triglycerides: "",
      got: "",
      gpt: "",
      rGpt: "",
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
      // Firestoreにデータを保存
      const healthData = {
        userId: user.uid,
        date: data.date,
        gender: data.gender,
      } as any

      // 数値データを変換して追加
      if (data.age) healthData.age = Number.parseInt(data.age, 10)
      if (data.height) healthData.height = Number.parseFloat(data.height)
      if (data.weight) healthData.weight = Number.parseFloat(data.weight)
      if (data.bmi) healthData.bmi = Number.parseFloat(data.bmi)
      if (data.systolicBP) healthData.systolicBP = Number.parseFloat(data.systolicBP)
      if (data.diastolicBP) healthData.diastolicBP = Number.parseFloat(data.diastolicBP)
      if (data.bloodSugar) healthData.bloodSugar = Number.parseFloat(data.bloodSugar)
      if (data.hba1c) healthData.hba1c = Number.parseFloat(data.hba1c)
      if (data.totalCholesterol) healthData.totalCholesterol = Number.parseFloat(data.totalCholesterol)
      if (data.hdlCholesterol) healthData.hdlCholesterol = Number.parseFloat(data.hdlCholesterol)
      if (data.ldlCholesterol) healthData.ldlCholesterol = Number.parseFloat(data.ldlCholesterol)
      if (data.triglycerides) healthData.triglycerides = Number.parseFloat(data.triglycerides)
      if (data.got) healthData.got = Number.parseFloat(data.got)
      if (data.gpt) healthData.gpt = Number.parseFloat(data.gpt)
      if (data.rGpt) healthData.rGpt = Number.parseFloat(data.rGpt)

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
            name="systolicBP"
            render={({ field }) => (
              <FormItem>
                <FormLabel>最高血圧 (mmHg)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="例: 120"
                    {...field}
                    className={abnormalValues.includes("systolicBP") ? "border-destructive" : ""}
                  />
                </FormControl>
                {abnormalValues.includes("systolicBP") && (
                  <FormDescription className="text-destructive">正常範囲: 90-120</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="diastolicBP"
            render={({ field }) => (
              <FormItem>
                <FormLabel>最低血圧 (mmHg)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="例: 80"
                    {...field}
                    className={abnormalValues.includes("diastolicBP") ? "border-destructive" : ""}
                  />
                </FormControl>
                {abnormalValues.includes("diastolicBP") && (
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
            name="bloodSugar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>血糖値 (mg/dL)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="例: 90"
                    {...field}
                    className={abnormalValues.includes("bloodSugar") ? "border-destructive" : ""}
                  />
                </FormControl>
                {abnormalValues.includes("bloodSugar") && (
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
            name="totalCholesterol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>総コレステロール (mg/dL)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="例: 180"
                    {...field}
                    className={abnormalValues.includes("totalCholesterol") ? "border-destructive" : ""}
                  />
                </FormControl>
                {abnormalValues.includes("totalCholesterol") && (
                  <FormDescription className="text-destructive">正常範囲: 130-220</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hdlCholesterol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>HDLコレステロール (mg/dL)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="例: 50"
                    {...field}
                    className={abnormalValues.includes("hdlCholesterol") ? "border-destructive" : ""}
                  />
                </FormControl>
                {abnormalValues.includes("hdlCholesterol") && (
                  <FormDescription className="text-destructive">正常範囲: 40-60</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ldlCholesterol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LDLコレステロール (mg/dL)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="例: 90"
                    {...field}
                    className={abnormalValues.includes("ldlCholesterol") ? "border-destructive" : ""}
                  />
                </FormControl>
                {abnormalValues.includes("ldlCholesterol") && (
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
            name="got"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GOT/AST (U/L)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="例: 25"
                    {...field}
                    className={abnormalValues.includes("got") ? "border-destructive" : ""}
                  />
                </FormControl>
                {abnormalValues.includes("got") && (
                  <FormDescription className="text-destructive">正常範囲: 10-40</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gpt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GPT/ALT (U/L)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="例: 25"
                    {...field}
                    className={abnormalValues.includes("gpt") ? "border-destructive" : ""}
                  />
                </FormControl>
                {abnormalValues.includes("gpt") && (
                  <FormDescription className="text-destructive">正常範囲: 7-56</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rGpt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>γ-GTP (U/L)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="例: 30"
                    {...field}
                    className={abnormalValues.includes("rGpt") ? "border-destructive" : ""}
                  />
                </FormControl>
                {abnormalValues.includes("rGpt") && (
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

