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
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function EditUserPage({ params }: { params: { id: string } }) {
  const userId = params.id
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // 在實際應用中，這裡會從API獲取用戶數據
  const user = users.find((u) => u.id === userId)

  // 表單狀態
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    status: user?.status || "active",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // 模擬API請求
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)

    toast({
      title: "用戶資料已更新",
      description: "用戶資料已成功更新",
    })

    // 返回用戶詳情頁面
    router.push(`/admin/users/${userId}`)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/admin/users/${userId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">編輯用戶</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>基本資料</CardTitle>
            <CardDescription>編輯用戶的基本信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">姓名</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="輸入用戶姓名"
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
                <Label htmlFor="address">地址</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="輸入用戶地址"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">狀態</Label>
                <Select value={formData.status} onValueChange={handleStatusChange}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="選擇狀態" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">活躍</SelectItem>
                    <SelectItem value="inactive">非活躍</SelectItem>
                    <SelectItem value="suspended">已停用</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href={`/admin/users/${userId}`}>取消</Link>
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
const users = [
  {
    id: "U001",
    name: "陳大文",
    email: "chan@example.com",
    phone: "9123 4567",
    address: "香港島中環皇后大道中100號",
    registeredDate: "2023-01-15",
    orderCount: 3,
    status: "active",
  },
  {
    id: "U002",
    name: "李小明",
    email: "lee@example.com",
    phone: "9234 5678",
    registeredDate: "2023-02-20",
    orderCount: 2,
    status: "active",
  },
]
