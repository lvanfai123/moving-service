"use server"

import { createQuoteRequest, getQuoteRequestById, getQuotesForRequest, acceptQuote, cancelQuoteRequest, getUserQuoteRequests } from "@/lib/quote-service"
import { createOrderFromQuote } from "@/lib/order-service"
import { getCurrentUser } from "@/lib/auth-service"
import { uploadMultipleFiles } from "@/lib/upload-service"
import { cookies } from "next/headers"

// Submit a new quote request
export async function submitQuoteRequest(formData: FormData) {
  try {
    // Get current user from session
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value
    const user = token ? await getCurrentUser(token) : null

    // Handle file uploads
    const photos = formData.getAll("photos") as File[]
    let photoUrls: string[] = []
    
    if (photos.length > 0 && photos[0].size > 0) {
      const uploadResult = await uploadMultipleFiles(photos)
      if (uploadResult.success) {
        photoUrls = uploadResult.urls
      } else {
        console.error("部分照片上傳失敗:", uploadResult.errors)
      }
    }

    // Prepare quote request data
    const quoteRequestData = {
      user_id: user?.id,
      customer_name: formData.get("fullname") as string,
      customer_phone: formData.get("phone") as string,
      customer_email: formData.get("email") as string,
      customer_whatsapp: formData.get("whatsapp") as string || undefined,
      from_address: JSON.parse(formData.get("fromAddress") as string),
      to_address: JSON.parse(formData.get("toAddress") as string),
      moving_date: formData.get("movingDate") as string,
      moving_time: formData.get("movingTime") as string,
      items: JSON.parse(formData.get("items") as string),
      packaging_services: JSON.parse(formData.get("packagingServices") as string || "{}"),
      additional_services: JSON.parse(formData.get("additionalServices") as string || "{}"),
      special_requirements: formData.get("specialRequirements") as string || undefined,
      photos: photoUrls
    }

    const result = await createQuoteRequest(quoteRequestData)

    if (!result.success) {
      return {
        success: false,
        error: result.error
      }
    }

    return {
      success: true,
      quoteRequestId: result.quoteRequestId,
      message: "報價請求已成功提交"
    }
  } catch (error) {
    console.error("提交報價請求錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "提交報價請求失敗"
    }
  }
}

// Get quote request details
export async function getQuoteRequest(quoteRequestId: string) {
  try {
    const result = await getQuoteRequestById(quoteRequestId)
    
    if (!result.success) {
      return {
        success: false,
        error: result.error
      }
    }

    // Get quotes for this request
    const quotesResult = await getQuotesForRequest(quoteRequestId)

    return {
      success: true,
      quoteRequest: result.quoteRequest,
      quotes: quotesResult.quotes || []
    }
  } catch (error) {
    console.error("獲取報價請求錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "獲取報價請求失敗"
    }
  }
}

// Accept a quote and create order
export async function acceptQuoteAndCreateOrder(quoteId: string) {
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

    // Accept the quote
    const acceptResult = await acceptQuote(quoteId, user.id)
    if (!acceptResult.success) {
      return {
        success: false,
        error: acceptResult.error
      }
    }

    // Create order from accepted quote
    const orderResult = await createOrderFromQuote(quoteId, user.id)
    if (!orderResult.success) {
      return {
        success: false,
        error: orderResult.error
      }
    }

    return {
      success: true,
      order: orderResult.order,
      depositAmount: orderResult.depositAmount,
      message: `訂單已創建，請支付訂金 HK$${orderResult.depositAmount}`
    }
  } catch (error) {
    console.error("接受報價並創建訂單錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "操作失敗"
    }
  }
}

// Cancel quote request
export async function cancelQuoteRequestAction(quoteRequestId: string) {
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

    const result = await cancelQuoteRequest(quoteRequestId, user.id)
    
    if (!result.success) {
      return {
        success: false,
        error: result.error
      }
    }

    return {
      success: true,
      message: "報價請求已取消"
    }
  } catch (error) {
    console.error("取消報價請求錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "取消失敗"
    }
  }
}

// Get user's quote requests
export async function getUserQuotes() {
  try {
    // Get current user
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value
    if (!token) {
      return {
        success: false,
        error: "請先登入",
        quoteRequests: []
      }
    }

    const user = await getCurrentUser(token)
    if (!user) {
      return {
        success: false,
        error: "用戶未找到",
        quoteRequests: []
      }
    }

    const result = await getUserQuoteRequests(user.id)
    
    return {
      success: result.success,
      quoteRequests: result.quoteRequests,
      error: result.error
    }
  } catch (error) {
    console.error("獲取用戶報價請求錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "獲取失敗",
      quoteRequests: []
    }
  }
} 