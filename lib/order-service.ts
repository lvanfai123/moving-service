"use server"

import { supabase, supabaseAdmin } from "./supabase"
import { format } from "date-fns"
import type { Quote } from "@/types/quote"

export interface Order {
  id: string
  quote_id: string
  user_id: string
  partner_id: string
  quote_request_id: string
  total_amount: number
  deposit_amount: number
  remaining_amount: number
  scheduled_date: string
  scheduled_time: string
  created_at: string
  updated_at: string
  status: "confirmed" | "in_progress" | "completed" | "cancelled"
  completion_date?: string
  notes?: string
}

// Generate unique order ID
function generateOrderId(): string {
  const date = format(new Date(), "yyyyMMdd")
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0")
  return `J-${date}-${random}`
}

// Create order from accepted quote
export async function createOrderFromQuote(quoteId: string, userId: string) {
  try {
    // Get quote details with related data
    const { data: quote, error: quoteError } = await supabaseAdmin
      .from("quotes")
      .select(`
        *,
        quote_request:quote_requests(*),
        partner:partners(*)
      `)
      .eq("id", quoteId)
      .eq("status", "accepted")
      .single()

    if (quoteError) throw quoteError

    // Verify the quote belongs to the user
    if (quote.quote_request.user_id !== userId) {
      throw new Error("未授權的操作")
    }

    // Calculate deposit (30% of total)
    const depositAmount = Math.round(quote.total_amount * 0.3)
    const remainingAmount = quote.total_amount - depositAmount

    const orderId = generateOrderId()

    // Check if ID already exists
    const { data: existing } = await supabaseAdmin
      .from("orders")
      .select("id")
      .eq("id", orderId)
      .single()

    if (existing) {
      // Generate a new ID if collision
      return createOrderFromQuote(quoteId, userId)
    }

    // Create order
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        id: orderId,
        quote_id: quoteId,
        user_id: userId,
        partner_id: quote.partner_id,
        quote_request_id: quote.quote_request_id,
        total_amount: quote.total_amount,
        deposit_amount: depositAmount,
        remaining_amount: remainingAmount,
        scheduled_date: quote.quote_request.moving_date,
        scheduled_time: quote.quote_request.moving_time,
        status: "confirmed"
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Update quote request status
    await supabaseAdmin
      .from("quote_requests")
      .update({ status: "accepted" })
      .eq("id", quote.quote_request_id)

    // TODO: Send confirmation notifications

    return { success: true, order, depositAmount }
  } catch (error) {
    console.error("創建訂單錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "創建訂單失敗"
    }
  }
}

// Get order by ID
export async function getOrderById(orderId: string) {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        quote:quotes(
          *,
          partner:partners(*),
          quote_request:quote_requests(*)
        ),
        payments:payments(*)
      `)
      .eq("id", orderId)
      .single()

    if (error) throw error
    return { success: true, order: data }
  } catch (error) {
    console.error("獲取訂單錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "獲取訂單失敗"
    }
  }
}

// Get user orders
export async function getUserOrders(userId: string) {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        quote:quotes(
          *,
          partner:partners(*),
          quote_request:quote_requests(*)
        ),
        payments:payments(*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return { success: true, orders: data || [] }
  } catch (error) {
    console.error("獲取用戶訂單錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "獲取訂單失敗",
      orders: []
    }
  }
}

// Get partner orders
export async function getPartnerOrders(partnerId: string) {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        quote:quotes(
          *,
          quote_request:quote_requests(*)
        ),
        user:users(*),
        payments:payments(*)
      `)
      .eq("partner_id", partnerId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return { success: true, orders: data || [] }
  } catch (error) {
    console.error("獲取合作夥伴訂單錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "獲取訂單失敗",
      orders: []
    }
  }
}

// Update order status
export async function updateOrderStatus(
  orderId: string,
  status: Order["status"],
  userId?: string,
  partnerId?: string
) {
  try {
    // Verify authorization
    if (userId) {
      const { data: order } = await supabaseAdmin
        .from("orders")
        .select("user_id")
        .eq("id", orderId)
        .single()

      if (order?.user_id !== userId) {
        throw new Error("未授權的操作")
      }
    }

    if (partnerId) {
      const { data: order } = await supabaseAdmin
        .from("orders")
        .select("partner_id")
        .eq("id", orderId)
        .single()

      if (order?.partner_id !== partnerId) {
        throw new Error("未授權的操作")
      }
    }

    const updateData: any = { status }
    
    // Add completion date if status is completed
    if (status === "completed") {
      updateData.completion_date = new Date().toISOString()
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update(updateData)
      .eq("id", orderId)
      .select()
      .single()

    if (error) throw error

    // Update quote request status if order is completed
    if (status === "completed") {
      await supabaseAdmin
        .from("quote_requests")
        .update({ status: "completed" })
        .eq("id", data.quote_request_id)
    }

    return { success: true, order: data }
  } catch (error) {
    console.error("更新訂單狀態錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "更新訂單狀態失敗"
    }
  }
}

// Cancel order
export async function cancelOrder(orderId: string, userId: string, reason?: string) {
  try {
    // Get order details
    const { data: order, error: fetchError } = await supabaseAdmin
      .from("orders")
      .select("*, payments:payments(*)")
      .eq("id", orderId)
      .single()

    if (fetchError) throw fetchError

    // Verify ownership
    if (order.user_id !== userId) {
      throw new Error("未授權的操作")
    }

    // Check if order can be cancelled
    if (order.status === "completed") {
      throw new Error("已完成的訂單無法取消")
    }

    // Check cancellation policy (24 hours before scheduled date)
    const scheduledDateTime = new Date(`${order.scheduled_date} ${order.scheduled_time}`)
    const now = new Date()
    const hoursUntilService = (scheduledDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)

    let refundAmount = 0
    let refundPercentage = 0

    // Calculate refund based on cancellation timing
    if (hoursUntilService >= 48) {
      refundPercentage = 100
      refundAmount = order.deposit_amount
    } else if (hoursUntilService >= 24) {
      refundPercentage = 50
      refundAmount = order.deposit_amount * 0.5
    } else {
      refundPercentage = 0
      refundAmount = 0
    }

    // Update order status
    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        status: "cancelled",
        notes: reason || "用戶取消"
      })
      .eq("id", orderId)

    if (updateError) throw updateError

    // Process refund if applicable
    if (refundAmount > 0 && order.payments?.length > 0) {
      // TODO: Process refund through payment gateway
      // Record refund in payments table
      await supabaseAdmin
        .from("payments")
        .insert({
          order_id: orderId,
          user_id: userId,
          amount: -refundAmount, // Negative amount for refund
          payment_type: "refund",
          payment_method: order.payments[0].payment_method,
          payment_status: "completed",
          gateway_response: {
            refund_percentage: refundPercentage,
            original_payment_id: order.payments[0].id
          }
        })
    }

    return {
      success: true,
      refundAmount,
      refundPercentage,
      message: refundAmount > 0 
        ? `訂單已取消，將退還 ${refundPercentage}% 訂金（HK$${refundAmount}）`
        : "訂單已取消，由於距離服務時間少於24小時，訂金將不予退還"
    }
  } catch (error) {
    console.error("取消訂單錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "取消訂單失敗"
    }
  }
}

// Add notes to order
export async function addOrderNotes(orderId: string, notes: string, userId?: string, partnerId?: string) {
  try {
    // Verify authorization
    if (userId) {
      const { data: order } = await supabaseAdmin
        .from("orders")
        .select("user_id")
        .eq("id", orderId)
        .single()

      if (order?.user_id !== userId) {
        throw new Error("未授權的操作")
      }
    }

    if (partnerId) {
      const { data: order } = await supabaseAdmin
        .from("orders")
        .select("partner_id")
        .eq("id", orderId)
        .single()

      if (order?.partner_id !== partnerId) {
        throw new Error("未授權的操作")
      }
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({ notes })
      .eq("id", orderId)
      .select()
      .single()

    if (error) throw error
    return { success: true, order: data }
  } catch (error) {
    console.error("添加訂單備註錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "添加備註失敗"
    }
  }
} 