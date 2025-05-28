"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Clock, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function QuoteSubmitPage({ params }: { params: { id: string } }) {
  const quoteId = params.id
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 報價表單狀態
  const [basicFee, setBasicFee] = useState(2800)
  const [additionalServices, setAdditionalServices] = useState([
    { id: 1, name: "家具拆裝服務", fee: 500, selected: false },
    { id: 2, name: "包裝材料", fee: 300, selected: false },
    { id: 3, name: "特殊物品處理", fee: 400, selected: false },
    { id: 4, name: "清潔服務", fee: 600, selected: false },
  ])
  const [availableTimes, setAvailableTimes] = useState([
    { id: 1, date: "2023-05-10", time: "上午 (09:00-12:00)", selected: true },
    { id: 2, date: "2023-05-10", time: "下午 (13:00-17:00)", selected: true },
    { id: 3, date: "2023-05-11", time: "上午 (09:00-12:00)", selected: false },
    { id: 4, date: "2023-05-11", time: "下午 (13:00-17:00)", selected: false },
  ])
  const [remarks, setRemarks] = useState("")
  const [discount, setDiscount] = useState(0)

  // 計算總金額
  const calculateTotal = () => {
    const additionalFees = additionalServices
      .filter((service) => service.selected)
      .reduce((sum, service) => sum + service.fee, 0)
    return basicFee + additionalFees - discount
  }

  // 切換附加服務選擇狀態
  const toggleService = (id: number) => {
    setAdditionalServices(
      additionalServices.map((service) => (service.id === id ? { ...service, selected: !service.selected } : service)),
    )
  }

  // 切換可用時間選擇狀態
  const toggleTime = (id: number) => {
    setAvailableTimes(availableTimes.map((time) => (time.id === id ? { ...time, selected: !time.selected } : time)))
  }

  // 提交報價
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 檢查是否至少選擇了一個可用時間
    if (!availableTimes.some((time) => time.selected)) {
      toast({
        title: "請選擇至少一個可用時間",
        description: "您需要提供至少一個可搬運的時間段",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // 準備提交資料
      const selectedServices = additionalServices
        .filter(service => service.selected)
        .reduce((acc, service) => {
          acc[service.name] = service.fee
          return acc
        }, {} as Record<string, number>)

      const selectedTimes = availableTimes
        .filter(time => time.selected)
        .map(time => ({
          date: time.date,
          time: time.time
        }))

      const submitData = {
        quoteRequestId: quoteId,
        basicFee: basicFee,
        additionalServices: selectedServices,
        discount: discount,
        totalAmount: calculateTotal(),
        availableTimes: selectedTimes,
        remarks: remarks
      }

      // 提交到 API
      const response = await fetch('/api/partner/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '提交失敗')
      }

      toast({
        title: "報價已提交",
        description: "您的報價已成功提交，客戶將收到通知",
      })
      
      router.push("/partner/dashboard")
    } catch (error) {
      toast({
        title: "提交失敗",
        description: error instanceof Error ? error.message : "請稍後再試",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 模擬報價數據 - 在實際應用中，這些數據應該從API獲取
  const quoteData = {
    id: quoteId,
    title: "從九龍灣到沙田的搬運",
    submitTime: "2023-05-01 14:30",
    deadline: "2023-05-01 15:30",
    remainingTime: "00:45:30",
    fromAddress: "九龍灣宏開道8號其士商業中心608室",
    toAddress: "沙田石門安群街3號京瑞廣場一期19樓C室",
    items: [
      { name: "沙發", quantity: 1, dimensions: "200cm x 90cm x 85cm" },
      { name: "雙人床", quantity: 1, dimensions: "190cm x 150cm x 40cm" },
      { name: "衣櫃", quantity: 2, dimensions: "180cm x 60cm x 200cm" },
      { name: "餐桌", quantity: 1, dimensions: "150cm x 80cm x 75cm" },
      { name: "椅子", quantity: 4, dimensions: "45cm x 45cm x 90cm" },
      { name: "封裝箱", quantity: 10, dimensions: "50cm x 40cm x 40cm" },
    ],
    hasElevator: true,
    hasStairs: false,
    stairsCount: 0,
    parkingDistance: "10米內",
    specialRequirements: "沙發和床需要拆裝",
    photos: ["/images/sofa.jpg", "/images/bed.jpg", "/images/wardrobe.jpg"],
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-2">
          <Link
            href="/partner/dashboard"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tighter">提交報價</h1>
        </div>

        <div className="flex items-center gap-2 text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <Clock className="h-5 w-5" />
          <div className="font-medium">
            剩餘時間: <span className="countdown">{quoteData.remainingTime}</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{quoteData.title}</CardTitle>
            <CardDescription>報價編號: {quoteData.id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">搬運詳情</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-gray-500 dark:text-gray-400">搬出地址:</span> {quoteData.fromAddress}
                  </p>
                  <p>
                    <span className="text-gray-500 dark:text-gray-400">搬入地址:</span> {quoteData.toAddress}
                  </p>
                  <p>
                    <span className="text-gray-500 dark:text-gray-400">電梯:</span>{" "}
                    {quoteData.hasElevator ? "兩處均有" : "無"}
                  </p>
                  <p>
                    <span className="text-gray-500 dark:text-gray-400">梯級:</span>{" "}
                    {quoteData.hasStairs ? `有 (${quoteData.stairsCount} 級)` : "無"}
                  </p>
                  <p>
                    <span className="text-gray-500 dark:text-gray-400">停車距離:</span> {quoteData.parkingDistance}
                  </p>
                  <p>
                    <span className="text-gray-500 dark:text-gray-400">特殊要求:</span> {quoteData.specialRequirements}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">搬運物品</h3>
                <div className="space-y-1 text-sm">
                  {quoteData.items.map((item, index) => (
                    <p key={index}>
                      {item.name} x {item.quantity} ({item.dimensions})
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {quoteData.photos.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">物品照片</h3>
                <div className="flex flex-wrap gap-2">
                  {quoteData.photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={photo || "/placeholder.svg"}
                        alt={`物品照片 ${index + 1}`}
                        className="h-24 w-24 object-cover rounded-md"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">報價詳情</h3>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="basic-fee" className="text-lg">
                      基本搬運費用
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-gray-500 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">基本搬運費用包括人工、車輛和基本搬運服務</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2 text-lg font-medium">HK$</span>
                    <Input
                      id="basic-fee"
                      type="number"
                      min="0"
                      step="100"
                      value={basicFee}
                      onChange={(e) => setBasicFee(Number(e.target.value))}
                      required
                      className="text-lg font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-lg">額外服務</Label>
                  <div className="space-y-2">
                    {additionalServices.map((service) => (
                      <div key={service.id} className="flex justify-between items-center p-3 border rounded-md">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`service-${service.id}`}
                            checked={service.selected}
                            onCheckedChange={() => toggleService(service.id)}
                          />
                          <Label htmlFor={`service-${service.id}`} className="cursor-pointer">
                            {service.name}
                          </Label>
                        </div>
                        <div className="font-medium text-primary">HK${service.fee}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="discount" className="text-lg">
                      優惠折扣
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-gray-500 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">可選擇提供折扣以提高競爭力</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2 text-lg font-medium">HK$</span>
                    <Input
                      id="discount"
                      type="number"
                      min="0"
                      step="50"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      className="text-lg"
                    />
                  </div>
                </div>

                <div className="flex justify-between font-bold text-xl pt-4 border-t">
                  <span>總金額</span>
                  <span className="text-primary">HK${calculateTotal()}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">可搬運時段</h3>
                <p className="text-sm text-gray-500">請選擇您可以提供搬運服務的時段（可多選）</p>

                <div className="space-y-2">
                  {availableTimes.map((timeSlot) => (
                    <div key={timeSlot.id} className="flex justify-between items-center p-3 border rounded-md">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`time-${timeSlot.id}`}
                          checked={timeSlot.selected}
                          onCheckedChange={() => toggleTime(timeSlot.id)}
                        />
                        <Label htmlFor={`time-${timeSlot.id}`} className="cursor-pointer">
                          {timeSlot.date} {timeSlot.time}
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="remarks">備註</Label>
                <Textarea
                  id="remarks"
                  placeholder="請輸入任何額外資訊或說明"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  返回
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary-600" disabled={isSubmitting}>
                  {isSubmitting ? "提交中..." : "提交報價"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
