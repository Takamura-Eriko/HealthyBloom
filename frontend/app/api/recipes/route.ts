import { type NextRequest, NextResponse } from "next/server"
import { searchRecipes, getRecipeById, getWeeklyMenu } from "@/lib/recipe-api"

// レシピを検索するAPI
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get("id")
    const weekly = url.searchParams.get("weekly")

    // 週間メニューを取得
    if (weekly === "true") {
      const weeklyMenu = await getWeeklyMenu()
      return NextResponse.json(weeklyMenu)
    }

    // IDが指定されている場合は特定のレシピを取得
    if (id) {
      const recipe = await getRecipeById(id)
      if (!recipe) {
        return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
      }
      return NextResponse.json(recipe)
    }

    // 検索パラメータを取得
    const query = url.searchParams.get("query") || undefined
    const tags = url.searchParams.get("tags")?.split(",") || undefined
    const nutritionType = url.searchParams.get("nutritionType")?.split(",") || undefined
    const maxCookingTime = url.searchParams.get("maxCookingTime")
      ? Number.parseInt(url.searchParams.get("maxCookingTime")!)
      : undefined
    const page = url.searchParams.get("page") ? Number.parseInt(url.searchParams.get("page")!) : 1
    const limit = url.searchParams.get("limit") ? Number.parseInt(url.searchParams.get("limit")!) : 10

    // レシピを検索
    const result = await searchRecipes({
      query,
      tags,
      nutritionType,
      maxCookingTime,
      page,
      limit,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Recipe API error:", error)
    return NextResponse.json({ error: "Failed to fetch recipes" }, { status: 500 })
  }
}

