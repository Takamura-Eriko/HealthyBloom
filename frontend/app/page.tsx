import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Flower, Utensils } from "lucide-react"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex flex-col gap-8 py-8">
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-16 relative">
        {/* 装飾的な花のイラスト - 左上 */}
        {/* <div className="absolute top-0 left-0 w-24 h-24 md:w-32 md:h-32 opacity-20 pointer-events-none"> */}
          {/* <Image src="/flower-decoration-1.svg" alt="花の装飾" width={120} height={120} className="w-full h-full" /> */}
        {/* </div> */}

        {/* 装飾的な花のイラスト - 右下 */}
        {/* <div className="absolute bottom-0 right-0 w-24 h-24 md:w-32 md:h-32 opacity-20 pointer-events-none"> */}
          {/* <Image src="/flower-decoration-2.svg" alt="花の装飾" width={120} height={120} className="w-full h-full" /> */}
        {/* </div> */}

        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Flower className="h-8 w-8 text-primary mr-2" fill="#FFD1DC" />
            <Flower className="h-10 w-10 text-primary mx-2" fill="#FFD1DC" />
            <Flower className="h-8 w-8 text-primary ml-2" fill="#FFD1DC" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold handwritten-heading">
            HealthyBloom<span className="text-primary cute-text-decoration">で健康管理</span>
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            健康診断結果を簡単に管理し、あなたの健康状態に合わせた食事提案や生活習慣の改善アドバイスを受けられます。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="rounded-full bg-pastel-pink hover:bg-primary">
              <Link href="/health-data">
                健康データを入力する
                <Flower className="ml-2 h-4 w-4" fill="#FFF" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="rounded-full border-pastel-pink text-primary">
              <Link href="/register">新規登録</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container space-y-6 py-8 md:py-12 lg:py-16">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <div className="flex items-center justify-center">
            <div className="w-8 h-px bg-pastel-pink"></div>
            <Flower className="h-6 w-6 text-primary mx-2" fill="#FFD1DC" />
            <div className="w-8 h-px bg-pastel-pink"></div>
          </div>
          <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-4xl handwritten-heading">主な機能</h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            HealthyBloomは主婦の方々の健康管理をサポートする様々な機能を提供します
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <Card className="cute-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">健康診断結果の管理</CardTitle>
              <Flower className="h-5 w-5 text-primary" fill="#FFD1DC" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                健康診断の結果を手入力またはOCR解析で簡単に記録。過去の推移をグラフで確認できます。
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full rounded-full" asChild>
                <Link href="/health-data">
                  詳しく見る
                  <Flower className="ml-2 h-4 w-4" fill="#FFD1DC" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          <Card className="cute-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">食事提案</CardTitle>
              <Utensils className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                健康状態に合わせた食事メニューを提案。低塩・低糖・高タンパクなど、あなたに最適な食事を見つけられます。
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full rounded-full" asChild>
                <Link href="/meal-suggestions">
                  詳しく見る
                  <Flower className="ml-2 h-4 w-4" fill="#FFD1DC" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          <Card className="cute-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">生活習慣の改善アドバイス</CardTitle>
              <Flower className="h-5 w-5 text-primary" fill="#FFD1DC" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                健診データをもとに運動・睡眠・ストレス改善の提案。簡単なリマインダー機能も利用できます。
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full rounded-full" asChild>
                <Link href="/advice">
                  詳しく見る
                  <Flower className="ml-2 h-4 w-4" fill="#FFD1DC" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  )
}

