"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Save, ArrowLeft, User, Phone, MessageCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"

export default function UserSettingsPage() {
  const router = useRouter()
  const { toast } = useToast()

  // 模擬用戶數據
  const [userData, setUserData] = useState({
    name: "陳大文",
    email: "chen@example.com",
    phone: "9876 5432",
    whatsapp: "9876 5432",
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // 模擬保存數據
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "設定已更新",
        description: "您的個人資料已成功更新",
      })
    }, 1500)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tighter">個人設定</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                基本資料
              </CardTitle>
              <CardDescription>管理您的個人基本信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">姓名</Label>
                <Input id="name" name="name" value={userData.name} onChange={handleInputChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">電郵地址</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                聯絡方式
              </CardTitle>
              <CardDescription>管理您的聯絡電話和WhatsApp號碼</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">手機號碼</Label>
                <Input id="phone" name="phone" value={userData.phone} onChange={handleInputChange} required />
                <p className="text-xs text-gray-500">用於接收重要通知和驗證</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp號碼
                </Label>
                <Input
                  id="whatsapp"
                  name="whatsapp"
                  value={userData.whatsapp}
                  onChange={handleInputChange}
                  placeholder="請輸入WhatsApp號碼"
                />
                <p className="text-xs text-gray-500">
                  用於接收搬運相關通知，包括報價更新、搬運提醒等。如果與手機號碼相同，可以填寫相同號碼。
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" className="bg-primary hover:bg-primary-600" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-1">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  儲存中...
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Save className="h-4 w-4" />
                  儲存變更
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
