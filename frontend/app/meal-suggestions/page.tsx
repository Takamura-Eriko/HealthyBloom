"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Clock, Flower, Coffee, Utensils, ChefHat } from "lucide-react"
import type { Recipe, RecipeSearchResult } from "@/lib/recipe-api"
import { Skeleton } from "@/components/ui/skeleton"

// 栄養タイプのラベル変換
const nutritionTypeLabels: Record<string, string> = {
  "low-salt": "減塩",
  "low-sugar": "低糖質",
  "high-protein": "高タンパク質",
  "healthy-fat": "健康脂質",
  "low-cholesterol": "低コレステロール",
  "high-fiber": "食物繊維",
  "low-fat": "低脂肪",
  "balanced": "バランス",
  "low-carb": "低炭水化物",
  "low-calorie": "低カロリー",
};


// 栄養タイプに対応する背景色
const nutritionTypeColors: Record<string, string> = {
  "low-salt": "bg-blue-100 text-blue-800",
  "low-sugar": "bg-pink-100 text-pink-700",
  "high-protein": "bg-orange-100 text-orange-700",
  "healthy-fat": "bg-yellow-100 text-yellow-700",
  "low-cholesterol": "bg-green-100 text-green-700",
  "high-fiber": "bg-lime-100 text-lime-700",
  "low-fat": "bg-blue-100 text-blue-800",
  "balanced": "bg-purple-100 text-purple-700",
  "low-carb": "bg-orange-100 text-orange-700",
  "low-calorie": "bg-emerald-100 text-emerald-700",
};


const normalizeNutritionType = (type: string): string => {
  const map: Record<string, string> = {
    "高タンパク": "high-protein",
    "高タンパク質": "high-protein",
    "高繊維": "high-fiber",
    "食物繊維": "high-fiber",
    "低カロリー": "low-calorie",
    "低糖質": "low-sugar",
    // 必要に応じて追加
  };
  return map[type] || type;
};


// 曜日ごとのカラー設定
const dayColors: Record<string, string> = {
  月曜日: "bg-pink-200 text-black-800",
  火曜日: "bg-orange-200 text-black-800",
  水曜日: "bg-yellow-200 text-black-800",
  木曜日: "bg-green-200 text-black-800",
  金曜日: "bg-blue-200 text-black-800",
  土曜日: "bg-purple-200 text-black-800",
  日曜日: "bg-rose-200 text-black-800",
}

// 食事提案カードコンポーネント
function MealCard({ meal }: { meal: Recipe }) {
  return (
    <div className="meal-card group">
      <div className="meal-card-image aspect-video w-full overflow-hidden">
        <Image
          src={meal.imageUrl || "/placeholder.svg?height=200&width=300"}
          alt={meal.title}
          width={300}
          height={200}
          className="object-cover w-full h-full transition-transform group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-3">
          {meal.nutritionType.map((rawType: string) => {
            const type = normalizeNutritionType(rawType);
            const label = nutritionTypeLabels[type] || rawType;
            const color = nutritionTypeColors[type] || "bg-gray-200 text-gray-700";
            return (
              <span key={rawType} className={`cute-badge ${color}`}>
                {label}
              </span>
            );
          })}

          {meal.isQuick && (
            <span className="cute-badge bg-pastel-pink text-primary">
              <Clock className="h-3 w-3 mr-1 inline" />
              時短レシピ
            </span>
          )}
        </div>

        <h3 className="text-lg font-medium mb-2 text-primary">{meal.title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{meal.description}</p>

        <div className="mb-4">
          <div className="flex items-center mb-2">
            <Clock className="h-4 w-4 mr-1 text-primary" />
            <span className="text-sm text-muted-foreground">
              調理時間: 約{meal.cookingTime}分
            </span>
          </div>

          <h4 className="font-medium mb-2 text-sm text-primary">主な食材</h4>
          <div className="flex flex-wrap gap-1">
            {meal.ingredients.map((ingredient) => (
              <span
                key={ingredient.name}
                className="inline-flex items-center rounded-full border border-pastel-pink px-2 py-0.5 text-xs font-medium"
              >
                {ingredient.name}
              </span>
            ))}
          </div>
        </div>

        <Button className="w-full rounded-full bg-pastel-pink hover:bg-primary text-primary-foreground" asChild>
          <Link href={`/meal-suggestions/${meal.id}`}>
            詳細を見る
          </Link>
        </Button>
      </div>
    </div>
  );
}



const mealTypeColors: Record<string, string> = {
  朝食: "text-pink-600",
  昼食: "text-orange-600",
  夕食: "text-purple-600",
}

// 食事区分に対応するアイコンを定義
const mealTypeIcons: Record<string, JSX.Element> = {
  朝食: <Coffee className="h-4 w-4 text-primary" />,
  昼食: <Utensils className="h-4 w-4 text-primary" />,
  夕食: <ChefHat className="h-4 w-4 text-primary" />,
};

// 週間メニューの食事カードコンポーネント
function WeeklyMealCard({ meal, mealType }: { meal: any; mealType: string }) {
  const icon = mealTypeIcons[mealType]

  return (
    <div className="cute-card bg-white p-3 h-full">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-1 mb-2">
          {icon}
          <p className={`text-xs font-medium ${mealTypeColors[mealType]}`}>{mealType}</p>
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


// ローディングスケルトン
function MealCardSkeleton() {
  return (
    <div className="meal-card">
      <div className="aspect-video w-full">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="p-5">
        <div className="flex gap-2 mb-3">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-full mb-4" />
        <div className="mb-4">
          <Skeleton className="h-4 w-1/2 mb-2" />
          <div className="flex flex-wrap gap-1">
            <Skeleton className="h-4 w-16 rounded-full" />
            <Skeleton className="h-4 w-16 rounded-full" />
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-10 w-full rounded-full" />
      </div>
    </div>
  )
}

export default function MealSuggestionsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [weeklyMenu, setWeeklyMenu] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // レシピを取得する関数
  const fetchRecipes = async (nutritionType?: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (nutritionType && nutritionType !== "all") {
        params.append("nutritionType", nutritionType)
      }
      if (nutritionType === "quick") {
        params.append("maxCookingTime", "15")
      }

      const response = await fetch(`/api/recipes?${params.toString()}`)
      if (!response.ok) {
        throw new Error("Failed to fetch recipes")
      }

      const data: RecipeSearchResult = await response.json()
      setRecipes(data.recipes)
    } catch (err) {
      console.error("Error fetching recipes:", err)
      setError("レシピの取得に失敗しました。もう一度お試しください。")
    } finally {
      setLoading(false)
    }
  }

  // 週間メニューを取得する関数
  const fetchWeeklyMenu = async () => {
    try {
      setLoading(true)

      const userId = "b74ca31d-c7f7-4029-b5ca-197aa6adb0d8"
      console.log("fetch開始: userId =", userId)
  
      const response = await fetch(`http://localhost:8000/recipes/weekly-menu2/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      })
      
  
      console.log("レスポンスステータス:", response.status)
      console.log("レスポンスURL:", response.url)
  
      if (!response.ok) {
        throw new Error("Failed to fetch weekly menu")
      }
  
      const data = await response.json()
      console.log("取得した週間メニュー:", data)
  
      const weekPlan = data?.plan_json?.week_plan
      if (!Array.isArray(weekPlan)) {
        throw new Error("APIレスポンスに正しい 'week_plan' が含まれていません。")
      }
  
      setWeeklyMenu(weekPlan)
    } catch (err) {
      console.error("Error fetching weekly menu:", err)
      setError("週間メニューの取得に失敗しました。もう一度お試しください。")
    } finally {
      setLoading(false)
    }
  }
  

  // タブが変更されたときの処理
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (value === "weekly") {
      fetchWeeklyMenu()
    } else {
      fetchRecipes(value)
    }
  }

  // 初回レンダリング時にレシピを取得
  useEffect(() => {
    fetchRecipes()
    fetchWeeklyMenu()
  }, [])

  return (
    <div className="flex flex-col gap-6 relative">
      
      {/* 装飾的な花のイラスト - 右下 */}
      <div className="absolute bottom-0 right-0 w-24 h-24 opacity-10 pointer-events-none">
        {/* <Image src="/flower-decoration-5.svg" alt="花の装飾" width={100} height={100} className="w-full h-full" /> */}
      </div>

      <div className="text-center py-6">
        <div className="flex items-center justify-center mb-2">
          <h1 className="text-3xl font-bold tracking-tight text-black ">健康的な食事提案</h1>
        </div>
        <p className="text-black max-w-2xl mx-auto ">
          あなたの健康状態に合わせた食事メニューを提案します。<br />
          栄養バランスの良い食事で、毎日を健やかに過ごしましょう♪
        </p>
        <div className="cute-divider w-32 mx-auto mt-4 "></div>
      </div>

      <Tabs defaultValue="weekly" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="bg-pastel-lavender/30 p-1 rounded-full mb-6">
          
        </TabsList>

        {/* 1週間プラン */}
        
        <TabsContent value="weekly" className="mt-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <div className="cute-card bg-white p-6 relative overflow-hidden">
            <div className="cute-pattern-bg absolute inset-0"></div>
            <div className="relative">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-2">
                  <h2 className="text-2xl font-bold text-primary ">1週間の食事プラン</h2>
                </div>
                <p className="text-black text-center px-4">
                  あなたの健康状態に合わせた1週間分の食事プランです。
                  バランスの良い食事を心がけましょう♪
                </p>

              </div>

              {loading ? (
                <>
                 {/* ローディング中のテキスト */}
                 <p className="text-center text-base font-semibold text-black mb-4">読み込み中...</p>

                 {/* ローディング中はスケルトンを表示 */}
                 <div className="space-y-4">
                   {Array.from({ length: 3 }).map((_, index) => (
                     <div key={index} className="border-2 border-pastel-pink rounded-2xl p-4 bg-white">
                       <Skeleton className="h-8 w-32 mb-4" />
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                         <Skeleton className="h-32 rounded-xl" />
                         <Skeleton className="h-32 rounded-xl" />
                         <Skeleton className="h-32 rounded-xl" />
                       </div>
                     </div>
                     ))}
                 </div>
               </>
              ) : weeklyMenu.length > 0 ? (
                // 週間メニューがある場合
                <div className="grid gap-6">
                  {weeklyMenu.map((day) => (
                    <div key={day.day} className="border-2 border-pastel-pink rounded-2xl p-4 bg-white">
                      <div className="flex items-center mb-4">
                      <div className={`rounded-full px-4 py-1 font-bold tracking-wide text-sm ${dayColors[day.day]}`}>{day.day}</div>
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
                <div className="text-center py-10">
                  <p className="text-black">読み込み中...</p>
                </div>
              )}

              <div className="mt-6 text-center">
              <Button className="rounded-full bg-pastel-pink hover:bg-primary text-black px-6">
                  このプランを保存する
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}
