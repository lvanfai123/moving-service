import type { Review, CompanyRating, ReviewStats } from "@/types/review"

// 模擬評價數據
const reviewsData: Review[] = [
  {
    id: "R001",
    orderId: "J-20230510-001",
    userId: "U001",
    companyId: "P001",
    rating: 5,
    comment: "服務非常好，搬運人員專業有禮，準時到達，小心處理物品，非常滿意！",
    isAnonymous: true,
    createdAt: "2023-05-11T10:00:00Z",
    updatedAt: "2023-05-11T10:00:00Z",
    status: "published",
  },
  {
    id: "R002",
    orderId: "J-20230512-002",
    userId: "U002",
    companyId: "P001",
    rating: 4,
    comment: "整體服務不錯，只是比預定時間晚了一點到達，但搬運過程很專業。",
    isAnonymous: true,
    createdAt: "2023-05-13T14:30:00Z",
    updatedAt: "2023-05-13T14:30:00Z",
    status: "published",
  },
  {
    id: "R003",
    orderId: "J-20230515-003",
    userId: "U003",
    companyId: "P002",
    rating: 5,
    comment: "搬運過程非常順利，工人很有經驗，處理大型家具很專業，會再次使用！",
    isAnonymous: false,
    createdAt: "2023-05-16T09:15:00Z",
    updatedAt: "2023-05-16T09:15:00Z",
    status: "published",
  },
]

// 模擬公司評分統計
const companyRatingsData: CompanyRating[] = [
  {
    companyId: "P001",
    averageRating: 4.8,
    totalReviews: 156,
    ratingDistribution: {
      5: 120,
      4: 25,
      3: 8,
      2: 2,
      1: 1,
    },
    lastUpdated: "2023-05-16T10:00:00Z",
  },
  {
    companyId: "P002",
    averageRating: 4.6,
    totalReviews: 89,
    ratingDistribution: {
      5: 65,
      4: 18,
      3: 4,
      2: 1,
      1: 1,
    },
    lastUpdated: "2023-05-16T10:00:00Z",
  },
]

export async function createReview(
  reviewData: Omit<Review, "id" | "createdAt" | "updatedAt" | "status">,
): Promise<Review> {
  const newReview: Review = {
    ...reviewData,
    id: `R${String(reviewsData.length + 1).padStart(3, "0")}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "published", // 簡化流程，直接發布
  }

  reviewsData.push(newReview)

  // 更新公司評分統計
  await updateCompanyRating(reviewData.companyId)

  return newReview
}

export async function getReviewsByCompany(companyId: string, limit?: number): Promise<Review[]> {
  const companyReviews = reviewsData
    .filter((review) => review.companyId === companyId && review.status === "published")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return limit ? companyReviews.slice(0, limit) : companyReviews
}

export async function getCompanyRating(companyId: string): Promise<CompanyRating | null> {
  return companyRatingsData.find((rating) => rating.companyId === companyId) || null
}

export async function canUserReview(userId: string, orderId: string): Promise<boolean> {
  // 檢查用戶是否已經對此訂單評價過
  const existingReview = reviewsData.find((review) => review.userId === userId && review.orderId === orderId)
  return !existingReview
}

export async function getReviewByOrder(orderId: string): Promise<Review | null> {
  return reviewsData.find((review) => review.orderId === orderId) || null
}

async function updateCompanyRating(companyId: string): Promise<void> {
  const companyReviews = await getReviewsByCompany(companyId)

  if (companyReviews.length === 0) return

  const totalRating = companyReviews.reduce((sum, review) => sum + review.rating, 0)
  const averageRating = totalRating / companyReviews.length

  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  companyReviews.forEach((review) => {
    ratingDistribution[review.rating as keyof typeof ratingDistribution]++
  })

  const existingRatingIndex = companyRatingsData.findIndex((rating) => rating.companyId === companyId)

  const updatedRating: CompanyRating = {
    companyId,
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews: companyReviews.length,
    ratingDistribution,
    lastUpdated: new Date().toISOString(),
  }

  if (existingRatingIndex >= 0) {
    companyRatingsData[existingRatingIndex] = updatedRating
  } else {
    companyRatingsData.push(updatedRating)
  }
}

export async function getReviewStats(companyId: string): Promise<ReviewStats> {
  const companyRating = await getCompanyRating(companyId)

  if (!companyRating) {
    return {
      totalReviews: 0,
      averageRating: 0,
      ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    }
  }

  return {
    totalReviews: companyRating.totalReviews,
    averageRating: companyRating.averageRating,
    ratingBreakdown: companyRating.ratingDistribution,
  }
}
