import { apiClient, getApiKey } from "./api-client"

// レシピAPIのベースURL
const RECIPE_API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/recipes`;


// レシピの栄養素情報の型
export interface NutritionInfo {
  calories: number
  protein: number
  fat: number
  carbs: number
  fiber: number
  sugar: number
  sodium: number
}

// レシピの材料の型
export interface Ingredient {
  name: string
  amount: string
  unit?: string
}

// レシピの型
export interface Recipe {
  id: string
  title: string
  description: string
  imageUrl: string
  ingredients: Ingredient[]
  steps: string[]
  nutritionFacts: NutritionInfo
  cookingTime: number
  servings: number
  tags: string[]
  nutritionType: string[]
  isQuick: boolean
  tips?: string[]
  benefits?: string[]
}

// レシピ検索パラメータの型
export interface RecipeSearchParams {
  query?: string
  tags?: string[]
  nutritionType?: string[]
  maxCookingTime?: number
  page?: number
  limit?: number
}

// レシピ検索結果の型
export interface RecipeSearchResult {
  recipes: Recipe[]
  total: number
  page: number
  limit: number
}

// レシピを検索する関数
export async function searchRecipes(params: RecipeSearchParams): Promise<RecipeSearchResult> {
  try {
    const apiKey = getApiKey("recipe")

    const response = await apiClient<RecipeSearchResult>(`${RECIPE_API_BASE_URL}/search`, {
      params: {
        ...(params.query && { query: params.query }),
        ...(params.tags && { tags: params.tags.join(",") }),
        ...(params.nutritionType && { nutritionType: params.nutritionType.join(",") }),
        ...(params.maxCookingTime && { maxCookingTime: params.maxCookingTime.toString() }),
        page: (params.page || 1).toString(),
        limit: (params.limit || 10).toString(),
      },
      apiKey,
    })

    if (response.error) {
      throw new Error(response.error)
    }

    return response.data || { recipes: [], total: 0, page: 1, limit: 10 }
  } catch (error) {
    console.error("Failed to search recipes:", error)
    // APIが失敗した場合はモックデータを返す
    return getMockRecipeSearchResult(params)
  }
}

// レシピの詳細を取得する関数
export async function getRecipeById(id: string): Promise<Recipe | null> {
  try {
    const apiKey = getApiKey("recipe")

    const response = await apiClient<Recipe>(`${RECIPE_API_BASE_URL}/${id}`, {
      apiKey,
    })

    if (response.error) {
      throw new Error(response.error)
    }

    return response.data
  } catch (error) {
    console.error(`Failed to get recipe with ID ${id}:`, error)
    // APIが失敗した場合はモックデータを返す
    return getMockRecipeById(id)
  }
}

// 週間メニューを取得する関数
export async function getWeeklyMenu(): Promise<any> {
  try {
    const apiKey = getApiKey("recipe")

    const response = await apiClient<any>(`${RECIPE_API_BASE_URL}/weekly-menu`, {
      apiKey,
    })

    if (response.error) {
      throw new Error(response.error)
    }

    return response.data
  } catch (error) {
    console.error("Failed to get weekly menu:", error)
    // APIが失敗した場合はモックデータを返す
    return getMockWeeklyMenu()
  }
}

// モックのレシピ検索結果を返す関数
function getMockRecipeSearchResult(params: RecipeSearchParams): RecipeSearchResult {
  // モックデータ（実際のAPIが利用できない場合のフォールバック）
  const mockRecipes: Recipe[] = [
    {
      id: "1",
      title: "低塩・高タンパクの和風定食",
      description: "血圧が高めの方におすすめの低塩メニュー。タンパク質も豊富に摂れます。",
      imageUrl: "/placeholder.svg?height=200&width=300",
      ingredients: [
        { name: "鶏むね肉", amount: "100g" },
        { name: "豆腐", amount: "1/2丁" },
        { name: "ブロッコリー", amount: "1/2個" },
        { name: "玄米", amount: "100g" },
        { name: "わかめ", amount: "5g" },
        { name: "ねぎ", amount: "1本" },
      ],
      steps: [
        "鶏むね肉は一口大に切り、塩・胡椒で下味をつけておきます。",
        "豆腐は水切りをして一口大に切ります。",
        "ブロッコリーは小房に分け、茹でておきます。",
        "玄米は炊いておきます。",
        "わかめは水で戻しておきます。",
        "ねぎは小口切りにします。",
        "鶏むね肉をフライパンで焼きます。",
        "器に玄米、鶏むね肉、豆腐、ブロッコリー、わかめを盛り付けます。",
        "ねぎを散らして完成です。",
      ],
      nutritionFacts: {
        calories: 350,
        protein: 30,
        fat: 10,
        carbs: 40,
        fiber: 5,
        sugar: 2,
        sodium: 200,
      },
      cookingTime: 30,
      servings: 1,
      tags: ["和食", "ヘルシー", "高タンパク"],
      nutritionType: ["low-salt", "high-protein"],
      isQuick: false,
      tips: [
        "鶏むね肉は焼きすぎると固くなるので注意してください。",
        "豆腐の水切りをしっかりすると味が染み込みやすくなります。",
        "玄米は白米よりも食物繊維が豊富です。",
      ],
      benefits: [
        "低塩なので高血圧の方におすすめです。",
        "高タンパクなので筋肉の維持に役立ちます。",
        "食物繊維が豊富なので腸内環境を整えます。",
      ],
    },
    {
      id: "2",
      title: "血糖値を抑える地中海風サラダ",
      description: "血糖値が気になる方におすすめの低GIメニュー。オリーブオイルの健康脂質も摂れます。",
      imageUrl: "/placeholder.svg?height=200&width=300",
      ingredients: [
        { name: "サーモン", amount: "100g" },
        { name: "アボカド", amount: "1/2個" },
        { name: "トマト", amount: "1個" },
        { name: "オリーブ", amount: "10個" },
        { name: "レモン", amount: "1/2個" },
        { name: "全粒粉パン", amount: "1枚" },
        { name: "オリーブオイル", amount: "大さじ1" },
        { name: "塩", amount: "少々" },
        { name: "黒胡椒", amount: "少々" },
      ],
      steps: [
        "サーモンは一口大に切り、塩・胡椒で下味をつけておきます。",
        "アボカドは皮と種を取り除き、一口大に切ります。",
        "トマトはヘタを取り除き、一口大に切ります。",
        "オリーブは種を取り除き、半分に切ります。",
        "レモンは絞り汁を取ります。",
        "全粒粉パンは小さめにカットしてトーストします。",
        "ボウルに切ったサーモン、アボカド、トマト、オリーブを入れます。",
        "オリーブオイル、レモン汁、塩、黒胡椒を加えて軽く混ぜます。",
        "器に盛り付け、トーストした全粒粉パンを添えて完成です。",
      ],
      nutritionFacts: {
        calories: 320,
        protein: 18,
        fat: 22,
        carbs: 15,
        fiber: 6,
        sugar: 3,
        sodium: 280,
      },
      cookingTime: 15,
      servings: 1,
      tags: ["地中海料理", "サラダ", "低GI"],
      nutritionType: ["low-sugar", "healthy-fat"],
      isQuick: true,
      tips: [
        "サーモンは生でも加熱してもOKです。加熱する場合は、フライパンで軽く焼いてから使用してください。",
        "アボカドは完熟したものを選ぶと、クリーミーな食感が楽しめます。",
        "オリーブオイルは良質なエキストラバージンオリーブオイルを使うと風味が増します。",
        "全粒粉パンの代わりに、全粒粉のクラッカーやライ麦パンでも美味しくいただけます。",
      ],
      benefits: [
        "サーモンに含まれるオメガ3脂肪酸は、血糖値の安定に役立ちます。",
        "アボカドの健康的な脂質は、血糖値の急上昇を抑える効果があります。",
        "全粒粉パンは精製された小麦パンよりも血糖値の上昇がゆるやかです。",
        "オリーブオイルに含まれる一価不飽和脂肪酸は、心臓病のリスクを下げる効果があります。",
      ],
    },
  ]

  // 検索条件に基づいてフィルタリング
  let filteredRecipes = [...mockRecipes]

  if (params.query) {
    const query = params.query.toLowerCase()
    filteredRecipes = filteredRecipes.filter(
      (recipe) => recipe.title.toLowerCase().includes(query) || recipe.description.toLowerCase().includes(query),
    )
  }

  if (params.tags && params.tags.length > 0) {
    filteredRecipes = filteredRecipes.filter((recipe) => params.tags!.some((tag) => recipe.tags.includes(tag)))
  }

  if (params.nutritionType && params.nutritionType.length > 0) {
    filteredRecipes = filteredRecipes.filter((recipe) =>
      params.nutritionType!.some((type) => recipe.nutritionType.includes(type)),
    )
  }

  if (params.maxCookingTime) {
    filteredRecipes = filteredRecipes.filter((recipe) => recipe.cookingTime <= params.maxCookingTime!)
  }

  // ページネーション
  const page = params.page || 1
  const limit = params.limit || 10
  const start = (page - 1) * limit
  const end = start + limit
  const paginatedRecipes = filteredRecipes.slice(start, end)

  return {
    recipes: paginatedRecipes,
    total: filteredRecipes.length,
    page,
    limit,
  }
}

// モックのレシピ詳細を返す関数
function getMockRecipeById(id: string): Recipe | null {
  // モックデータ（実際のAPIが利用できない場合のフォールバック）
  const mockRecipes: Record<string, Recipe> = {
    "1": {
      id: "1",
      title: "低塩・高タンパクの和風定食",
      description: "血圧が高めの方におすすめの低塩メニュー。タンパク質も豊富に摂れます。",
      imageUrl: "/placeholder.svg?height=200&width=300",
      ingredients: [
        { name: "鶏むね肉", amount: "100g" },
        { name: "豆腐", amount: "1/2丁" },
        { name: "ブロッコリー", amount: "1/2個" },
        { name: "玄米", amount: "100g" },
        { name: "わかめ", amount: "5g" },
        { name: "ねぎ", amount: "1本" },
      ],
      steps: [
        "鶏むね肉は一口大に切り、塩・胡椒で下味をつけておきます。",
        "豆腐は水切りをして一口大に切ります。",
        "ブロッコリーは小房に分け、茹でておきます。",
        "玄米は炊いておきます。",
        "わかめは水で戻しておきます。",
        "ねぎは小口切りにします。",
        "鶏むね肉をフライパンで焼きます。",
        "器に玄米、鶏むね肉、豆腐、ブロッコリー、わかめを盛り付けます。",
        "ねぎを散らして完成です。",
      ],
      nutritionFacts: {
        calories: 350,
        protein: 30,
        fat: 10,
        carbs: 40,
        fiber: 5,
        sugar: 2,
        sodium: 200,
      },
      cookingTime: 30,
      servings: 1,
      tags: ["和食", "ヘルシー", "高タンパク"],
      nutritionType: ["low-salt", "high-protein"],
      isQuick: false,
      tips: [
        "鶏むね肉は焼きすぎると固くなるので注意してください。",
        "豆腐の水切りをしっかりすると味が染み込みやすくなります。",
        "玄米は白米よりも食物繊維が豊富です。",
      ],
      benefits: [
        "低塩なので高血圧の方におすすめです。",
        "高タンパクなので筋肉の維持に役立ちます。",
        "食物繊維が豊富なので腸内環境を整えます。",
      ],
    },
    "2": {
      id: "2",
      title: "血糖値を抑える地中海風サラダ",
      description: "血糖値が気になる方におすすめの低GIメニュー。オリーブオイルの健康脂質も摂れます。",
      imageUrl: "/placeholder.svg?height=200&width=300",
      ingredients: [
        { name: "サーモン", amount: "100g" },
        { name: "アボカド", amount: "1/2個" },
        { name: "トマト", amount: "1個" },
        { name: "オリーブ", amount: "10個" },
        { name: "レモン", amount: "1/2個" },
        { name: "全粒粉パン", amount: "1枚" },
        { name: "オリーブオイル", amount: "大さじ1" },
        { name: "塩", amount: "少々" },
        { name: "黒胡椒", amount: "少々" },
      ],
      steps: [
        "サーモンは一口大に切り、塩・胡椒で下味をつけておきます。",
        "アボカドは皮と種を取り除き、一口大に切ります。",
        "トマトはヘタを取り除き、一口大に切ります。",
        "オリーブは種を取り除き、半分に切ります。",
        "レモンは絞り汁を取ります。",
        "全粒粉パンは小さめにカットしてトーストします。",
        "ボウルに切ったサーモン、アボカド、トマト、オリーブを入れます。",
        "オリーブオイル、レモン汁、塩、黒胡椒を加えて軽く混ぜます。",
        "器に盛り付け、トーストした全粒粉パンを添えて完成です。",
      ],
      nutritionFacts: {
        calories: 320,
        protein: 18,
        fat: 22,
        carbs: 15,
        fiber: 6,
        sugar: 3,
        sodium: 280,
      },
      cookingTime: 15,
      servings: 1,
      tags: ["地中海料理", "サラダ", "低GI"],
      nutritionType: ["low-sugar", "healthy-fat"],
      isQuick: true,
      tips: [
        "サーモンは生でも加熱してもOKです。加熱する場合は、フライパンで軽く焼いてから使用してください。",
        "アボカドは完熟したものを選ぶと、クリーミーな食感が楽しめます。",
        "オリーブオイルは良質なエキストラバージンオリーブオイルを使うと風味が増します。",
        "全粒粉パンの代わりに、全粒粉のクラッカーやライ麦パンでも美味しくいただけます。",
      ],
      benefits: [
        "サーモンに含まれるオメガ3脂肪酸は、血糖値の安定に役立ちます。",
        "アボカドの健康的な脂質は、血糖値の急上昇を抑える効果があります。",
        "全粒粉パンは精製された小麦パンよりも血糖値の上昇がゆるやかです。",
        "オリーブオイルに含まれる一価不飽和脂肪酸は、心臓病のリスクを下げる効果があります。",
      ],
    },
  }

  return mockRecipes[id] || null
}

// モックの週間メニューを返す関数
function getMockWeeklyMenu() {
  // モックデータ（実際のAPIが利用できない場合のフォールバック）
  return [
    {
      day: "月曜日",
      breakfast: {
        id: "b1",
        title: "全粒粉トーストとヨーグルト",
        nutritionType: ["high-fiber", "high-protein"],
        cookingTime: 5,
        isQuick: true,
      },
      lunch: {
        id: "l1",
        title: "時短！高タンパク豆腐丼",
        nutritionType: ["high-protein", "low-fat"],
        cookingTime: 10,
        isQuick: true,
      },
      dinner: {
        id: "d1",
        title: "減塩でも美味しい和風煮物",
        nutritionType: ["low-salt", "high-fiber"],
        cookingTime: 40,
        isQuick: false,
      },
    },
    {
      day: "火曜日",
      breakfast: {
        id: "b2",
        title: "野菜スムージーとナッツ",
        nutritionType: ["high-fiber", "healthy-fat"],
        cookingTime: 5,
        isQuick: true,
      },
      lunch: {
        id: "l2",
        title: "血糖値を抑える地中海風サラダ",
        nutritionType: ["low-sugar", "healthy-fat"],
        cookingTime: 15,
        isQuick: true,
      },
      dinner: {
        id: "d2",
        title: "低塩・高タンパクの和風定食",
        nutritionType: ["low-salt", "high-protein"],
        cookingTime: 30,
        isQuick: false,
      },
    },
    {
      day: "水曜日",
      breakfast: {
        id: "b3",
        title: "オートミールとフルーツ",
        nutritionType: ["high-fiber", "low-sugar"],
        cookingTime: 5,
        isQuick: true,
      },
      lunch: {
        id: "l3",
        title: "時短！野菜たっぷりスープパスタ",
        nutritionType: ["balanced", "high-fiber"],
        cookingTime: 15,
        isQuick: true,
      },
      dinner: {
        id: "d3",
        title: "コレステロールを下げる和風スープ",
        nutritionType: ["low-cholesterol", "high-fiber"],
        cookingTime: 25,
        isQuick: false,
      },
    },
    {
      day: "木曜日",
      breakfast: {
        id: "b4",
        title: "豆乳バナナスムージー",
        nutritionType: ["high-protein", "low-sugar"],
        cookingTime: 5,
        isQuick: true,
      },
      lunch: {
        id: "l4",
        title: "時短！アボカドツナサラダ",
        nutritionType: ["healthy-fat", "high-protein"],
        cookingTime: 10,
        isQuick: true,
      },
      dinner: {
        id: "d4",
        title: "魚の蒸し焼きと季節野菜",
        nutritionType: ["low-salt", "high-protein"],
        cookingTime: 25,
        isQuick: false,
      },
    },
    {
      day: "金曜日",
      breakfast: {
        id: "b5",
        title: "卵と野菜のスクランブル",
        nutritionType: ["high-protein", "low-carb"],
        cookingTime: 10,
        isQuick: true,
      },
      lunch: {
        id: "l5",
        title: "時短！豆腐と野菜のサラダ",
        nutritionType: ["high-protein", "low-calorie"],
        cookingTime: 10,
        isQuick: true,
      },
      dinner: {
        id: "d5",
        title: "鶏肉と根菜の煮込み",
        nutritionType: ["high-protein", "high-fiber"],
        cookingTime: 35,
        isQuick: false,
      },
    },
    {
      day: "土曜日",
      breakfast: {
        id: "b6",
        title: "全粒粉パンケーキとベリー",
        nutritionType: ["high-fiber", "low-sugar"],
        cookingTime: 15,
        isQuick: true,
      },
      lunch: {
        id: "l6",
        title: "時短！豆腐ハンバーグ",
        nutritionType: ["high-protein", "low-fat"],
        cookingTime: 15,
        isQuick: true,
      },
      dinner: {
        id: "d6",
        title: "野菜たっぷりラタトゥイユ",
        nutritionType: ["high-fiber", "low-calorie"],
        cookingTime: 30,
        isQuick: false,
      },
    },
    {
      day: "日曜日",
      breakfast: {
        id: "b7",
        title: "アボカドトーストと卵",
        nutritionType: ["healthy-fat", "high-protein"],
        cookingTime: 10,
        isQuick: true,
      },
      lunch: {
        id: "l7",
        title: "時短！きのこと豆腐のスープ",
        nutritionType: ["low-calorie", "high-fiber"],
        cookingTime: 15,
        isQuick: true,
      },
      dinner: {
        id: "d7",
        title: "彩り野菜の蒸し料理",
        nutritionType: ["low-salt", "high-fiber"],
        cookingTime: 25,
        isQuick: false,
      },
    },
  ]
}

