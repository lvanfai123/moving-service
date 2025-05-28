"use server"

import { processDepositPayment, confirmPaymentCompletion, processFinalPayment, getOrderPayments, processPaymentRefund } from "@/lib/payment-service"
import { getOrderById, updateOrderStatus } from "@/lib/order-service"
import { getCurrentUser } from "@/lib/auth-service"
import { cookies } from "next/headers"

// Process deposit payment for an order
export async function processOrderDepositPayment(orderId: string, paymentMethod: string) {
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

    // Process the deposit payment
    const result = await processDepositPayment(orderId, user.id, paymentMethod)
    
    if (!result.success) {
      return {
        success: false,
        error: result.error
      }
    }

    return {
      success: true,
      payment: result.payment,
      clientSecret: result.clientSecret,
      paymentIntentId: result.paymentIntentId
    }
  } catch (error) {
    console.error("處理訂金支付錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "支付處理失敗"
    }
  }
}

// Confirm payment completion
export async function confirmPayment(paymentId: string, paymentIntentId: string) {
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

    const result = await confirmPaymentCompletion(paymentId, paymentIntentId, user.id)
    
    if (!result.success) {
      return {
        success: false,
        error: result.error
      }
    }

    return {
      success: true,
      message: result.message
    }
  } catch (error) {
    console.error("確認支付錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "確認支付失敗"
    }
  }
}

// Process final payment for an order
export async function processOrderFinalPayment(orderId: string, paymentMethod: string) {
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

    // Process the final payment
    const result = await processFinalPayment(orderId, user.id, paymentMethod)
    
    if (!result.success) {
      return {
        success: false,
        error: result.error
      }
    }

    // Update order status to completed
    await updateOrderStatus(orderId, "completed", user.id)

    return {
      success: true,
      payment: result.payment,
      clientSecret: result.clientSecret,
      paymentIntentId: result.paymentIntentId
    }
  } catch (error) {
    console.error("處理尾款支付錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "支付處理失敗"
    }
  }
}

// Get payment history for an order
export async function getOrderPaymentHistory(orderId: string) {
  try {
    // Get current user
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value
    const user = token ? await getCurrentUser(token) : null

    // Get order to verify ownership
    const orderResult = await getOrderById(orderId)
    if (!orderResult.success || !orderResult.order) {
      return {
        success: false,
        error: "訂單不存在",
        payments: []
      }
    }

    // Verify user has access to this order
    if (user && orderResult.order.user_id !== user.id) {
      return {
        success: false,
        error: "無權查看此訂單",
        payments: []
      }
    }

    const result = await getOrderPayments(orderId, user?.id)
    
    return {
      success: result.success,
      payments: result.payments,
      error: result.error
    }
  } catch (error) {
    console.error("獲取支付記錄錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "獲取支付記錄失敗",
      payments: []
    }
  }
}

// Request refund
export async function requestRefund(paymentId: string, refundAmount: number, reason: string) {
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

    const result = await processPaymentRefund(paymentId, refundAmount, reason, user.id)
    
    if (!result.success) {
      return {
        success: false,
        error: result.error
      }
    }

    return {
      success: true,
      refundPayment: result.refundPayment,
      message: result.message
    }
  } catch (error) {
    console.error("處理退款錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "退款處理失敗"
    }
  }
} 