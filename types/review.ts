export interface Review {
  id: string
  orderId: string
  userId: string
  companyId: string
  rating: number // 1-5星評分
  comment?: string // 可選文字評價
  isAnonymous: boolean // 是否匿名
  createdAt: string
  updatedAt: string
  status: "pending" | "published" | "hidden"
}

export interface CompanyRating {
  companyId: string
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
  lastUpdated: string
}

export interface ReviewStats {
  totalReviews: number
  averageRating: number
  ratingBreakdown: Record<number, number>
}
