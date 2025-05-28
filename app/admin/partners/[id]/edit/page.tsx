"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const DAYS_OF_WEEK = [
  { id: "monday", label: "星期一" },
  { id: "tuesday", label: "星期二" },
  { id: "wednesday", label: "星期三" },
  { id: "thursday", label: "星期四" },
  { id: "friday", label: "星期五" },
  { id: "saturday", label: "星期六" },
  { id: "sunday", label: "星期日" },
]

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0")
  return { value: `${hour}:00`, label: `${hour}:00` }
})

export default function EditPartnerPage({ params }: { params: { id: string } }) {
  const partnerId = params.id
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // 在實際應用中，這裡會從API獲取合作伙伴數據
  const partner = partners.find((p) => p.id === partnerId)

  // 表單狀態
  const [formData, setFormData] = useState({
    name: partner?.name || "",
    contactPerson: partner?.contactPerson || "",
    phone: partner?.phone || "",
    email: partner?.email || "",
    address: partner?.address || "",
    businessReg: partner?.businessReg || "",
    description: partner?.description || "",
    status: partner?.status || "active",
  })

  // 營業時間狀態
  const [workingDays, setWorkingDays] = useState<string[]>(["monday", "tuesday", "wednesday", "thursday", "friday"])
  const [openTime, setOpenTime] = useState("09:00")
  const [closeTime, setCloseTime] = useState("18:00")
  const [is24Hours, setIs24Hours] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }))
  }

  const toggleDay = (day: string) => {
    setWorkingDays((current) => (current.includes(day) ? current.filter((d) => d !== day) : [...current, day]))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // 模擬API請求
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)

    toast({
      title: "合作伙伴資料已更新",
      description: "合作伙伴資料已成功更新",
    })

    // 返回合作伙伴詳情頁面
    router.push(`/admin/partners/${partnerId}`)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/admin/partners/${partnerId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">編輯合作伙伴</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>基本資料</CardTitle>
            <CardDescription>編輯合作伙伴的基本信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">公司名稱</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="輸入公司名稱"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPerson">聯絡人</Label>
                <Input
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  placeholder="輸入聯絡人姓名"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">電話</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="輸入聯絡電話"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">電郵</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="輸入電郵地址"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">地址</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="輸入公司地址"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessReg">商業登記號碼</Label>
                <Input
                  id="businessReg"
                  name="businessReg"
                  value={formData.businessReg}
                  onChange={handleChange}
                  placeholder="輸入商業登記號碼"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">狀態</Label>
                <Select value={formData.status} onValueChange={handleStatusChange}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="選擇狀態" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">已審核</SelectItem>
                    <SelectItem value="pending">待審核</SelectItem>
                    <SelectItem value="suspended">已停用</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>營業時間</Label>
              <div className="space-y-4 rounded-md border p-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="24hours"
                    checked={is24Hours}
                    onCheckedChange={(checked) => {
                      setIs24Hours(checked === true)
                    }}
                  />
                  <label
                    htmlFor="24hours"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    24小時營業
                  </label>
                </div>

                {!is24Hours && (
                  <>
                    <div className="flex flex-wrap gap-2">
                      {DAYS_OF_WEEK.map((day) => (
                        <div key={day.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={day.id}
                            checked={workingDays.includes(day.id)}
                            onCheckedChange={() => toggleDay(day.id)}
                          />
                          <label
                            htmlFor={day.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {day.label}
                          </label>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="space-y-1">
                        <Label htmlFor="open-time">開始時間</Label>
                        <Select value={openTime} onValueChange={setOpenTime} disabled={is24Hours}>
                          <SelectTrigger id="open-time" className="w-[120px]">
                            <SelectValue placeholder="選擇時間" />
                          </SelectTrigger>
                          <SelectContent>
                            {HOURS.map((hour) => (
                              <SelectItem key={hour.value} value={hour.value}>
                                {hour.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="close-time">結束時間</Label>
                        <Select value={closeTime} onValueChange={setCloseTime} disabled={is24Hours}>
                          <SelectTrigger id="close-time" className="w-[120px]">
                            <SelectValue placeholder="選擇時間" />
                          </SelectTrigger>
                          <SelectContent>
                            {HOURS.map((hour) => (
                              <SelectItem key={hour.value} value={hour.value}>
                                {hour.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">公司簡介</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="輸入公司簡介"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href={`/admin/partners/${partnerId}`}>取消</Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                儲存中...
              </>
            ) : (
              "儲存變更"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

// 模擬數據
const partners = [
  {
    id: "P001",
    name: "安心搬屋公司",
    contactPerson: "王經理",
    phone: "9876 5432",
    email: "info@anxin.com",
    address: "香港九龍旺角彌敦道123號",
    businessReg: "12345678",
    description: "專業搬屋服務，經驗豐富，價格合理。",
    joinDate: "2022-10-01",
    completedOrders: 42,
    rating: "4.8",
    status: "active",
    logo: "/images/partners/anxin-moving.png",
  },
  {
    id: "P002",
    name: "專業搬運有限公司",
    contactPerson: "李經理",
    phone: "9765 4321",
    joinDate: "2022-11-15",
    completedOrders: 38,
    rating: "4.7",
    status: "active",
    logo: "/images/partners/professional-moving-ltd.png",
  },
]
