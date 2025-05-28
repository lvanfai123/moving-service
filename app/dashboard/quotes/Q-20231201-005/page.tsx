"use client"

import { ArrowLeft, MapPin, Calendar, Clock, Users, Truck, Star } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function QuoteDetailsPage() {
  const quoteDetails = {
    id: "Q-20231201-005",
    status: "已收到報價",
    customerName: "張小明",
    phone: "9123 4567",
    pickupAddress: "觀塘開源道79號鱷魚恤中心15樓",
    deliveryAddress: "荃灣大河道99號99廣場8樓",
    movingDate: "2023-12-15",
    movingTime: "上午 9:00",
    items: ["3房2廳家具", "雪櫃、洗衣機", "電視、音響設備", "書桌、衣櫃", "約50個紙箱"],
    specialRequirements: "需要拆裝傢俱，有易碎物品需特別小心處理",
  }

  const quotes = [
    {
      id: "1",
      companyName: "搬運公司 B",
      rating: 4.8,
      reviewCount: 156,
      price: 2200,
      workers: 3,
      vehicle: "5.5噸貨車",
      estimatedTime: "4-5小時",
      features: ["免費拆裝", "包裝材料", "保險覆蓋"],
      isRecommended: true,
    },
    {
      id: "2",
      companyName: "搬運公司 C",
      rating: 4.6,
      reviewCount: 89,
      price: 2650,
      workers: 4,
      vehicle: "5.5噸貨車",
      estimatedTime: "3-4小時",
      features: ["專業包裝", "即日完成", "清潔服務"],
      isRecommended: false,
    },
    {
      id: "3",
      companyName: "搬運公司 A",
      rating: 4.5,
      reviewCount: 234,
      price: 2800,
      workers: 3,
      vehicle: "7噸貨車",
      estimatedTime: "4-5小時",
      features: ["大型車輛", "經驗豐富", "24小時服務"],
      isRecommended: false,
    },
    {
      id: "4",
      companyName: "搬運公司 D",
      rating: 4.3,
      reviewCount: 67,
      price: 3100,
      workers: 4,
      vehicle: "5.5噸貨車",
      estimatedTime: "5-6小時",
      features: ["精細服務", "全程監督", "售後保障"],
      isRecommended: false,
    },
  ]

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">報價詳情</h1>
          <p className="text-gray-600">報價編號: {quoteDetails.id}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 左側 - 搬運詳情 */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                搬運詳情
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">客戶姓名</p>
                <p className="font-medium">{quoteDetails.customerName}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">聯絡電話</p>
                <p className="font-medium">{quoteDetails.phone}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">起點地址</p>
                <p className="font-medium">{quoteDetails.pickupAddress}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">終點地址</p>
                <p className="font-medium">{quoteDetails.deliveryAddress}</p>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-600">搬運日期</p>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {quoteDetails.movingDate}
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">時間</p>
                  <p className="font-medium flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {quoteDetails.movingTime}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">搬運物品</p>
                <div className="space-y-1">
                  {quoteDetails.items.map((item, index) => (
                    <div key={index} className="text-sm bg-gray-50 px-2 py-1 rounded">
                      • {item}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">特殊要求</p>
                <p className="text-sm bg-yellow-50 p-2 rounded border-l-4 border-yellow-400">
                  {quoteDetails.specialRequirements}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右側 - 報價列表 */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">收到的報價 ({quotes.length})</h2>
            <p className="text-gray-600">
              價格範圍: HK${Math.min(...quotes.map((q) => q.price)).toLocaleString()} - HK$
              {Math.max(...quotes.map((q) => q.price)).toLocaleString()}
            </p>
          </div>

          <div className="space-y-4">
            {quotes.map((quote) => (
              <Card key={quote.id} className={`${quote.isRecommended ? "border-green-500 bg-green-50" : ""}`}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold">{quote.companyName}</h3>
                        {quote.isRecommended && <Badge className="bg-green-500">推薦</Badge>}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{quote.rating}</span>
                        <span>({quote.reviewCount} 評價)</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">HK${quote.price.toLocaleString()}</div>
                      {quote.isRecommended && <div className="text-sm text-green-600 font-medium">最低價</div>}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{quote.workers} 人</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-gray-500" />
                      <span>{quote.vehicle}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{quote.estimatedTime}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">服務特色:</p>
                    <div className="flex flex-wrap gap-2">
                      {quote.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className={`w-full ${quote.isRecommended ? "bg-green-600 hover:bg-green-700" : ""}`}>
                      選擇此報價
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
