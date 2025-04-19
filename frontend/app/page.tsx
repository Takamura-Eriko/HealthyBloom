"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Flower, Utensils, Heart } from "lucide-react"
import { useAuth } from "@/lib/authProvider"

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col gap-8 py-8">
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-16 relative">
        <div className="container flex max-w-[64rem] flex-col items-center gap-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold handwritten-heading">
            HealthyBloom<span className="text-white cute-text-decoration">で健康管理</span>
          </h1>
          <p className="max-w-[42rem] leading-normal text-black sm:text-xl sm:leading-8">
            健康診断結果を簡単に管理し、あなたの健康状態に合わせた
            <br />
            食事提案や生活習慣の改善アドバイスを受けられます。
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {user ? (
             <>
              <Button
               asChild
               size="lg"
               className="rounded-full bg-pastel-pink hover:bg-primary text-black text-lg"
              >
              <Link href="/health-data">健康診断結果を入力</Link>
              </Button>
              <Button
               asChild
               size="lg"
               className="rounded-full bg-pink-200 hover:bg-primary text-black text-lg"
              >
               <Link href="/meal-suggestions">食事提案をする</Link>
             </Button>
            </>
            ) : (
            <>
         <Button
            asChild
            size="lg"
            className="rounded-full bg-pastel-pink hover:bg-primary text-black"
             >
            <Link href="/login">ログイン</Link>
           </Button>
           <Button
            variant="outline"
            size="lg"
            asChild
            className="rounded-full border-pastel-pink text-primary"
           >
            <Link href="/register">新規登録</Link>
         </Button>
         </>
        )}
       </div>

        </div>
      </section>

      <section className="container space-y-6 py-4">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-4xl">主な機能</h2>
          <p className="max-w-[85%] leading-normal text-black sm:text-lg sm:leading-7">
            HealthyBloomは主婦の方々の健康管理をサポートする様々な機能を提供します
          </p>
        </div>

        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <Card className="cute-card">
            <CardHeader className="flex flex-col items-center gap-2 pb-0 pt-4">
              <Flower className="h-6 w-6 text-primary" fill="#FFD1DC" />
              <CardTitle className="text-xl text-primary font-semibold text-center">
                健康診断結果の管理
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-2">
              <p className="text-base text-black leading-relaxed tracking-tight">
                健康診断の結果を手入力またはOCR解析で<br />
                簡単に記録。<br />
                過去の推移をグラフで確認できます。
              </p>
            </CardContent>
            <CardFooter className="px-4 pb-4" />
          </Card>

          <Card className="cute-card">
            <CardHeader className="flex flex-col items-center gap-2 pb-0 pt-4">
              <Utensils className="h-6 w-6 text-primary" />
              <CardTitle className="text-xl text-primary font-semibold text-center">
                食事提案
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-2">
              <p className="text-base text-black leading-relaxed tracking-tight">
                健康状態に合わせた食事メニューを <br />
                提案。低塩・低糖・高タンパクなど、<br />
                あなたに最適な食事を見つけられます。
              </p>
            </CardContent>
            <CardFooter className="px-4 pb-4" />
          </Card>

          <Card className="cute-card">
            <CardHeader className="flex flex-col items-center gap-2 pb-0 pt-4">
              <Heart className="h-6 w-6 text-primary" fill="#FFD1DC" />
              <CardTitle className="text-xl text-primary font-semibold text-center">
                生活習慣の改善アドバイス
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-2">
              <p className="text-base text-black leading-relaxed tracking-tight">
                健診データをもとに運動・睡眠・ストレス<br />
                改善の提案。<br />
                簡単なリマインダー機能も利用できます。
              </p>
            </CardContent>
            <CardFooter className="px-4 pb-4" />
          </Card>
        </div>
      </section>
    </div>
  )
}
