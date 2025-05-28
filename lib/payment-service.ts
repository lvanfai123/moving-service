"use server"

import { supabaseAdmin } from "./supabase"
import type { Order } from "./order-service"

export interface Payment {
  id: string
  order_id: string
  user_id: string
  amount: number
  payment_type: "deposit" | "final" | "full" | "refund"
  payment_method: string
  payment_status: "pending" | "completed" | "failed" | "refunded"
  transaction_id?: string
  gateway_response?: any
  created_at: string
  updated_at: string
}

export interface PaymentIntent {
  clientSecret: string
  paymentIntentId: string
  amount: number
}

// Mock payment gateway functions (replace with real Stripe integration)
async function createPaymentIntent(amount: number, orderId: string): Promise<PaymentIntent> {
  // In production, this would integrate with Stripe
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  // const paymentIntent = await stripe.paymentIntents.create({
  //   amount: amount * 100, // Convert to cents
  //   currency: 'hkd',
  //   metadata: { orderId }
  // })
  
  return {
    clientSecret: `pi_mock_${Date.now()}_secret`,
    paymentIntentId: `pi_mock_${Date.now()}`,
    amount
  }
}

async function confirmPayment(paymentIntentId: string): Promise<boolean> {
  // Mock payment confirmation
  // In production, this would verify with Stripe
  return true
}

async function processRefund(paymentId: string, amount: number): Promise<boolean> {
  // Mock refund processing
  // In production, this would process refund through Stripe
  return true
}

// Process deposit payment
export async function processDepositPayment(
  orderId: string,
  userId: string,
  paymentMethod: string,
  paymentDetails?: any
) {
  try {
    // Get order details
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("user_id", userId)
      .single()

    if (orderError || !order) {
      throw new Error("訂單不存在")
    }

    // Check if deposit already paid
    const { data: existingPayment } = await supabaseAdmin
      .from("payments")
      .select("*")
      .eq("order_id", orderId)
      .eq("payment_type", "deposit")
      .eq("payment_status", "completed")
      .single()

    if (existingPayment) {
      throw new Error("訂金已支付")
    }

    // Create payment intent
    const paymentIntent = await createPaymentIntent(order.deposit_amount, orderId)

    // Record payment attempt
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from("payments")
      .insert({
        order_id: orderId,
        user_id: userId,
        amount: order.deposit_amount,
        payment_type: "deposit",
        payment_method: paymentMethod,
        payment_status: "pending",
        transaction_id: paymentIntent.paymentIntentId,
        gateway_response: {
          payment_intent_id: paymentIntent.paymentIntentId,
          client_secret: paymentIntent.clientSecret
        }
      })
      .select()
      .single()

    if (paymentError) throw paymentError

    return {
      success: true,
      payment,
      clientSecret: paymentIntent.clientSecret,
      paymentIntentId: paymentIntent.paymentIntentId
    }
  } catch (error) {
    console.error("處理訂金支付錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "支付處理失敗"
    }
  }
}

// Confirm payment after client-side completion
export async function confirmPaymentCompletion(
  paymentId: string,
  paymentIntentId: string,
  userId: string
) {
  try {
    // Get payment record
    const { data: payment, error: fetchError } = await supabaseAdmin
      .from("payments")
      .select("*, order:orders(*)")
      .eq("id", paymentId)
      .eq("user_id", userId)
      .single()

    if (fetchError || !payment) {
      throw new Error("支付記錄不存在")
    }

    // Verify payment with gateway
    const isConfirmed = await confirmPayment(paymentIntentId)

    if (!isConfirmed) {
      throw new Error("支付驗證失敗")
    }

    // Update payment status
    const { error: updateError } = await supabaseAdmin
      .from("payments")
      .update({
        payment_status: "completed",
        gateway_response: {
          ...payment.gateway_response,
          confirmed_at: new Date().toISOString()
        }
      })
      .eq("id", paymentId)

    if (updateError) throw updateError

    // Send confirmation notifications
    // TODO: Send email/SMS confirmation

    return {
      success: true,
      message: "支付成功"
    }
  } catch (error) {
    console.error("確認支付錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "確認支付失敗"
    }
  }
}

// Process final payment
export async function processFinalPayment(
  orderId: string,
  userId: string,
  paymentMethod: string
) {
  try {
    // Get order details
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("user_id", userId)
      .single()

    if (orderError || !order) {
      throw new Error("訂單不存在")
    }

    // Check if order is ready for final payment
    if (order.status !== "in_progress" && order.status !== "completed") {
      throw new Error("訂單狀態不允許支付尾款")
    }

    // Check if final payment already made
    const { data: existingPayment } = await supabaseAdmin
      .from("payments")
      .select("*")
      .eq("order_id", orderId)
      .eq("payment_type", "final")
      .eq("payment_status", "completed")
      .single()

    if (existingPayment) {
      throw new Error("尾款已支付")
    }

    // Create payment intent for remaining amount
    const paymentIntent = await createPaymentIntent(order.remaining_amount, orderId)

    // Record payment
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from("payments")
      .insert({
        order_id: orderId,
        user_id: userId,
        amount: order.remaining_amount,
        payment_type: "final",
        payment_method: paymentMethod,
        payment_status: "pending",
        transaction_id: paymentIntent.paymentIntentId,
        gateway_response: {
          payment_intent_id: paymentIntent.paymentIntentId,
          client_secret: paymentIntent.clientSecret
        }
      })
      .select()
      .single()

    if (paymentError) throw paymentError

    return {
      success: true,
      payment,
      clientSecret: paymentIntent.clientSecret,
      paymentIntentId: paymentIntent.paymentIntentId
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
export async function getOrderPayments(orderId: string, userId?: string) {
  try {
    let query = supabaseAdmin
      .from("payments")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false })

    if (userId) {
      query = query.eq("user_id", userId)
    }

    const { data, error } = await query

    if (error) throw error
    return { success: true, payments: data || [] }
  } catch (error) {
    console.error("獲取支付記錄錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "獲取支付記錄失敗",
      payments: []
    }
  }
}

// Process refund
export async function processPaymentRefund(
  paymentId: string,
  refundAmount: number,
  reason: string,
  userId?: string
) {
  try {
    // Get original payment
    const { data: originalPayment, error: fetchError } = await supabaseAdmin
      .from("payments")
      .select("*, order:orders(*)")
      .eq("id", paymentId)
      .single()

    if (fetchError || !originalPayment) {
      throw new Error("原始支付記錄不存在")
    }

    // Verify authorization
    if (userId && originalPayment.user_id !== userId) {
      throw new Error("未授權的操作")
    }

    // Validate refund amount
    if (refundAmount > originalPayment.amount) {
      throw new Error("退款金額不能超過原始支付金額")
    }

    // Process refund with payment gateway
    const refundSuccess = await processRefund(originalPayment.transaction_id, refundAmount)

    if (!refundSuccess) {
      throw new Error("退款處理失敗")
    }

    // Record refund
    const { data: refundPayment, error: refundError } = await supabaseAdmin
      .from("payments")
      .insert({
        order_id: originalPayment.order_id,
        user_id: originalPayment.user_id,
        amount: -refundAmount, // Negative amount for refund
        payment_type: "refund",
        payment_method: originalPayment.payment_method,
        payment_status: "completed",
        transaction_id: `refund_${Date.now()}`,
        gateway_response: {
          original_payment_id: paymentId,
          refund_reason: reason,
          refunded_at: new Date().toISOString()
        }
      })
      .select()
      .single()

    if (refundError) throw refundError

    // Update original payment status if fully refunded
    if (refundAmount === originalPayment.amount) {
      await supabaseAdmin
        .from("payments")
        .update({ payment_status: "refunded" })
        .eq("id", paymentId)
    }

    return {
      success: true,
      refundPayment,
      message: `成功退款 HK$${refundAmount}`
    }
  } catch (error) {
    console.error("處理退款錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "退款處理失敗"
    }
  }
}

// Calculate order payment summary
export async function getOrderPaymentSummary(orderId: string) {
  try {
    const { data: payments, error } = await supabaseAdmin
      .from("payments")
      .select("*")
      .eq("order_id", orderId)
      .eq("payment_status", "completed")

    if (error) throw error

    const totalPaid = payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0
    const deposits = payments?.filter(p => p.payment_type === "deposit") || []
    const finalPayments = payments?.filter(p => p.payment_type === "final") || []
    const refunds = payments?.filter(p => p.payment_type === "refund") || []

    return {
      success: true,
      summary: {
        totalPaid,
        depositPaid: deposits.reduce((sum, p) => sum + p.amount, 0),
        finalPaid: finalPayments.reduce((sum, p) => sum + p.amount, 0),
        totalRefunded: Math.abs(refunds.reduce((sum, p) => sum + p.amount, 0)),
        netPaid: totalPaid
      }
    }
  } catch (error) {
    console.error("計算支付摘要錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "計算支付摘要失敗",
      summary: null
    }
  }
} 