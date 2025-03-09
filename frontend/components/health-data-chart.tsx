"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartTooltipItem } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"

// サンプルデータ
const healthData = [
  { date: "2023-10", systolicBP: 125, diastolicBP: 82, bloodSugar: 95, ldlCholesterol: 110, hdlCholesterol: 45 },
  { date: "2023-11", systolicBP: 128, diastolicBP: 84, bloodSugar: 98, ldlCholesterol: 115, hdlCholesterol: 43 },
  { date: "2023-12", systolicBP: 130, diastolicBP: 85, bloodSugar: 102, ldlCholesterol: 120, hdlCholesterol: 42 },
  { date: "2024-01", systolicBP: 132, diastolicBP: 86, bloodSugar: 105, ldlCholesterol: 125, hdlCholesterol: 40 },
  { date: "2024-02", systolicBP: 128, diastolicBP: 83, bloodSugar: 100, ldlCholesterol: 118, hdlCholesterol: 41 },
  { date: "2024-03", systolicBP: 126, diastolicBP: 82, bloodSugar: 97, ldlCholesterol: 112, hdlCholesterol: 44 },
]

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
                      <ChartTooltip
                        content={
                          <ChartTooltipContent>
                            {({ payload }) => {
                              if (!payload?.length) return null
                              return (
                                <div>
                                  <ChartTooltipItem label="日付" value={payload[0].payload.date} />
                                  <ChartTooltipItem
                                    label="収縮期血圧"
                                    value={`${payload[0].value} mmHg`}
                                    color="#ef4444"
                                  />
                                  <ChartTooltipItem
                                    label="拡張期血圧"
                                    value={`${payload[1].value} mmHg`}
                                    color="#3b82f6"
                                  />
                                </div>
                              )
                            }}
                          </ChartTooltipContent>
                        }
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="systolicBP"
                        name="収縮期血圧"
                        stroke="#ef4444"
                        activeDot={{ r: 8 }}
                      />
                      <Line type="monotone" dataKey="diastolicBP" name="拡張期血圧" stroke="#3b82f6" />
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
                      <YAxis />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent>
                            {({ payload }) => {
                              if (!payload?.length) return null
                              return (
                                <div>
                                  <ChartTooltipItem label="日付" value={payload[0].payload.date} />
                                  <ChartTooltipItem
                                    label="血糖値"
                                    value={`${payload[0].value} mg/dL`}
                                    color="#f97316"
                                  />
                                </div>
                              )
                            }}
                          </ChartTooltipContent>
                        }
                      />
                      <Legend />
                      <Line type="monotone" dataKey="bloodSugar" name="血糖値" stroke="#f97316" activeDot={{ r: 8 }} />
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
                      <ChartTooltip
                        content={
                          <ChartTooltipContent>
                            {({ payload }) => {
                              if (!payload?.length) return null
                              return (
                                <div>
                                  <ChartTooltipItem label="日付" value={payload[0].payload.date} />
                                  <ChartTooltipItem
                                    label="LDLコレステロール"
                                    value={`${payload[0].value} mg/dL`}
                                    color="#dc2626"
                                  />
                                  <ChartTooltipItem
                                    label="HDLコレステロール"
                                    value={`${payload[1].value} mg/dL`}
                                    color="#22c55e"
                                  />
                                </div>
                              )
                            }}
                          </ChartTooltipContent>
                        }
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="ldlCholesterol"
                        name="LDLコレステロール"
                        stroke="#dc2626"
                        activeDot={{ r: 8 }}
                      />
                      <Line type="monotone" dataKey="hdlCholesterol" name="HDLコレステロール" stroke="#22c55e" />
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
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">データがありません</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

