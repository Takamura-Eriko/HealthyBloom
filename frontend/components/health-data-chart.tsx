"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltipContent, ChartTooltipItem } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from "recharts"

// サンプルデータを更新
const healthData = [
  {
    date: "2023-10",
    systolicBP: 125,
    diastolicBP: 82,
    bloodSugar: 95,
    hba1c: 5.6,
    totalCholesterol: 180,
    ldlCholesterol: 110,
    hdlCholesterol: 45,
    got: 25,
    gpt: 30,
    rGpt: 40,
  },
  {
    date: "2023-11",
    systolicBP: 128,
    diastolicBP: 84,
    bloodSugar: 98,
    hba1c: 5.7,
    totalCholesterol: 185,
    ldlCholesterol: 115,
    hdlCholesterol: 43,
    got: 28,
    gpt: 32,
    rGpt: 45,
  },
  {
    date: "2023-12",
    systolicBP: 130,
    diastolicBP: 85,
    bloodSugar: 102,
    hba1c: 5.8,
    totalCholesterol: 190,
    ldlCholesterol: 120,
    hdlCholesterol: 42,
    got: 30,
    gpt: 35,
    rGpt: 50,
  },
  {
    date: "2024-01",
    systolicBP: 132,
    diastolicBP: 86,
    bloodSugar: 105,
    hba1c: 5.9,
    totalCholesterol: 195,
    ldlCholesterol: 125,
    hdlCholesterol: 40,
    got: 32,
    gpt: 38,
    rGpt: 55,
  },
  {
    date: "2024-02",
    systolicBP: 128,
    diastolicBP: 83,
    bloodSugar: 100,
    hba1c: 5.8,
    totalCholesterol: 188,
    ldlCholesterol: 118,
    hdlCholesterol: 41,
    got: 29,
    gpt: 34,
    rGpt: 48,
  },
  {
    date: "2024-03",
    systolicBP: 126,
    diastolicBP: 82,
    bloodSugar: 97,
    hba1c: 5.7,
    totalCholesterol: 182,
    ldlCholesterol: 112,
    hdlCholesterol: 44,
    got: 26,
    gpt: 31,
    rGpt: 42,
  },
]

// カスタムツールチップコンポーネント
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) {
    return null
  }

  return (
    <ChartTooltipContent>
      <div>
        <ChartTooltipItem label="日付" value={label} />
        {payload.map((entry: any, index: number) => (
          <ChartTooltipItem
            key={`item-${index}`}
            label={entry.name}
            value={`${entry.value} ${entry.unit || ""}`}
            color={entry.color}
          />
        ))}
      </div>
    </ChartTooltipContent>
  )
}

export default function HealthDataChart() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <Select defaultValue="6months">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="期間を選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3months">3ヶ月</SelectItem>
            <SelectItem value="6months">6ヶ月</SelectItem>
            <SelectItem value="1year">1年</SelectItem>
            <SelectItem value="all">すべて</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="bloodPressure" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="bloodPressure">血圧</TabsTrigger>
          <TabsTrigger value="bloodSugar">血糖値</TabsTrigger>
          <TabsTrigger value="cholesterol">コレステロール</TabsTrigger>
          <TabsTrigger value="liverFunction">肝機能</TabsTrigger>
        </TabsList>

        <TabsContent value="bloodPressure" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="h-[300px]">
                <ChartContainer>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={healthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="systolicBP"
                        name="収縮期血圧"
                        stroke="#ef4444"
                        activeDot={{ r: 8 }}
                        unit="mmHg"
                      />
                      <Line type="monotone" dataKey="diastolicBP" name="拡張期血圧" stroke="#3b82f6" unit="mmHg" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bloodSugar" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="h-[300px]">
                <ChartContainer>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={healthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" domain={[4, 7]} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="bloodSugar"
                        name="血糖値"
                        stroke="#f97316"
                        activeDot={{ r: 8 }}
                        yAxisId="left"
                        unit="mg/dL"
                      />
                      <Line
                        type="monotone"
                        dataKey="hba1c"
                        name="HbA1c"
                        stroke="#8b5cf6"
                        activeDot={{ r: 8 }}
                        yAxisId="right"
                        unit="%"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cholesterol" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="h-[300px]">
                <ChartContainer>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={healthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="totalCholesterol"
                        name="総コレステロール"
                        stroke="#8b5cf6"
                        activeDot={{ r: 8 }}
                        unit="mg/dL"
                      />
                      <Line
                        type="monotone"
                        dataKey="ldlCholesterol"
                        name="LDLコレステロール"
                        stroke="#dc2626"
                        activeDot={{ r: 8 }}
                        unit="mg/dL"
                      />
                      <Line
                        type="monotone"
                        dataKey="hdlCholesterol"
                        name="HDLコレステロール"
                        stroke="#22c55e"
                        unit="mg/dL"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="liverFunction" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="h-[300px]">
                <ChartContainer>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={healthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="got"
                        name="GOT/AST"
                        stroke="#ef4444"
                        activeDot={{ r: 8 }}
                        unit="U/L"
                      />
                      <Line type="monotone" dataKey="gpt" name="GPT/ALT" stroke="#3b82f6" unit="U/L" />
                      <Line type="monotone" dataKey="rGpt" name="γ-GTP" stroke="#22c55e" unit="U/L" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

