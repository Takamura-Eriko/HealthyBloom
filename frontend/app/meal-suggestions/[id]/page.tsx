"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, Share2, Printer, Star, Flower } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Recipe } from "@/lib/recipe-api"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"

// 栄養タイプのラベル変換
const nutritionTypeLabels: Record<string, string> = {
  "low-salt": "減塩",
  "low-sugar": "低糖質",
  "high-protein": "高タンパク",
  "healthy-fat": "健康脂質",
  "low-cholesterol": "低コレステロール",
  "high-fiber": "食物繊維",
}

// 栄養タイプに対応する背景色
const nutritionTypeColors: Record<string, string> = {
  "low-salt": "bg-pastel-blue text-blue-700",
  "low-sugar": "bg-pastel-lavender text-purple-700",
  "high-protein": "bg-pastel-peach text-orange-700",
  "healthy-fat": "bg-pastel-yellow text-yellow-700",
  "low-cholesterol": "bg-pastel-mint text-green-700",
  "high-fiber": "bg-pastel-mint text-green-700",
}

export default function MealDetailPage({ params }: { params: { id: string } }) {
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [weeklyMenu, setWeeklyMenu] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const { toast } = useToast()


  // レシピを取得する関数
  const fetchRecipe = async (id: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/recipes?id=${id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch recipe")
      }

      const data = await response.json()
      setRecipe(data)
    } catch (err) {
      console.error("Error fetching recipe:", err)
      setError("レシピの取得に失敗しました。もう一度お試しください。")
    } finally {
      setLoading(false)
    }
  }

  // お気に入り状態を切り替える関数
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    // ここで実際にはAPIを呼び出してお気に入り状態を保存する
    toast({
      title: isFavorite ? "お気に入りから削除しました" : "お気に入りに追加しました",
      description: isFavorite ? "お気に入りから削除されました" : "お気に入りに追加されました",
    })
  }

  // 共有する関数
  const shareRecipe = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe?.title || "レシピの共有",
        text: recipe?.description || "",
        url: window.location.href,
      })
    } else {
      // クリップボードにURLをコピー
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "URLをコピーしました",
        description: "URLがクリップボードにコピーされました",
      })
    }
  }

  // 印刷する関数
  const printRecipe = () => {
    window.print()
  }

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res1 = await fetch(`/api/health/recommendation/${params.id}`)
        if (!res1.ok) throw new Error("栄養タイプの取得に失敗しました")
        const nutritionTypes: string[] = await res1.json()

        const res2 = await fetch(
          `/api/recipes/weekly-menu?nutrition_types=${nutritionTypes.join(",")}`
        )
        if (!res2.ok) throw new Error("週間メニューの取得に失敗しました")
        const menu = await res2.json()

        setWeeklyMenu(menu)
      } catch (err: any) {
        console.error(err)
        setError(err.message)
        toast({
          title: "取得エラー",
          description: err.message,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

  // 初回レンダリング時にレシピを取得
  fetchMenu()
    fetchRecipe(params.id)
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Skeleton className="h-10 w-20 mb-4" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-64 w-full md:col-span-2" />
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" size="sm" className="rounded-full text-primary mb-4" asChild>
          <Link href="/meal-suggestions">
            <ArrowLeft className="mr-2 h-4 w-4" /> 戻る
          </Link>
        </Button>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" size="sm" className="rounded-full text-primary mb-4" asChild>
          <Link href="/meal-suggestions">
            <ArrowLeft className="mr-2 h-4 w-4" /> 戻る
          </Link>
        </Button>
        <p className="text-center text-muted-foreground py-10">レシピが見つかりませんでした。</p>
      </div>
    )
  }


  // ローディングスケルトン
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Skeleton className="h-10 w-20" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="cute-card bg-white overflow-hidden">
              <Skeleton className="aspect-video w-full" />
              <div className="p-6 space-y-4">
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-32 rounded-full" />
                  <Skeleton className="h-10 w-32 rounded-full" />
                  <Skeleton className="h-10 w-32 rounded-full" />
                </div>
                <Skeleton className="h-1 w-full" />
                <div className="space-y-4">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-32 w-full rounded-xl" />
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-64 w-full rounded-xl" />
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="cute-card bg-white p-5">
              <Skeleton className="h-6 w-40 mx-auto mb-4" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
            <div className="cute-card bg-white p-5">
              <Skeleton className="h-6 w-40 mx-auto mb-4" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // エラー表示
  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button variant="ghost" size="sm" className="rounded-full text-primary" asChild>
            <Link href="/meal-suggestions">
              <ArrowLeft className="mr-2 h-4 w-4" />
              戻る
            </Link>
          </Button>
        </div>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
      </div>
    )
  }

  // レシピがない場合
  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button variant="ghost" size="sm" className="rounded-full text-primary" asChild>
            <Link href="/meal-suggestions">
              <ArrowLeft className="mr-2 h-4 w-4" />
              戻る
            </Link>
          </Button>
        </div>
        <div className="text-center py-10">
          <p className="text-muted-foreground">レシピが見つかりませんでした。</p>
        </div>
      </div>
    )
  }


  return (
    <div className="container mx-auto px-4 py-6 relative">
      {/* 装飾的な花のイラスト - 左上 */}
      <div className="absolute top-0 left-0 w-24 h-24 opacity-10 pointer-events-none">
        <Image src="/flower-decoration-6.svg" alt="花の装飾" width={100} height={100} className="w-full h-full" />
      </div>

      <div className="mb-6">
        <Button variant="ghost" size="sm" className="rounded-full text-primary" asChild>
          <Link href="/meal-suggestions">
            <ArrowLeft className="mr-2 h-4 w-4" />
            戻る
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="cute-card bg-white overflow-hidden">
            <div className="relative">
              <div className="aspect-video w-full overflow-hidden">
                <Image
                  src={recipe.imageUrl || "/placeholder.svg"}
                  alt={recipe.title}
                  width={600}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
              <button className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md" onClick={toggleFavorite}>
                <Flower className="h-5 w-5 text-primary" fill={isFavorite ? "#FFD1DC" : "none"} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-3">
                {recipe.nutritionType.map((type) => (
                  <span key={type} className={`cute-badge ${nutritionTypeColors[type]}`}>
                    {nutritionTypeLabels[type] || type}
                  </span>
                ))}
                {recipe.isQuick && (
                  <span className="cute-badge bg-pastel-pink text-primary">
                    <Clock className="h-3 w-3 mr-1 inline" />
                    時短レシピ
                  </span>
                )}
              </div>

              {/* 週間提案メニュー表示 */}
              {weeklyMenu && (
                <div className="mt-6 mb-6">
                  <h2 className="text-xl font-bold mb-4">このレシピに基づいた1週間の提案メニュー</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {weeklyMenu.map((day, index) => (
                <div
                  key={index}
                  className="bg-pastel-lavender/30 p-4 rounded-xl shadow border border-pastel-lavender"
                >
                  <h3 className="text-md font-semibold mb-2">{day.day}</h3>
                  <ul className="space-y-1 text-sm">
                    <li>朝食: {day.breakfast.title}</li>
                    <li>昼食: {day.lunch.title}</li>
                    <li>夕食: {day.dinner.title}</li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

              <div className="flex items-center mb-2">
                <Flower className="h-5 w-5 text-primary mr-2" fill="#FFD1DC" />
                <h1 className="text-2xl font-bold handwritten-heading">{recipe.title}</h1>
              </div>
              <p className="text-muted-foreground mb-4">{recipe.description}</p>
              <div className="flex items-center mb-6">
                <Clock className="h-4 w-4 mr-1 text-primary" />
                <span className="text-sm text-muted-foreground">調理時間: 約{recipe.cookingTime}分</span>
                <div className="flex items-center ml-4">
                  <Star className="h-4 w-4 text-yellow-400" fill="#FBBF24" />
                  <Star className="h-4 w-4 text-yellow-400" fill="#FBBF24" />
                  <Star className="h-4 w-4 text-yellow-400" fill="#FBBF24" />
                  <Star className="h-4 w-4 text-yellow-400" fill="#FBBF24" />
                  <Star className="h-4 w-4 text-yellow-400" fill="#FBBF24" />
                  <span className="text-sm ml-1 text-muted-foreground">(12件)</span>
                </div>
              </div>

              <div className="flex gap-2 mb-6">
                <Button
                  className="rounded-full bg-pastel-pink hover:bg-primary text-primary-foreground"
                  onClick={toggleFavorite}
                >
                  <Flower className="mr-2 h-4 w-4" fill="#FFF" />
                  {isFavorite ? "お気に入り済み" : "お気に入り"}
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border-pastel-pink text-primary"
                  onClick={shareRecipe}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  共有
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border-pastel-pink text-primary"
                  onClick={printRecipe}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  印刷
                </Button>
              </div>

              <div className="cute-divider"></div>

              <div className="space-y-8">
                <div>
                  <div className="flex items-center mb-4">
                    <Flower className="h-5 w-5 text-primary mr-2" fill="#FFD1DC" />
                    <h3 className="text-lg font-semibold soft-heading">材料（{recipe.servings || 1}人前）</h3>
                  </div>
                  <div className="bg-pastel-lavender/10 rounded-2xl p-4">
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {recipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex justify-between items-center">
                          <span className="flex items-center">
                            <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
                            {ingredient.name}
                          </span>
                          <span className="text-muted-foreground text-sm bg-white px-2 py-1 rounded-full">
                            {ingredient.amount}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <div className="flex items-center mb-4">
                    <Flower className="h-5 w-5 text-primary mr-2" fill="#FFD1DC" />
                    <h3 className="text-lg font-semibold soft-heading">作り方</h3>
                  </div>
                  <ol className="space-y-4">
                    {recipe.steps.map((step, index) => (
                      <li key={index} className="flex">
                        <span className="bg-pastel-pink text-primary rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 font-medium">
                          {index + 1}
                        </span>
                        <div className="bg-pastel-lavender/10 rounded-2xl p-3 flex-1">{step}</div>
                      </li>
                    ))}
                  </ol>
                </div>

                {recipe.tips && recipe.tips.length > 0 && (
                  <div>
                    <div className="flex items-center mb-4">
                      <Flower className="h-5 w-5 text-primary mr-2" fill="#FFD1DC" />
                      <h3 className="text-lg font-semibold soft-heading">調理のコツ</h3>
                    </div>
                    <div className="bg-pastel-yellow/20 rounded-2xl p-4">
                      <ul className="space-y-3">
                        {recipe.tips.map((tip, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-yellow-500 mr-2">✿</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="cute-card bg-white p-5">
            <div className="flex items-center justify-center mb-4">
              <Flower className="h-5 w-5 text-primary mr-2" fill="#FFD1DC" />
              <h3 className="text-lg font-semibold soft-heading text-center">栄養成分（1人前）</h3>
            </div>
            <div className="bg-pastel-lavender/10 rounded-2xl p-4">
              <ul className="space-y-3">
                <li className="flex justify-between items-center">
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
                    カロリー
                  </span>
                  <span className="font-medium bg-white px-3 py-1 rounded-full text-sm">
                    {recipe.nutritionFacts.calories} kcal
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
                    タンパク質
                  </span>
                  <span className="font-medium bg-white px-3 py-1 rounded-full text-sm">
                    {recipe.nutritionFacts.protein} g
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
                    脂質
                  </span>
                  <span className="font-medium bg-white px-3 py-1 rounded-full text-sm">
                    {recipe.nutritionFacts.fat} g
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
                    炭水化物
                  </span>
                  <span className="font-medium bg-white px-3 py-1 rounded-full text-sm">
                    {recipe.nutritionFacts.carbs} g
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
                    食物繊維
                  </span>
                  <span className="font-medium bg-white px-3 py-1 rounded-full text-sm">
                    {recipe.nutritionFacts.fiber} g
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
                    糖質
                  </span>
                  <span className="font-medium bg-white px-3 py-1 rounded-full text-sm">
                    {recipe.nutritionFacts.sugar} g
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
                    ナトリウム
                  </span>
                  <span className="font-medium bg-white px-3 py-1 rounded-full text-sm">
                    {recipe.nutritionFacts.sodium} mg
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {recipe.benefits && recipe.benefits.length > 0 && (
            <div className="cute-card bg-white p-5">
              <div className="flex items-center justify-center mb-4">
                <Flower className="h-5 w-5 text-primary mr-2" fill="#FFD1DC" />
                <h3 className="text-lg font-semibold soft-heading text-center">健康効果</h3>
              </div>
              <div className="bg-pastel-mint/20 rounded-2xl p-4">
                <ul className="space-y-3">
                  {recipe.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">✿</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="cute-card bg-white p-5">
            <div className="flex items-center justify-center mb-4">
              <Flower className="h-5 w-5 text-primary mr-2" fill="#FFD1DC" />
              <h3 className="text-lg font-semibold soft-heading text-center">おすすめの組み合わせ</h3>
            </div>
            <div className="bg-pastel-peach/20 rounded-2xl p-4">
              <p className="mb-4 text-center">このメニューと相性の良い料理です：</p>
              <ul className="space-y-3">
                <li className="flex items-center justify-between">
                  <span className="flex items-center">
                    <span className="bg-pastel-pink text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2 text-xs font-medium">
                      1
                    </span>
                    <span>野菜たっぷりスープ</span>
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-pastel-pink text-primary text-xs px-2"
                  >
                    詳細
                  </Button>
                </li>
                <li className="flex items-center justify-between">
                  <span className="flex items-center">
                    <span className="bg-pastel-pink text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2 text-xs font-medium">
                      2
                    </span>
                    <span>全粒粉のクラッカー</span>
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-pastel-pink text-primary text-xs px-2"
                  >
                    詳細
                  </Button>
                </li>
                <li className="flex items-center justify-between">
                  <span className="flex items-center">
                    <span className="bg-pastel-pink text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2 text-xs font-medium">
                      3
                    </span>
                    <span>ベリーのヨーグルト</span>
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-pastel-pink text-primary text-xs px-2"
                  >
                    詳細
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


