import Link from "next/link"
import { Clock, CheckCircle, AlertCircle, Gift, Settings, MapPin, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* 用戶歡迎區域 */}
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter">歡迎回來，陳先生</h1>
              <p className="text-blue-100">管理您的搬運報價和訂單</p>
            </div>
            <div className="flex gap-2">
              <Link href="/quote">
                <Button className="bg-white text-blue-600 hover:bg-gray-100">獲取新報價</Button>
              </Link>
              <Link href="/dashboard/referral">
                <Button variant="outline" className="border-white text-blue-600 bg-white hover:bg-blue-50">
                  <Gift className="h-4 w-4 mr-2" />
                  推薦朋友
                </Button>
              </Link>
              <Link href="/dashboard/settings">
                <Button variant="outline" className="border-white text-blue-600 bg-white hover:bg-blue-50">
                  <Settings className="h-4 w-4 mr-2" />
                  個人設定
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 推薦獎勵提示卡片 */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600">
                  <Gift className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-green-800">推薦朋友，雙方獲得 $100 抵扣</h3>
                  <p className="text-sm text-green-700">邀請朋友使用搬屋師服務，完成首次訂單後雙方各得 $100</p>
                </div>
              </div>
              <Link href="/dashboard/referral">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  立即邀請
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="ongoing" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
            <TabsTrigger value="ongoing">進行中的報價</TabsTrigger>
            <TabsTrigger value="past">過往報價</TabsTrigger>
          </TabsList>
          <TabsContent value="ongoing" className="space-y-4 mt-6">
            {/* 新增：已收到報價的訂單 */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>從觀塘到荃灣的搬運</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4" />
                      報價編號: Q-20231201-005
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-500">已收到報價</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <div className="font-medium">已收到 4 份報價，最低價 HK$2,200</div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      提交時間: 2023-12-01 09:15
                    </p>
                    <p>完成報價時間: 2023-12-01 10:30</p>
                    <p>搬運日期: 2023-12-15</p>
                    <p>搬運時間: 10:00</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">報價摘要</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>搬運公司 A: HK$2,800</div>
                      <div>搬運公司 B: HK$2,200 ⭐ 最低價</div>
                      <div>搬運公司 C: HK$2,650</div>
                      <div>搬運公司 D: HK$3,100</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
                  <Link href="/dashboard/quotes/Q-20231201-005">查看報價</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>從九龍灣到沙田的搬運</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4" />
                      報價編號: Q-20230501-001
                    </CardDescription>
                  </div>
                  <Badge className="bg-yellow-500">等待報價中</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-yellow-500">
                    <Clock className="h-5 w-5" />
                    <div className="font-medium">
                      剩餘時間: <span className="countdown">00:45:30</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      提交時間: 2023-05-01 14:30
                    </p>
                    <p>預計完成報價時間: 2023-05-01 15:30</p>
                    <p className="mt-2 text-xs">
                      *辦公時間: 星期一至六 10:00-20:00，勞工假期休息。在辦公時間外提交的報價將在下一個工作日處理。
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/dashboard/quotes/Q-20230501-001">查看詳情</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>從中環到銅鑼灣的搬運</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4" />
                      報價編號: Q-20230430-002
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-500">已收到報價</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-500">
                    <CheckCircle className="h-5 w-5" />
                    <div className="font-medium">已收到 3 份報價</div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      提交時間: 2023-04-30 10:15
                    </p>
                    <p>完成報價時間: 2023-04-30 11:05</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/dashboard/quotes/Q-20230430-002">查看報價</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="past" className="space-y-4 mt-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>從太古到將軍澳的搬運</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4" />
                      報價編號: Q-20230415-003
                    </CardDescription>
                  </div>
                  <Badge className="bg-gray-500">已完成</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      提交時間: 2023-04-15 09:30
                    </p>
                    <p>完成報價時間: 2023-04-15 10:20</p>
                    <p>搬運日期: 2023-04-20</p>
                    <p>選擇的搬運公司: 安心搬運 (A-003)</p>
                    <p>報價金額: HK$2,800</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" className="flex-1" asChild>
                  <Link href="/dashboard/orders/J-20230510-001">查看詳情</Link>
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <Link href="/review/J-20230510-001">評價服務</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>從元朗到屯門的搬運</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4" />
                      報價編號: Q-20230401-004
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="border-red-500 text-red-500">
                    已取消
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-red-500">
                    <AlertCircle className="h-5 w-5" />
                    <div className="font-medium">您已取消此報價請求</div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      提交時間: 2023-04-01 15:45
                    </p>
                    <p>取消時間: 2023-04-01 16:30</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/dashboard/quotes/Q-20230401-004">查看詳情</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
