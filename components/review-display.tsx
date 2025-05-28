"use client"

import { Star, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Review } from "@/types/review"

interface ReviewDisplayProps {
  review: Review
  userName?: string
}

export function ReviewDisplay({ review, userName }: ReviewDisplayProps) {
  const displayName = review.isAnonymous ? "匿名用戶" : userName || "用戶"
  const avatarText = review.isAnonymous ? "匿" : userName?.charAt(0) || "用"

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-HK", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    })
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {review.isAnonymous ? <User className="h-4 w-4" /> : avatarText}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{displayName}</p>
              <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
            </div>
          </div>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${star <= review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
              />
            ))}
          </div>
        </div>

        {review.comment && <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{review.comment}</p>}
      </CardContent>
    </Card>
  )
}
