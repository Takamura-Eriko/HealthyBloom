import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Flower } from "lucide-react"
import Image from "next/image"

// サンプルの生活習慣アドバイスデータ
const lifestyleAdvice = [
  {
    id: "1",
    category: "exercise",
    title: "血圧を下げる有酸素運動",
    description:
      "血圧が高めの方におすすめの有酸素運動プログラム。ウォーキングやサイクリングなど、無理なく続けられる運動を取り入れましょう。",
    tips: [
      "1日30分のウォーキングを週3回以上",
      "階段を使う機会を増やす",
      "家事の合間にストレッチ",
      "テレビを見ながらの軽い筋トレ",
    ],
  },
  {
    id: "2",
    category: "sleep",
    title: "質の高い睡眠のための習慣",
    description: "睡眠の質を高めることで、血圧の安定や血糖値の改善につながります。就寝前のルーティンを見直しましょう。",
    tips: [
      "就寝時間を一定に保つ",
      "寝る1時間前にはスマホやPCの使用を控える",
      "寝室は暗く、静かに、涼しく保つ",
      "就寝前のカフェイン摂取を避ける",
    ],
  },
  {
    id: "3",
    category: "stress",
    title: "ストレス管理のためのマインドフルネス",
    description: "ストレスは血圧や血糖値に悪影響を与えます。日常に取り入れやすいマインドフルネス実践法を紹介します。",
    tips: ["1日5分の深呼吸瞑想", "感謝日記をつける習慣", "趣味の時間を確保する", "自然の中で過ごす時間を作る"],
  },
]

export default function AdvicePage() {
  return (
    <div className="flex flex-col gap-6 relative">
      {/* 装飾的な花のイラスト - 右上 */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-10 pointer-events-none">
        <Image src="/flower-decoration-3.svg" alt="花の装飾" width={100} height={100} className="w-full h-full" />
      </div>

      <div>
        <div className="flex items-center mb-2">
          <Flower className="h-6 w-6 text-primary mr-2" fill="#FFD1DC" />
          <h1 className="text-3xl font-bold tracking-tight handwritten-heading">生活習慣の改善アドバイス</h1>
        </div>
        <p className="text-muted-foreground">
          健康診断データをもとに、運動・睡眠・ストレス管理のアドバイスを提供します
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full rounded-full bg-pastel-lavender/30">
          <TabsTrigger value="all" className="cute-tabs-trigger">
            すべて
          </TabsTrigger>
          <TabsTrigger value="exercise" className="cute-tabs-trigger">
            運動
          </TabsTrigger>
          <TabsTrigger value="sleep" className="cute-tabs-trigger">
            睡眠
          </TabsTrigger>
          <TabsTrigger value="stress" className="cute-tabs-trigger">
            ストレス管理
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {lifestyleAdvice.map((advice) => (
              <Card key={advice.id} className="cute-card">
                <CardHeader>
                  <div className="flex items-center mb-2">
                    {advice.category === "exercise" && <Flower className="h-5 w-5 text-primary mr-2" fill="#FFD1DC" />}
                    {advice.category === "sleep" && <Flower className="h-5 w-5 text-primary mr-2" fill="#E6E6FA" />}
                    {advice.category === "stress" && <Flower className="h-5 w-5 text-primary mr-2" fill="#C7F6D4" />}
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                      {advice.category === "exercise" && "運動"}
                      {advice.category === "sleep" && "睡眠"}
                      {advice.category === "stress" && "ストレス管理"}
                    </span>
                  </div>
                  <CardTitle>{advice.title}</CardTitle>
                  <CardDescription>{advice.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">実践ポイント</h4>
                    <ul className="space-y-1 list-disc pl-5">
                      {advice.tips.map((tip, index) => (
                        <li key={index} className="text-sm">
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button variant="outline" size="sm" className="w-full rounded-full" asChild>
                    <Link href={`/advice/${advice.id}`}>
                      詳細を見る
                      <Flower className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 他のタブコンテンツも同様に実装 */}
        <TabsContent value="exercise" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {lifestyleAdvice
              .filter((advice) => advice.category === "exercise")
              .map((advice) => (
                <Card key={advice.id} className="cute-card">
                  {/* カードの内容は同じなので省略 */}
                  <CardHeader>
                    <div className="flex items-center mb-2">
                      <Flower className="h-5 w-5 text-primary mr-2" fill="#FFD1DC" />
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                        運動
                      </span>
                    </div>
                    <CardTitle>{advice.title}</CardTitle>
                    <CardDescription>{advice.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">実践ポイント</h4>
                      <ul className="space-y-1 list-disc pl-5">
                        {advice.tips.map((tip, index) => (
                          <li key={index} className="text-sm">
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button variant="outline" size="sm" className="w-full rounded-full" asChild>
                      <Link href={`/advice/${advice.id}`}>
                        詳細を見る
                        <Flower className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* 他のカテゴリのタブも同様に実装 */}
      </Tabs>
    </div>
  )
}

