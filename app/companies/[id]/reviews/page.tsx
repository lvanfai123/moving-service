"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Star, Filter } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ReviewDisplay } from "@/components/review-display"
import { getCompanyReviews } from "@/app/actions/review-actions"
import type { Review, CompanyRating } from "@/types/review"

export default function CompanyReviewsPage({ params }: { params: { id: string } }) {
  const companyId = params.id
  const [reviews, setReviews] = useState<Review[]>([])
  const [rating, setRating] = useState<CompanyRating | null>(null)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("recent")
  const [filterRating, setFilterRating] = useState("all")

  // 模擬公司數據
  const companyData = {
    id: companyId,
    name: "安心搬運",
  }

  useEffect(() => {
    async function loadReviews() {
      const result = await getCompanyReviews(companyId)
      if (result.success) {
        setReviews(result.reviews || [])
        setRating(result.rating)
      }
      setLoading(false)
    }

    loadReviews()
  }, [companyId])

  // 根據篩選條件過濾評價
  const filteredReviews = reviews.filter((review) => {
    if (filterRating === "all") return true
    return review.rating === Number.parseInt(filterRating)
  })

  // 根據排序條件排序評價
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else if (sortBy === "highest") {
      return b.rating - a.rating
    } else if (sortBy === "lowest") {
      return a.rating - b.rating
    }
    return 0
  })

  // 計算評分百分比
  const calculatePercentage = (count: number) => {
    if (!rating || rating.totalReviews === 0) return 0
    return Math.round((count / rating.totalReviews) * 100)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <p>載入中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-2">
          <Link
            href={`/companies/${companyId}`}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tighter">客戶評價</h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <CardTitle className="text-xl">{companyData.name}</CardTitle>
                <CardDescription>客戶真實評價和意見</CardDescription>
              </div>
              {rating && (
                <div className="flex items-center gap-2">
                  <div className="text-3xl font-bold">{rating.averageRating.toFixed(1)}</div>
                  <div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= Math.round(rating.averageRating)
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">共 {rating.totalReviews} 個評價</p>
                  </div>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 評分分佈 */}
              {rating && (
                <div className="space-y-2">
                  <h3 className="font-medium">評分分佈</h3>
                  <div className="space-y-1">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center gap-2">
                        <div className="flex items-center min-w-[60px]">
                          <span>{star}</span>
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 ml-1" />
                        </div>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-500 rounded-full"
                            style={{
                              width: `${calculatePercentage(rating.ratingDistribution[star as keyof typeof rating.ratingDistribution])}%`,
                            }}
                          ></div>
                        </div>
                        <div className="text-sm text-gray-500 min-w-[40px]">
                          {rating.ratingDistribution[star as keyof typeof rating.ratingDistribution]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 篩選和排序 */}
              <div className="space-y-2">
                <h3 className="font-medium">篩選和排序</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Select value={filterRating} onValueChange={setFilterRating}>
                    <SelectTrigger>
                      <div className="flex items-center gap-1">
                        <Filter className="h-4 w-4" />
                        <span>篩選評分</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">所有評分</SelectItem>
                      <SelectItem value="5">5 星</SelectItem>
                      <SelectItem value="4">4 星</SelectItem>
                      <SelectItem value="3">3 星</SelectItem>
                      <SelectItem value="2">2 星</SelectItem>
                      <SelectItem value="1">1 星</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="排序方式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">最新評價</SelectItem>
                      <SelectItem value="highest">最高評分</SelectItem>
                      <SelectItem value="lowest">最低評分</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* 評價列表 */}
            <div className="space-y-4">
              <h3 className="font-medium">客戶評價</h3>

              {sortedReviews.length > 0 ? (
                <div className="space-y-4">
                  {sortedReviews.map((review) => (
                    <ReviewDisplay key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">沒有符合條件的評價</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
