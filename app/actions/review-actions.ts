"use server"

import { supabaseAdmin } from "@/lib/supabase"
import { getCurrentUser } from "@/lib/auth-service"
import { updatePartnerStatistics } from "@/lib/partner-service"
import { cookies } from "next/headers"

export async function submitReview(formData: FormData) {
  try {
    // Get current user
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value
    if (!token) {
      return {
        success: false,
        error: "請先登入"
      }
    }

    const user = await getCurrentUser(token)
    if (!user) {
      return {
        success: false,
        error: "用戶未找到"
      }
    }

    const orderId = formData.get("orderId") as string
    const rating = parseInt(formData.get("rating") as string)
    const comment = formData.get("comment") as string
    const isAnonymous = formData.get("isAnonymous") === "true"

    // Verify the order belongs to the user and is completed
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*, partner_id")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .eq("status", "completed")
      .single()

    if (orderError || !order) {
      return {
        success: false,
        error: "無法為此訂單提交評價"
      }
    }

    // Check if review already exists
    const { data: existingReview } = await supabaseAdmin
      .from("reviews")
      .select("id")
      .eq("order_id", orderId)
      .single()

    if (existingReview) {
      return {
        success: false,
        error: "您已經為此訂單提交過評價"
      }
    }

    // Create review
    const { data: review, error: reviewError } = await supabaseAdmin
      .from("reviews")
      .insert({
        order_id: orderId,
        user_id: user.id,
        partner_id: order.partner_id,
        rating,
        comment,
        is_anonymous: isAnonymous,
        status: "published"
      })
      .select()
      .single()

    if (reviewError) {
      console.error("創建評價錯誤:", reviewError)
      return {
        success: false,
        error: "提交評價失敗"
      }
    }

    // Update partner statistics
    await updatePartnerStatistics(order.partner_id)

    return {
      success: true,
      review,
      message: "感謝您的評價！"
    }
  } catch (error) {
    console.error("提交評價錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "提交評價過程中發生未知錯誤"
    }
  }
}

export async function updateReview(reviewId: string, updates: { rating?: number; comment?: string }) {
  try {
    // Get current user
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value
    if (!token) {
      return {
        success: false,
        error: "請先登入"
      }
    }

    const user = await getCurrentUser(token)
    if (!user) {
      return {
        success: false,
        error: "用戶未找到"
      }
    }

    // Update review
    const { data: review, error } = await supabaseAdmin
      .from("reviews")
      .update(updates)
      .eq("id", reviewId)
      .eq("user_id", user.id)
      .select("*, partner_id")
      .single()

    if (error || !review) {
      return {
        success: false,
        error: "更新評價失敗"
      }
    }

    // Update partner statistics if rating changed
    if (updates.rating) {
      await updatePartnerStatistics(review.partner_id)
    }

    return {
      success: true,
      review,
      message: "評價已更新"
    }
  } catch (error) {
    console.error("更新評價錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "更新評價過程中發生未知錯誤"
    }
  }
}

export async function getOrderReview(orderId: string) {
  try {
    const { data: review, error } = await supabaseAdmin
      .from("reviews")
      .select("*")
      .eq("order_id", orderId)
      .single()

    if (error && error.code !== "PGRST116") { // PGRST116 = no rows found
      console.error("獲取評價錯誤:", error)
      return {
        success: false,
        error: "獲取評價失敗"
      }
    }

    return {
      success: true,
      review
    }
  } catch (error) {
    console.error("獲取評價錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "獲取評價過程中發生未知錯誤"
    }
  }
}

export async function getPartnerReviews(partnerId: string, limit: number = 10) {
  try {
    const { data: reviews, error } = await supabaseAdmin
      .from("reviews")
      .select(`
        *,
        user:users(name)
      `)
      .eq("partner_id", partnerId)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("獲取合作夥伴評價錯誤:", error)
      return {
        success: false,
        error: "獲取評價失敗",
        reviews: []
      }
    }

    return {
      success: true,
      reviews: reviews || []
    }
  } catch (error) {
    console.error("獲取合作夥伴評價錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "獲取評價過程中發生未知錯誤",
      reviews: []
    }
  }
}

// Get company reviews with rating statistics
export async function getCompanyReviews(partnerId: string) {
  try {
    const { data: reviews, error } = await supabaseAdmin
      .from("reviews")
      .select(`
        *,
        user:users(name)
      `)
      .eq("partner_id", partnerId)
      .eq("status", "published")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("獲取公司評價錯誤:", error)
      return {
        success: false,
        error: "獲取評價失敗",
        reviews: []
      }
    }

    // Calculate rating statistics
    const totalReviews = reviews?.length || 0
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    let totalRating = 0

    reviews?.forEach(review => {
      ratingDistribution[review.rating as keyof typeof ratingDistribution]++
      totalRating += review.rating
    })

    const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0

    return {
      success: true,
      reviews: reviews || [],
      rating: {
        averageRating,
        totalReviews,
        ratingDistribution
      }
    }
  } catch (error) {
    console.error("獲取公司評價錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "獲取評價過程中發生未知錯誤",
      reviews: []
    }
  }
}

// Check if user can review an order
export async function checkCanReview(userId: string, orderId: string) {
  try {
    // Check if order exists and belongs to user
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*, user_id, status")
      .eq("id", orderId)
      .single()

    if (orderError || !order) {
      return {
        canReview: false,
        hasReviewed: false,
        error: "訂單不存在"
      }
    }

    // Check if order belongs to user
    if (order.user_id !== userId) {
      return {
        canReview: false,
        hasReviewed: false,
        error: "無權限查看此訂單"
      }
    }

    // Check if order is completed
    if (order.status !== "completed") {
      return {
        canReview: false,
        hasReviewed: false,
        error: "只能評價已完成的訂單"
      }
    }

    // Check if already reviewed
    const { data: existingReview } = await supabaseAdmin
      .from("reviews")
      .select("id")
      .eq("order_id", orderId)
      .single()

    return {
      canReview: !existingReview,
      hasReviewed: !!existingReview
    }
  } catch (error) {
    console.error("檢查評價權限錯誤:", error)
    return {
      canReview: false,
      hasReviewed: false,
      error: error instanceof Error ? error.message : "檢查權限過程中發生錯誤"
    }
  }
}
