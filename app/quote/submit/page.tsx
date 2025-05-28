"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RegisterForm } from "@/components/auth/register-form"

export default function QuoteSubmitPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const phone = searchParams.get("phone") || ""
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // 模擬檢查登入狀態
  useEffect(() => {
    // 這裡應該是檢查實際的登入狀態
    const checkLoginStatus = () => {
      // 假設我們有一個方法來檢查用戶是否已登入
      const loggedIn = localStorage.getItem("isLoggedIn") === "true"
      setIsLoggedIn(loggedIn)
    }

    checkLoginStatus()
  }, [])

  const handleSubmitQuote = () => {
    setIsSubmitting(true)

    // 模擬提交報價
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)

      // 模擬重定向到等待報價頁面
      setTimeout(() => {
        router.push("/dashboard/quotes/Q-20230501-001")
      }, 2000)
    }, 1500)
  }

  if (!isLoggedIn && !isSubmitted) {
    return (
      <div className="py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>請先登記或登入</CardTitle>
              <CardDescription>您需要登記成為會員才能獲取搬運報價</CardDescription>
            </CardHeader>
            <CardContent>
              <RegisterForm
                prefillPhone={phone}
                onSuccess={() => {
                  localStorage.setItem("isLoggedIn", "true")
                  setIsLoggedIn(true)
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>確認提交報價請求</CardTitle>
            <CardDescription>請確認您的搬運需求詳情</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">搬運詳情</h3>
                <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                  <p>搬出地址: 九龍灣宏開道8號其士商業中心608室</p>
                  <p>搬入地址: 沙田石門安群街3號京瑞廣場一期19樓C室</p>
                  <p>搬運日期: 2023-05-10</p>
                  <p>搬運時間: 14:00</p>
                  <p>升降機: 兩處均有</p>
                  <p>梯級: 無</p>
                  <p>停車距離: 10米內</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">搬運物品</h3>
                <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                  <p>1. 沙發 x 1 (200cm x 90cm x 85cm)</p>
                  <p>2. 雙人床 x 1 (190cm x 150cm x 40cm)</p>
                  <p>3. 衣櫃 x 2 (180cm x 60cm x 200cm)</p>
                  <p>4. 餐桌 x 1 (150cm x 80cm x 75cm)</p>
                  <p>5. 椅子 x 4 (45cm x 45cm x 90cm)</p>
                  <p>6. 封裝箱 x 10 (50cm x 40cm x 40cm)</p>
                </div>
              </div>

              {isSubmitted && (
                <div className="flex items-center justify-center gap-2 text-green-500 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <CheckCircle className="h-5 w-5" />
                  <div className="font-medium">報價請求已提交成功！</div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.back()} disabled={isSubmitting || isSubmitted}>
              返回修改
            </Button>
            <Button
              onClick={handleSubmitQuote}
              disabled={isSubmitting || isSubmitted}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "提交中..." : "確認提交"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
