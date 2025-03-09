import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import HealthDataForm from "@/components/health-data-form"
import HealthDataUpload from "@/components/health-data-upload"
import HealthDataChart from "@/components/health-data-chart"
import { Flower } from "lucide-react"
import Image from "next/image"

export default function HealthDataPage() {
  return (
    <div className="flex flex-col gap-6 relative">
      {/* 装飾的な花のイラスト - 右上 */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-10 pointer-events-none">
        <Image src="/flower-decoration-3.svg" alt="花の装飾" width={100} height={100} className="w-full h-full" />
      </div>

      <div>
        <div className="flex items-center mb-2">
          <Flower className="h-6 w-6 text-primary mr-2" fill="#FFD1DC" />
          <h1 className="text-3xl font-bold tracking-tight handwritten-heading">健康診断データ</h1>
        </div>
        <p className="text-muted-foreground">健康診断の結果を入力・管理し、あなたの健康状態を把握しましょう</p>
      </div>

      <Tabs defaultValue="form" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px] rounded-full bg-pastel-lavender/30">
          <TabsTrigger value="form" className="cute-tabs-trigger">
            手入力
          </TabsTrigger>
          <TabsTrigger value="upload" className="cute-tabs-trigger">
            画像アップロード
          </TabsTrigger>
        </TabsList>
        <TabsContent value="form" className="mt-4">
          <Card className="cute-card">
            <CardHeader>
              <div className="flex items-center">
                <Flower className="h-5 w-5 text-primary mr-2" fill="#FFD1DC" />
                <CardTitle>健康診断データの入力</CardTitle>
              </div>
              <CardDescription>
                健康診断の結果を手動で入力してください。異常値は自動的にハイライトされます。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HealthDataForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="upload" className="mt-4">
          <Card className="cute-card">
            <CardHeader>
              <div className="flex items-center">
                <Flower className="h-5 w-5 text-primary mr-2" fill="#FFD1DC" />
                <CardTitle>健康診断結果の画像アップロード</CardTitle>
              </div>
              <CardDescription>
                健康診断結果の画像をアップロードすると、OCR技術で自動的にデータを抽出します。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HealthDataUpload />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-6 cute-card">
        <CardHeader>
          <div className="flex items-center">
            <Flower className="h-5 w-5 text-primary mr-2" fill="#FFD1DC" />
            <CardTitle>健康データの推移</CardTitle>
          </div>
          <CardDescription>過去の健康診断データの推移をグラフで確認できます</CardDescription>
        </CardHeader>
        <CardContent>
          <HealthDataChart />
        </CardContent>
      </Card>
    </div>
  )
}

