"use client"

import type React from "react"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { submitReview } from "@/app/actions/review-actions"

interface ReviewFormProps {
  orderId: string
  userId: string
  companyId: string
  companyName: string
  onSuccess?: () => void
}

export function ReviewForm({ orderId, userId, companyId, companyName, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast({
        title: "請選擇評分",
        description: "請為搬運服務提供1-5星評分",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("orderId", orderId)
    formData.append("userId", userId)
    formData.append("companyId", companyId)
    formData.append("rating", rating.toString())
    formData.append("comment", comment)
    formData.append("isAnonymous", isAnonymous.toString())

    try {
      const result = await submitReview(formData)

      if (result.success) {
        toast({
          title: "評價已提交",
          description: "感謝您的寶貴意見！",
        })
        onSuccess?.()
      } else {
        toast({
          title: "提交失敗",
          description: result.error || "提交評價失敗，請稍後再試",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "提交失敗",
        description: "網絡錯誤，請稍後再試",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1:
        return "很差"
      case 2:
        return "較差"
      case 3:
        return "一般"
      case 4:
        return "良好"
      case 5:
        return "非常好"
      default:
        return ""
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">評價搬運服務</CardTitle>
        <CardDescription>為 {companyName} 的服務評分</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 星級評分 */}
          <div className="space-y-3">
            <h3 className="font-medium text-center">服務評分 *</h3>
            <div className="flex justify-center py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none p-1"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300 hover:text-yellow-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {(hoveredRating || rating) > 0 && (
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                {getRatingText(hoveredRating || rating)}
              </p>
            )}
          </div>

          {/* 文字評價 */}
          <div className="space-y-2">
            <h3 className="font-medium">詳細評價 (可選)</h3>
            <Textarea
              placeholder="請分享您對搬運服務的具體評價..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">您的評價將幫助其他用戶選擇合適的搬運公司</p>
          </div>

          {/* 匿名選項 */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
            />
            <label
              htmlFor="anonymous"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              匿名評價（推薦）
            </label>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting || rating === 0}>
            {isSubmitting ? "提交中..." : "提交評價"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
