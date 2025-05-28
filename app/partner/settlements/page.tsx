import Link from "next/link"
import { CalendarIcon, ArrowDownIcon, ArrowUpIcon, InfoIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function SettlementsPage() {
  // 模擬結算數據 - 在實際應用中，這些數據應該從API獲取
  const settlements = [
    {
      id: "S-20230512",
      date: "2023-05-12",
      status: "completed",
      amount: 2720,
      jobs: [
        {
          id: "J-20230510-001",
          title: "從太古到將軍澳的搬運",
          customer: "陳大文",
          deposit: 1020,
          platformFee: 340,
          settledAmount: 680,
        },
        {
          id: "J-20230508-003",
          title: "從銅鑼灣到沙田的搬運",
          customer: "李小明",
          deposit: 900,
          platformFee: 300,
          settledAmount: 600,
        },
        {
          id: "J-20230509-002",
          title: "從旺角到元朗的搬運",
          customer: "黃麗華",
          deposit: 2160,
          platformFee: 720,
          settledAmount: 1440,
        },
      ],
    },
    {
      id: "S-20230505",
      date: "2023-05-05",
      status: "completed",
      amount: 3600,
      jobs: [
        {
          id: "J-20230503-002",
          title: "從中環到北角的搬運",
          customer: "張三",
          deposit: 1500,
          platformFee: 500,
          settledAmount: 1000,
        },
        {
          id: "J-20230502-001",
          title: "從觀塘到九龍灣的搬運",
          customer: "李四",
          deposit: 1200,
          platformFee: 400,
          settledAmount: 800,
        },
        {
          id: "J-20230504-003",
          title: "從荃灣到屯門的搬運",
          customer: "王五",
          deposit: 2700,
          platformFee: 900,
          settledAmount: 1800,
        },
      ],
    },
  ]

  // 計算未來結算日期（下一個星期五）
  const getNextFriday = () => {
    const today = new Date()
    const dayOfWeek = today.getDay() // 0 = 星期日, 1 = 星期一, ..., 6 = 星期六
    const daysUntilFriday = (5 - dayOfWeek + 7) % 7 || 7 // 如果今天是星期五，則計算下週五
    const nextFriday = new Date(today)
    nextFriday.setDate(today.getDate() + daysUntilFriday)

    // 格式化日期為 YYYY-MM-DD
    return nextFriday.toISOString().split("T")[0]
  }

  // 模擬待結算的訂單
  const pendingJobs = [
    {
      id: "J-20230515-002",
      title: "從灣仔到鰂魚涌的搬運",
      customer: "周小明",
      date: "2023-05-15",
      deposit: 1350,
      platformFee: 450,
      settledAmount: 900,
    },
    {
      id: "J-20230516-001",
      title: "從深水埗到大埔的搬運",
      customer: "林小華",
      date: "2023-05-16",
      deposit: 1800,
      platformFee: 600,
      settledAmount: 1200,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tighter">結算管理</h1>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-primary" />
            <span className="text-sm">下次結算日期: {getNextFriday()} (星期五)</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>結算概覽</CardTitle>
            <CardDescription>查看您的結算記錄和待結算訂單</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-gray-500">本月已結算金額</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">HK$6,320</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600 flex items-center">
                        <ArrowUpIcon className="h-3 w-3 mr-1" />
                        12%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-gray-500">待結算金額</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">HK$2,100</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600 flex items-center">
                        <ArrowUpIcon className="h-3 w-3 mr-1" />
                        5%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-gray-500">平台服務費</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">HK$940</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-600 flex items-center">
                        <ArrowDownIcon className="h-3 w-3 mr-1" />
                        3%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Alert className="mb-6">
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>結算說明</AlertTitle>
              <AlertDescription>
                <p>平台將於每週五結算已確認訂單的訂金款項。</p>
                <p>平台服務費（總訂單金額的10%）將直接從訂金中扣除，餘款完全屬於搬運公司。</p>
                <p>結算金額將在3個工作天內轉入您的銀行帳戶。</p>
              </AlertDescription>
            </Alert>

            <Tabs defaultValue="pending">
              <TabsList className="mb-4">
                <TabsTrigger value="pending">待結算訂單</TabsTrigger>
                <TabsTrigger value="history">結算歷史</TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-4">
                <Table>
                  <TableCaption>待結算訂單將於下次結算日期（{getNextFriday()}）處理</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>訂單編號</TableHead>
                      <TableHead>訂單名稱</TableHead>
                      <TableHead>客戶</TableHead>
                      <TableHead>訂單日期</TableHead>
                      <TableHead>訂金</TableHead>
                      <TableHead>平台費</TableHead>
                      <TableHead className="text-right">結算金額</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingJobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">
                          <Link href={`/partner/jobs/${job.id}`} className="text-primary hover:underline">
                            {job.id}
                          </Link>
                        </TableCell>
                        <TableCell>{job.title}</TableCell>
                        <TableCell>{job.customer}</TableCell>
                        <TableCell>{job.date}</TableCell>
                        <TableCell>HK${job.deposit}</TableCell>
                        <TableCell>HK${job.platformFee}</TableCell>
                        <TableCell className="text-right font-medium">HK${job.settledAmount}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-gray-50 dark:bg-gray-800">
                      <TableCell colSpan={5}></TableCell>
                      <TableCell className="font-medium">總計</TableCell>
                      <TableCell className="text-right font-bold">HK$2,100</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="history" className="space-y-6">
                {settlements.map((settlement) => (
                  <Card key={settlement.id} className="overflow-hidden">
                    <CardHeader className="bg-gray-50 dark:bg-gray-800 py-4">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                        <div>
                          <CardTitle className="text-lg">結算編號: {settlement.id}</CardTitle>
                          <CardDescription>結算日期: {settlement.date}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">結算金額:</span>
                          <span className="text-lg font-bold text-primary">HK${settlement.amount}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>訂單編號</TableHead>
                            <TableHead>訂單名稱</TableHead>
                            <TableHead>客戶</TableHead>
                            <TableHead>訂金</TableHead>
                            <TableHead>平台費</TableHead>
                            <TableHead className="text-right">結算金額</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {settlement.jobs.map((job) => (
                            <TableRow key={job.id}>
                              <TableCell className="font-medium">
                                <Link href={`/partner/jobs/${job.id}`} className="text-primary hover:underline">
                                  {job.id}
                                </Link>
                              </TableCell>
                              <TableCell>{job.title}</TableCell>
                              <TableCell>{job.customer}</TableCell>
                              <TableCell>HK${job.deposit}</TableCell>
                              <TableCell>HK${job.platformFee}</TableCell>
                              <TableCell className="text-right font-medium">HK${job.settledAmount}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="bg-gray-50 dark:bg-gray-800">
                            <TableCell colSpan={4}></TableCell>
                            <TableCell className="font-medium">總計</TableCell>
                            <TableCell className="text-right font-bold">HK${settlement.amount}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                    <CardFooter className="flex justify-end py-3 bg-gray-50 dark:bg-gray-800">
                      <Button variant="outline" size="sm">
                        下載結算單
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
