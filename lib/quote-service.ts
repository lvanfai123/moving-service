"use server"

import { supabase, supabaseAdmin } from "./supabase"
import type { QuoteRequest, Quote } from "@/types/quote"
import { format } from "date-fns"
import { sendQuoteNotification } from "./notification-service"

// Generate unique quote request ID
function generateQuoteRequestId(): string {
  const date = format(new Date(), "yyyyMMdd")
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0")
  return `Q-${date}-${random}`
}

// Create a new quote request
export async function createQuoteRequest(data: Omit<QuoteRequest, "id" | "created_at" | "updated_at" | "status" | "notification_status">) {
  try {
    const quoteRequestId = generateQuoteRequestId()
    
    // Check if ID already exists
    const { data: existing } = await supabaseAdmin
      .from("quote_requests")
      .select("id")
      .eq("id", quoteRequestId)
      .single()
    
    if (existing) {
      // Generate a new ID if collision
      return createQuoteRequest(data)
    }
    
    // Insert quote request
    const { data: quoteRequest, error } = await supabaseAdmin
      .from("quote_requests")
      .insert({
        id: quoteRequestId,
        ...data,
        status: "pending",
        notification_status: { email: "pending", sms: "pending" }
      })
      .select()
      .single()

    if (error) {
      console.error("創建報價請求錯誤:", error)
      throw error
    }

    // Get active partners to notify
    const { data: partners, error: partnersError } = await supabaseAdmin
      .from("partners")
      .select("*")
      .eq("status", "active")

    if (partnersError) {
      console.error("獲取合作夥伴錯誤:", partnersError)
    }

    // Send notifications to partners
    if (partners && partners.length > 0) {
      await sendQuoteNotification(partners, quoteRequest)
      
      // Update quote request status to 'sent'
      await supabaseAdmin
        .from("quote_requests")
        .update({ status: "sent" })
        .eq("id", quoteRequestId)
    }

    return { success: true, quoteRequestId, quoteRequest }
  } catch (error) {
    console.error("創建報價請求失敗:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "創建報價請求失敗" 
    }
  }
}

// Get quote request by ID
export async function getQuoteRequestById(quoteRequestId: string) {
  try {
    const { data, error } = await supabase
      .from("quote_requests")
      .select("*")
      .eq("id", quoteRequestId)
      .single()

    if (error) throw error
    return { success: true, quoteRequest: data }
  } catch (error) {
    console.error("獲取報價請求錯誤:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "獲取報價請求失敗" 
    }
  }
}

// Get quotes for a quote request
export async function getQuotesForRequest(quoteRequestId: string) {
  try {
    const { data, error } = await supabase
      .from("quotes")
      .select(`
        *,
        partner:partners(*)
      `)
      .eq("quote_request_id", quoteRequestId)
      .eq("status", "submitted")

    if (error) throw error
    return { success: true, quotes: data || [] }
  } catch (error) {
    console.error("獲取報價錯誤:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "獲取報價失敗",
      quotes: []
    }
  }
}

// Submit a quote from partner
export async function submitQuote(quoteData: Omit<Quote, "id" | "created_at" | "updated_at" | "status" | "expires_at">) {
  try {
    // Set expiration time (48 hours from now)
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 48)

    const { data: quote, error } = await supabaseAdmin
      .from("quotes")
      .insert({
        ...quoteData,
        status: "submitted",
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single()

    if (error) throw error

    // Update quote request status to 'quoted' if this is the first quote
    const { data: existingQuotes } = await supabaseAdmin
      .from("quotes")
      .select("id")
      .eq("quote_request_id", quoteData.quote_request_id)
      .eq("status", "submitted")

    if (existingQuotes && existingQuotes.length === 1) {
      await supabaseAdmin
        .from("quote_requests")
        .update({ status: "quoted" })
        .eq("id", quoteData.quote_request_id)
    }

    // TODO: Send notification to customer about new quote

    return { success: true, quote }
  } catch (error) {
    console.error("提交報價錯誤:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "提交報價失敗" 
    }
  }
}

// Accept a quote
export async function acceptQuote(quoteId: string, userId: string) {
  try {
    // Get quote details
    const { data: quote, error: quoteError } = await supabaseAdmin
      .from("quotes")
      .select(`
        *,
        quote_request:quote_requests(*)
      `)
      .eq("id", quoteId)
      .single()

    if (quoteError) throw quoteError

    // Verify the user owns the quote request
    if (quote.quote_request.user_id !== userId) {
      throw new Error("未授權的操作")
    }

    // Update quote status
    const { error: updateError } = await supabaseAdmin
      .from("quotes")
      .update({ status: "accepted" })
      .eq("id", quoteId)

    if (updateError) throw updateError

    // Update quote request status
    await supabaseAdmin
      .from("quote_requests")
      .update({ status: "accepted" })
      .eq("id", quote.quote_request_id)

    // Reject other quotes for the same request
    await supabaseAdmin
      .from("quotes")
      .update({ status: "rejected" })
      .eq("quote_request_id", quote.quote_request_id)
      .neq("id", quoteId)

    return { success: true, quote }
  } catch (error) {
    console.error("接受報價錯誤:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "接受報價失敗" 
    }
  }
}

// Get quote requests for a user
export async function getUserQuoteRequests(userId: string) {
  try {
    const { data, error } = await supabase
      .from("quote_requests")
      .select(`
        *,
        quotes:quotes(count)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return { success: true, quoteRequests: data || [] }
  } catch (error) {
    console.error("獲取用戶報價請求錯誤:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "獲取報價請求失敗",
      quoteRequests: []
    }
  }
}

// Get quote requests for a partner
export async function getPartnerQuoteRequests(partnerId: string) {
  try {
    // Get quote requests where partner was notified
    const { data: notifications, error: notifError } = await supabase
      .from("notifications")
      .select("quote_request_id")
      .eq("partner_id", partnerId)
      .eq("status", "sent")

    if (notifError) throw notifError

    const quoteRequestIds = notifications?.map(n => n.quote_request_id) || []

    if (quoteRequestIds.length === 0) {
      return { success: true, quoteRequests: [] }
    }

    const { data, error } = await supabase
      .from("quote_requests")
      .select(`
        *,
        quotes:quotes!quote_request_id(*)
      `)
      .in("id", quoteRequestIds)
      .order("created_at", { ascending: false })

    if (error) throw error
    return { success: true, quoteRequests: data || [] }
  } catch (error) {
    console.error("獲取合作夥伴報價請求錯誤:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "獲取報價請求失敗",
      quoteRequests: []
    }
  }
}

// Cancel quote request
export async function cancelQuoteRequest(quoteRequestId: string, userId: string) {
  try {
    // Verify ownership
    const { data: quoteRequest, error: fetchError } = await supabaseAdmin
      .from("quote_requests")
      .select("user_id")
      .eq("id", quoteRequestId)
      .single()

    if (fetchError) throw fetchError

    if (quoteRequest.user_id !== userId) {
      throw new Error("未授權的操作")
    }

    // Update status
    const { error: updateError } = await supabaseAdmin
      .from("quote_requests")
      .update({ status: "cancelled" })
      .eq("id", quoteRequestId)

    if (updateError) throw updateError

    // Cancel all related quotes
    await supabaseAdmin
      .from("quotes")
      .update({ status: "expired" })
      .eq("quote_request_id", quoteRequestId)

    return { success: true }
  } catch (error) {
    console.error("取消報價請求錯誤:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "取消報價請求失敗" 
    }
  }
} 