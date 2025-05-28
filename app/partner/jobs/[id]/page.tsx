"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Phone, MessageCircle, MapPin, Calendar, Clock, Package, Camera } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PhotoLightbox } from "@/components/photo-lightbox"

export default function PartnerJobDetailsPage({ params }: { params: { id: string } }) {
  const jobId = params.id
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // 模擬訂單數據
  const jobData = {
    id: jobId,
    customer: {
      name: "陳大文",
      phone: "9876 5432",
      whatsapp: "9876 5432",
      email: "chen@example.com",
    },
    from: {
      address: "太古城中心商場",
      buildingType: "商業大廈",
      hasElevator: true,
      floor: "15樓",
    },
    to: {
      address: "將軍澳新都城中心",
      buildingType: "住宅大廈",
      hasElevator: true,
      floor: "8樓",
    },
    date: "2023-05-15",
    time: "10:00",
    status: "confirmed",
    amount: 3400,
    items: [
      { type: "沙發", quantity: 1, dimensions: "200x90x80cm" },
      { type: "雙人床", quantity: 1, dimensions: "150x200x30cm" },
      { type: "衣櫃", quantity: 2, dimensions: "120x60x200cm" },
      { type: "餐桌", quantity: 1, dimensions: "120x80x75cm" },
      { type: "椅子", quantity: 4, dimensions: "45x45x85cm" },
    ],
    photos: [
      "/placeholder.svg?height=400&width=600&text=沙發照片",
      "/placeholder.svg?height=400&width=600&text=床照片",
      "/placeholder.svg?height=400&width=600&text=衣櫃照片",
      "/placeholder.svg?height=400&width=600&text=餐桌照片",
    ],
    specialRequirements: "需要拆裝衣櫃，請小心處理易碎物品",
    createdAt: "2023-05-10T14:30:00Z",
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            待確認
          </Badge>
        )
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            已確認
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            已完成
          </Badge>
        )
      default:
        return <Badge variant="outline">未知</Badge>
    }
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
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
          <h1 className="text-2xl font-bold tracking-tighter">訂單詳情</h1>
          {getStatusBadge(jobData.status)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要信息 */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>客戶信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">客戶姓名</p>
                    <p className="font-medium">{jobData.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">電郵</p>
                    <p className="font-medium">{jobData.customer.email}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{jobData.customer.phone}</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 text-green-600 border-green-600 hover:bg-green-50"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>WhatsApp: {jobData.customer.whatsapp}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>搬運詳情</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span>搬出地址</span>
                    </div>
                    <p className="font-medium">{jobData.from.address}</p>
                    <p className="text-sm text-gray-500">
                      {jobData.from.buildingType} • {jobData.from.floor} •{" "}
                      {jobData.from.hasElevator ? "有電梯" : "無電梯"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span>搬入地址</span>
                    </div>
                    <p className="font-medium">{jobData.to.address}</p>
                    <p className="text-sm text-gray-500">
                      {jobData.to.buildingType} • {jobData.to.floor} • {jobData.to.hasElevator ? "有電梯" : "無電梯"}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">搬運日期:</span>
                    <span className="font-medium">{jobData.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">搬運時間:</span>
                    <span className="font-medium">{jobData.time}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  搬運物品
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {jobData.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{item.type}</p>
                        <p className="text-sm text-gray-500">尺寸: {item.dimensions}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">數量: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 物品照片 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  物品照片
                </CardTitle>
                <CardDescription>客戶提供的物品照片</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {jobData.photos.map((photo, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => openLightbox(index)}
                    >
                      <img
                        src={photo || "/placeholder.svg"}
                        alt={`物品照片 ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                        <Camera className="h-6 w-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {jobData.specialRequirements && (
              <Card>
                <CardHeader>
                  <CardTitle>特殊要求</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{jobData.specialRequirements}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 側邊欄 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>訂單摘要</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">訂單編號:</span>
                  <span className="font-medium">{jobData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">報價金額:</span>
                  <span className="font-medium text-lg">HK${jobData.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">提交時間:</span>
                  <span className="font-medium">{new Date(jobData.createdAt).toLocaleDateString()}</span>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Button className="w-full" variant="default">
                    確認訂單
                  </Button>
                  <Button className="w-full" variant="outline">
                    聯絡客戶
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 照片燈箱 */}
        <PhotoLightbox
          photos={jobData.photos}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          initialIndex={lightboxIndex}
        />
      </div>
    </div>
  )
}
