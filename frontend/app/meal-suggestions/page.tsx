"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Clock, Flower, Coffee, Utensils, ChefHat } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const nutritionTypeLabels: Record<string, string> = {
  "low-salt": "減塩",
  "low-sugar": "低糖質",
  "high-protein": "高タンパク",
  "healthy-fat": "健康脂質",
  "low-cholesterol": "低コレステロール",
  "high-fiber": "食物繊維",
  "low-fat": "低脂肪",
  balanced: "バランス",
  "low-carb": "低炭水化物",
  "low-calorie": "低カロリー",
}

const nutritionTypeColors: Record<string, string> = {
  "low-salt": "bg-pastel-blue text-blue-700",
  "low-sugar": "bg-pastel-lavender text-purple-700",
  "high-protein": "bg-pastel-peach text-orange-700",
  "healthy-fat": "bg-pastel-yellow text-yellow-700",
  "low-cholesterol": "bg-pastel-mint text-green-700",
  "high-fiber": "bg-pastel-mint text-green-700",
  "low-fat": "bg-pastel-blue text-blue-700",
  balanced: "bg-pastel-lavender text-purple-700",
  "low-carb": "bg-pastel-peach text-orange-700",
  "low-calorie": "bg-pastel-mint text-green-700",
}

function WeeklyMealCard({ meal, mealType }: { meal: any; mealType: string }) {
  const mealTypeIcons = {
    朝食: <Coffee className="h-4 w-4 text-primary" />,
    昼食: <Utensils className="h-4 w-4 text-primary" />,
    夕食: <ChefHat className="h-4 w-4 text-primary" />,
  }

  const icon = mealTypeIcons[mealType as keyof typeof mealTypeIcons]

  return (
    <div className="cute-card bg-white p-3 h-full">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-1 mb-2">
          {icon}
          <p className="text-xs font-medium text-primary">{mealType}</p>
        </div>
        {meal.isQuick && (
          <span className="cute-badge bg-pastel-pink text-primary text-xs px-2 py-0.5">
            <Clock className="h-3 w-3 mr-1 inline" />
            時短
          </span>
        )}
      </div>
      <h4 className="text-sm font-medium mb-2 text-primary">{meal.title}</h4>
      <div className="flex flex-wrap gap-1 mb-2">
        {meal.nutritionType.map((type: string) => (
          <span key={type} className={`text-xs px-1.5 py-0.5 rounded-full ${nutritionTypeColors[type]}`}>
            {nutritionTypeLabels[type] || type}
          </span>
        ))}
      </div>
      <div className="flex items-center text-xs text-muted-foreground">
        <Clock className="h-3 w-3 mr-1 text-primary" />
        <span>約{meal.cookingTime}分</span>
      </div>
    </div>
  )
}

export default function MealSuggestionsPage() {
  const [weeklyMenu, setWeeklyMenu] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWeeklyMenu = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/recipes?weekly=true")
      if (!response.ok) {
        throw new Error("Failed to fetch weekly menu")
      }

      const data = await response.json()
      console.log("weekly menu API response:", data)

      const weekPlan = data.plan_json?.week_plan
      if (!Array.isArray(weekPlan)) {
        throw new Error("APIレスポンスに正しい 'week_plan' が含まれていません。")
      }

      setWeeklyMenu(weekPlan)
    } catch (err) {
      console.error("Error fetching weekly menu:", err)
      setError("週間メニューの取得に失敗しました。もう一度お試しください。")
      setWeeklyMenu([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeeklyMenu()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-primary mb-6">1週間の食事プラン</h1>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="border rounded p-4 bg-white shadow">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="h-24 bg-gray-100 rounded"></div>
                <div className="h-24 bg-gray-100 rounded"></div>
                <div className="h-24 bg-gray-100 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : weeklyMenu.length > 0 ? (
        <div className="grid gap-6">
          {weeklyMenu.map((day) => (
            <div key={day.day} className="border rounded-2xl p-4 bg-white shadow">
              <div className="flex items-center mb-4">
                <div className="bg-pastel-pink text-primary rounded-full px-4 py-1 font-medium">{day.day}</div>
                <div className="h-px flex-1 bg-pastel-pink/30 ml-3"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <WeeklyMealCard meal={day.breakfast} mealType="朝食" />
                <WeeklyMealCard meal={day.lunch} mealType="昼食" />
                <WeeklyMealCard meal={day.dinner} mealType="夕食" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-10">
          週間メニューが見つかりませんでした。
        </div>
      )}
    </div>
  )
}
