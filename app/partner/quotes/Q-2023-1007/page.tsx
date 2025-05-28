"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Clock,
  MapPin,
  Package,
  Calendar,
  Phone,
  Mail,
  User,
  StepBackIcon as Stairs,
  Car,
  FileText,
  Camera,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

export default function QuoteDetailsPage({ params }: { params: { id: string } }) {
  const quoteId = params.id
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock quote data - exactly as user entered
  const quoteData = {
    id: quoteId,
    status: "pending",
    submitTime: "2023-10-07 14:30",
    deadline: "2023-10-07 18:00",

    // Customer Information - exactly as entered
    customerInfo: {
      name: "陳小明",
      phone: "98765432",
      whatsapp: "98765432",
      email: "chen@example.com",
    },

    // Moving Details - exactly as user selected/entered
    movingDetails: {
      date: "2023-10-15",
      time: "上午 (09:00-12:00)",

      fromAddress: {
        address: "九龍灣宏開道8號其士商業中心608室",
        buildingType: "有升降機但不能直達",
        elevatorWidth: "3.5",
        entranceWidth: "4.2",
        hasStairs: "有",
        stairsCount: "15",
        parkingDistance: "50米內",
        notes: "需要預約升降機使用時間",
      },

      toAddress: {
        address: "沙田石門安群街3號京瑞廣場一期19樓C室",
        buildingType: "有升降機可直達",
        elevatorWidth: "",
        entranceWidth: "",
        hasStairs: "無",
        stairsCount: "",
        parkingDistance: "10米內",
        notes: "大廈有貨運升降機",
      },
    },

    // Items - exactly as user entered
    items: [
      { name: "三座位梳化", quantity: "1", dimensions: "220cm x 95cm x 85cm", notes: "真皮材質，需小心搬運" },
      { name: "雙人床連床褥", quantity: "1", dimensions: "200cm x 150cm x 40cm", notes: "可拆卸床架" },
      { name: "六門衣櫃", quantity: "1", dimensions: "240cm x 60cm x 220cm", notes: "實木製，較重" },
      { name: "餐桌", quantity: "1", dimensions: "160cm x 90cm x 75cm", notes: "玻璃檯面" },
      { name: "餐椅", quantity: "6", dimensions: "45cm x 50cm x 95cm", notes: "可疊起" },
      { name: "雪櫃", quantity: "1", dimensions: "70cm x 65cm x 180cm", notes: "雙門式" },
      { name: "洗衣機", quantity: "1", dimensions: "60cm x 60cm x 85cm", notes: "前置式" },
      { name: "電視", quantity: "1", dimensions: "65吋", notes: "連電視櫃" },
      { name: "書櫃", quantity: "2", dimensions: "80cm x 30cm x 200cm", notes: "有很多書籍" },
      { name: "封裝箱", quantity: "25", dimensions: "50cm x 40cm x 40cm", notes: "雜物用品" },
    ],

    // Services - exactly as user selected
    selectedServices: ["封裝箱開箱服務", "家具拆裝服務", "包裝材料提供"],

    // Special Requirements - exactly as user entered
    specialRequirements:
      "請小心處理玻璃檯面餐桌，雪櫃需要先清空並固定。搬運時間希望能在上午完成，因為下午有其他安排。如果可能，希望能提供額外的保護材料包裝貴重物品。",

    // Photos uploaded by user
    photos: ["/completed-moving-photo-1.png", "/completed-moving-photo-2.png", "/assorted-household-items.png"],
  }

  const handleSubmitQuote = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "報價已提交",
        description: "您的報價已成功提交給客戶",
      })
      router.push("/partner/dashboard")
    }, 1500)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            待處理
          </Badge>
        )
      case "quoted":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            已報價
          </Badge>
        )
      case "expired":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            已過期
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/partner/dashboard"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">報價詳情</h1>
                <p className="text-gray-600 dark:text-gray-400">報價編號: {quoteData.id}</p>
              </div>
            </div>
            {getStatusBadge(quoteData.status)}
          </div>

          {/* Deadline Alert */}
          <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
            <CardContent className="flex items-center gap-3 p-4">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800 dark:text-yellow-200">報價截止時間</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">{quoteData.deadline}</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    客戶資訊
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">姓名</p>
                        <p className="font-medium">{quoteData.customerInfo.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">電話</p>
                        <p className="font-medium">{quoteData.customerInfo.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="text-sm text-gray-500">WhatsApp</p>
                        <p className="font-medium">{quoteData.customerInfo.whatsapp}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">電郵</p>
                        <p className="font-medium">{quoteData.customerInfo.email}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Moving Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    搬運時間
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{quoteData.movingDetails.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{quoteData.movingDetails.time}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Address Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* From Address */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MapPin className="h-5 w-5 text-red-500" />
                      搬出地址
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">地址</p>
                      <p className="font-medium">{quoteData.movingDetails.fromAddress.address}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">建築物類型</p>
                        <p className="font-medium">{quoteData.movingDetails.fromAddress.buildingType}</p>
                      </div>
                      {quoteData.movingDetails.fromAddress.elevatorWidth && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">升降機寬度</p>
                          <p className="font-medium">{quoteData.movingDetails.fromAddress.elevatorWidth}呎</p>
                        </div>
                      )}
                    </div>

                    {quoteData.movingDetails.fromAddress.entranceWidth && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">入口寬度</p>
                        <p className="font-medium">{quoteData.movingDetails.fromAddress.entranceWidth}呎</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Stairs className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">梯級</p>
                          <p className="font-medium">
                            {quoteData.movingDetails.fromAddress.hasStairs}
                            {quoteData.movingDetails.fromAddress.stairsCount &&
                              ` (${quoteData.movingDetails.fromAddress.stairsCount}級)`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">停車距離</p>
                          <p className="font-medium">{quoteData.movingDetails.fromAddress.parkingDistance}</p>
                        </div>
                      </div>
                    </div>

                    {quoteData.movingDetails.fromAddress.notes && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">備註</p>
                        <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                          {quoteData.movingDetails.fromAddress.notes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* To Address */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MapPin className="h-5 w-5 text-green-500" />
                      搬入地址
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">地址</p>
                      <p className="font-medium">{quoteData.movingDetails.toAddress.address}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">建築物類型</p>
                        <p className="font-medium">{quoteData.movingDetails.toAddress.buildingType}</p>
                      </div>
                      {quoteData.movingDetails.toAddress.elevatorWidth && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">升降機寬度</p>
                          <p className="font-medium">{quoteData.movingDetails.toAddress.elevatorWidth}呎</p>
                        </div>
                      )}
                    </div>

                    {quoteData.movingDetails.toAddress.entranceWidth && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">入口寬度</p>
                        <p className="font-medium">{quoteData.movingDetails.toAddress.entranceWidth}呎</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Stairs className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">梯級</p>
                          <p className="font-medium">
                            {quoteData.movingDetails.toAddress.hasStairs}
                            {quoteData.movingDetails.toAddress.stairsCount &&
                              ` (${quoteData.movingDetails.toAddress.stairsCount}級)`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">停車距離</p>
                          <p className="font-medium">{quoteData.movingDetails.toAddress.parkingDistance}</p>
                        </div>
                      </div>
                    </div>

                    {quoteData.movingDetails.toAddress.notes && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">備註</p>
                        <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                          {quoteData.movingDetails.toAddress.notes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Items List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    搬運物品清單
                  </CardTitle>
                  <CardDescription>共 {quoteData.items.length} 項物品</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {quoteData.items.map((item, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">{index + 1}</span>
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-4">
                            <h4 className="font-medium">{item.name}</h4>
                            <Badge variant="outline">數量: {item.quantity}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">尺寸: {item.dimensions}</p>
                          {item.notes && <p className="text-sm text-gray-500 italic">備註: {item.notes}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Selected Services */}
              {quoteData.selectedServices.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      所需服務
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {quoteData.selectedServices.map((service, index) => (
                        <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Special Requirements */}
              {quoteData.specialRequirements && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      特殊要求
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      {quoteData.specialRequirements}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Photos */}
              {quoteData.photos.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="h-5 w-5 text-primary" />
                      物品照片
                    </CardTitle>
                    <CardDescription>客戶提供的物品照片</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {quoteData.photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={photo || "/placeholder.svg"}
                            alt={`物品照片 ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700 group-hover:shadow-md transition-shadow"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quote Submission */}
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="text-lg">提交報價</CardTitle>
                  <CardDescription>為此搬運請求提供報價</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">提交時間</p>
                    <p className="font-medium">{quoteData.submitTime}</p>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Button
                      onClick={handleSubmitQuote}
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary-600"
                      size="lg"
                    >
                      {isSubmitting ? "提交中..." : "立即報價"}
                    </Button>

                    <Button variant="outline" className="w-full" onClick={() => router.back()}>
                      返回列表
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">快速資訊</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">物品總數</span>
                    <span className="font-medium">
                      {quoteData.items.reduce((sum, item) => sum + Number.parseInt(item.quantity), 0)} 件
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">服務項目</span>
                    <span className="font-medium">{quoteData.selectedServices.length} 項</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">照片數量</span>
                    <span className="font-medium">{quoteData.photos.length} 張</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
