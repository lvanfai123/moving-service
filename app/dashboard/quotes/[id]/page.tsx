import Link from "next/link"
import { ArrowLeft, Clock } from "lucide-react"
import { InfoIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { QuoteCard } from "@/components/quote-card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export default function QuoteDetailPage({ params }: { params: { id: string } }) {
  const quoteId = params.id

  // 這裡模擬從API獲取報價詳情
  const isOngoing = quoteId === "Q-20230501-001"
  const hasQuotes = quoteId === "Q-20230430-002" || quoteId === "Q-20230415-003"
  const isCancelled = quoteId === "Q-20230401-004"
  const isCompleted = quoteId === "Q-20230415-003"

  // 模擬報價數據
  const quotes = [
    {
      id: "A-003",
      companyName: "搬運公司 A",
      companyCode: "A-003",
      rating: 4.0,
      price: 2800,
      availableDates: ["2023-05-10"],
      isSelected: isCompleted,
    },
    {
      id: "B-007",
      companyName: "搬運公司 B",
      companyCode: "B-007",
      rating: 5.0,
      price: 3200,
      availableDates: ["2023-05-10", "2023-05-11"],
      isSelected: false,
    },
    {
      id: "C-012",
      companyName: "搬運公司 C",
      companyCode: "C-012",
      rating: 3.5,
      price: 2500,
      availableDates: ["2023-05-12"],
      isSelected: false,
    },
  ]

  return (
    <div className="py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tighter">報價詳情</h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <CardTitle className="text-xl">
                  {quoteId === "Q-20230501-001" && "從九龍灣到沙田的搬運"}
                  {quoteId === "Q-20230430-002" && "從中環到銅鑼灣的搬運"}
                  {quoteId === "Q-20230415-003" && "從太古到將軍澳的搬運"}
                  {quoteId === "Q-20230401-004" && "從元朗到屯門的搬運"}
                </CardTitle>
                <CardDescription>報價編號: {quoteId}</CardDescription>
              </div>
              {isOngoing && <Badge className="bg-yellow-500">等待報價中</Badge>}
              {hasQuotes && !isCompleted && <Badge className="bg-green-500">已收到報價</Badge>}
              {isCompleted && <Badge className="bg-gray-500">已完成</Badge>}
              {isCancelled && (
                <Badge variant="outline" className="border-red-500 text-red-500">
                  已取消
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {isOngoing && (
              <div className="flex items-center gap-2 text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <Clock className="h-5 w-5" />
                <div className="font-medium">
                  剩餘時間: <span className="countdown">00:45:30</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">搬運詳情</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-gray-500 dark:text-gray-400">搬出地址:</span>{" "}
                    {quoteId === "Q-20230501-001" ? "九龍灣宏開道8號其士商業中心608室" : "其他地址"}
                  </p>
                  <p>
                    <span className="text-gray-500 dark:text-gray-400">搬入地址:</span>{" "}
                    {quoteId === "Q-20230501-001" ? "沙田石門安群街3號京瑞廣場一期19樓C室" : "其他地址"}
                  </p>
                  <p>
                    <span className="text-gray-500 dark:text-gray-400">搬運日期:</span>{" "}
                    {quoteId === "Q-20230501-001" ? "2023-05-10" : "其他日期"}
                  </p>
                  <p>
                    <span className="text-gray-500 dark:text-gray-400">搬運時間:</span>{" "}
                    {quoteId === "Q-20230501-001" ? "14:00" : "其他時間"}
                  </p>
                  <p>
                    <span className="text-gray-500 dark:text-gray-400">電梯:</span>{" "}
                    {quoteId === "Q-20230501-001" ? "兩處均有" : "其他"}
                  </p>
                  <p>
                    <span className="text-gray-500 dark:text-gray-400">梯級:</span>{" "}
                    {quoteId === "Q-20230501-001" ? "無" : "其他"}
                  </p>
                  <p>
                    <span className="text-gray-500 dark:text-gray-400">停車距離:</span>{" "}
                    {quoteId === "Q-20230501-001" ? "10米內" : "其他"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">搬運物品</h3>
                <div className="space-y-1 text-sm">
                  <p>1. 沙發 x 1 (200cm x 90cm x 85cm)</p>
                  <p>2. 雙人床 x 1 (190cm x 150cm x 40cm)</p>
                  <p>3. 衣櫃 x 2 (180cm x 60cm x 200cm)</p>
                  <p>4. 餐桌 x 1 (150cm x 80cm x 75cm)</p>
                  <p>5. 椅子 x 4 (45cm x 45cm x 90cm)</p>
                  <p>6. 封裝箱 x 10 (50cm x 40cm x 40cm)</p>
                </div>
              </div>
            </div>

            {hasQuotes && (
              <Alert variant="info" className="mb-4">
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>為何使用搬運公司代號？</AlertTitle>
                <AlertDescription>
                  為確保公平競爭和避免偏見，我們使用代號（如搬運公司
                  A、B、C）代替真實名稱。這讓您能夠純粹基於價格、評分和服務內容做出選擇，而不受品牌影響。所有搬運公司均經過我們嚴格審核，確保服務質素。
                </AlertDescription>
              </Alert>
            )}

            {hasQuotes && (
              <div>
                <h3 className="font-medium mb-4">收到的報價</h3>
                <div className="space-y-4">
                  {quotes.map((quote) => (
                    <QuoteCard
                      key={quote.id}
                      id={quote.id}
                      companyName={quote.companyName}
                      companyCode={quote.companyCode}
                      rating={quote.rating}
                      price={quote.price}
                      availableDates={quote.availableDates}
                      isSelected={quote.isSelected}
                      quoteId={quoteId}
                    />
                  ))}
                </div>
              </div>
            )}

            {isOngoing && (
              <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="font-medium mb-2">報價進度</p>
                <p>提交時間: 2023-05-01 14:30</p>
                <p>預計完成報價時間: 2023-05-01 15:30</p>
                <p className="mt-2 text-xs">
                  *辦公時間: 星期一至六 10:00-20:00，勞工假期休息。在辦公時間外提交的報價將在下一個工作日處理。
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/dashboard">返回列表</Link>
            </Button>
            {isOngoing && <Button variant="destructive">取消報價請求</Button>}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
