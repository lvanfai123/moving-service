"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ReviewForm } from "@/components/review-form"
import { checkCanReview } from "@/app/actions/review-actions"

export default function ReviewPage({ params }: { params: { id: string } }) {
  const orderId = params.id
  const router = useRouter()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [canReview, setCanReview] = useState(false)
  const [hasReviewed, setHasReviewed] = useState(false)
  const [loading, setLoading] = useState(true)

  // 模擬用戶和訂單數據
  const userId = "U001" // 實際應用中從認證系統獲取
  const jobData = {
    id: orderId,
    companyId: "P001",
    companyName: "安心搬運",
    moveDate: "2023-05-10",
    fromAddress: "九龍灣宏開道8號其士商業中心608室",
    toAddress: "沙田石門安群街3號京瑞廣場一期19樓C室",
  }

  useEffect(() => {
    async function checkReviewStatus() {
      const result = await checkCanReview(userId, orderId)
      setCanReview(result.canReview)
      setHasReviewed(result.hasReviewed)
      setLoading(false)
    }

    checkReviewStatus()
  }, [userId, orderId])

  const handleReviewSuccess = () => {
    setIsSubmitted(true)
    // 3秒後返回首頁
    setTimeout(() => {
      router.push("/dashboard")
    }, 3000)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="max-w-md mx-auto text-center">
          <p>載入中...</p>
        </div>
      </div>
    )
  }

  if (hasReviewed) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>已完成評價</CardTitle>
              <CardDescription>您已經對此訂單進行過評價</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    )
  }

  if (!canReview) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>無法評價</CardTitle>
              <CardDescription>此訂單暫時無法進行評價</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="max-w-md mx-auto space-y-6">
        {!isSubmitted ? (
          <>
            {/* 訂單信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">搬運詳情</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p>搬運公司: {jobData.companyName}</p>
                <p>搬運日期: {jobData.moveDate}</p>
                <p>從: {jobData.fromAddress}</p>
                <p>到: {jobData.toAddress}</p>
              </CardContent>
            </Card>

            {/* 評價表單 */}
            <ReviewForm
              orderId={orderId}
              userId={userId}
              companyId={jobData.companyId}
              companyName={jobData.companyName}
              onSuccess={handleReviewSuccess}
            />
          </>
        ) : (
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </div>
              <CardTitle className="text-2xl">評價已提交</CardTitle>
              <CardDescription>感謝您的寶貴意見！</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">您的評價將幫助其他用戶選擇合適的搬運公司。</p>
              <p className="text-sm text-gray-500">正在返回用戶中心...</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
