"use server"

import { supabase, supabaseAdmin } from "./supabase"
import bcrypt from "bcryptjs"
import { createUserSession } from "./auth-service"

export interface Partner {
  id: string
  name: string
  contact_person: string
  email: string
  phone: string
  whatsapp?: string
  logo_url?: string
  description?: string
  service_areas?: string[]
  business_registration_number?: string
  introduction?: string
  business_hours?: string
  rating: number
  total_reviews: number
  total_orders: number
  created_at: string
  updated_at: string
  status: "active" | "inactive" | "pending" | "suspended"
}

// Register new partner
export async function registerPartner(partnerData: {
  name: string
  contact_person: string
  email: string
  phone: string
  whatsapp?: string
  password: string
  business_registration_number?: string
  description?: string
  service_areas?: string[]
}) {
  try {
    // Check if partner already exists
    const { data: existingPartner } = await supabaseAdmin
      .from("partners")
      .select("id")
      .eq("email", partnerData.email)
      .single()

    if (existingPartner) {
      return {
        success: false,
        error: "此電郵已被註冊"
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(partnerData.password, 10)

    // Create partner
    const { data: newPartner, error: insertError } = await supabaseAdmin
      .from("partners")
      .insert({
        name: partnerData.name,
        contact_person: partnerData.contact_person,
        email: partnerData.email,
        phone: partnerData.phone,
        whatsapp: partnerData.whatsapp,
        password_hash: passwordHash,
        business_registration_number: partnerData.business_registration_number,
        description: partnerData.description,
        service_areas: partnerData.service_areas || [],
        status: "pending" // Requires admin approval
      })
      .select()
      .single()

    if (insertError) {
      console.error("Insert error:", insertError)
      return {
        success: false,
        error: "創建合作夥伴失敗"
      }
    }

    // TODO: Send notification to admin for approval

    return {
      success: true,
      partner: newPartner,
      message: "註冊成功！請等待管理員審核"
    }
  } catch (error) {
    console.error("Partner registration error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "註冊過程中發生錯誤"
    }
  }
}

// Partner login
export async function loginPartner(email: string, password: string) {
  try {
    // Get partner by email
    const { data: partner, error: fetchError } = await supabaseAdmin
      .from("partners")
      .select("*")
      .eq("email", email)
      .single()

    if (fetchError || !partner) {
      return {
        success: false,
        error: "電郵或密碼不正確"
      }
    }

    // Check partner status
    if (partner.status === "pending") {
      return {
        success: false,
        error: "您的帳號正在等待審核"
      }
    }

    if (partner.status === "suspended") {
      return {
        success: false,
        error: "您的帳號已被停用，請聯絡管理員"
      }
    }

    // Verify password
    const isValid = await bcrypt.compare(password, partner.password_hash)
    
    if (!isValid) {
      return {
        success: false,
        error: "電郵或密碼不正確"
      }
    }

    // Create session
    const token = await createUserSession(partner.id)

    return {
      success: true,
      partner: {
        id: partner.id,
        name: partner.name,
        email: partner.email,
        contact_person: partner.contact_person,
        status: partner.status
      },
      token
    }
  } catch (error) {
    console.error("Partner login error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "登入過程中發生錯誤"
    }
  }
}

// Get partner by ID
export async function getPartnerById(partnerId: string) {
  try {
    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .eq("id", partnerId)
      .single()

    if (error) throw error
    return { success: true, partner: data }
  } catch (error) {
    console.error("獲取合作夥伴錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "獲取合作夥伴失敗"
    }
  }
}

// Get active partners
export async function getActivePartners() {
  try {
    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .eq("status", "active")
      .order("rating", { ascending: false })

    if (error) throw error
    return { success: true, partners: data || [] }
  } catch (error) {
    console.error("獲取活躍合作夥伴錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "獲取合作夥伴失敗",
      partners: []
    }
  }
}

// Update partner profile
export async function updatePartnerProfile(
  partnerId: string,
  updates: Partial<{
    name: string
    contact_person: string
    phone: string
    whatsapp: string
    description: string
    service_areas: string[]
    business_hours: string
    logo_url: string
  }>
) {
  try {
    const { data, error } = await supabaseAdmin
      .from("partners")
      .update(updates)
      .eq("id", partnerId)
      .select()
      .single()

    if (error) throw error
    return { success: true, partner: data }
  } catch (error) {
    console.error("更新合作夥伴資料錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "更新資料失敗"
    }
  }
}

// Update partner statistics
export async function updatePartnerStatistics(partnerId: string) {
  try {
    // Get review statistics
    const { data: reviews, error: reviewError } = await supabaseAdmin
      .from("reviews")
      .select("rating")
      .eq("partner_id", partnerId)
      .eq("status", "published")

    if (reviewError) throw reviewError

    // Calculate average rating
    const totalReviews = reviews?.length || 0
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0

    // Get order count
    const { count: orderCount, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("partner_id", partnerId)
      .eq("status", "completed")

    if (orderError) throw orderError

    // Update partner statistics
    const { error: updateError } = await supabaseAdmin
      .from("partners")
      .update({
        rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
        total_reviews: totalReviews,
        total_orders: orderCount || 0
      })
      .eq("id", partnerId)

    if (updateError) throw updateError

    return { success: true }
  } catch (error) {
    console.error("更新合作夥伴統計錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "更新統計失敗"
    }
  }
}

// Get partner dashboard data
export async function getPartnerDashboardData(partnerId: string) {
  try {
    // Get partner details
    const { data: partner, error: partnerError } = await supabase
      .from("partners")
      .select("*")
      .eq("id", partnerId)
      .single()

    if (partnerError) throw partnerError

    // Get recent orders
    const { data: recentOrders, error: ordersError } = await supabase
      .from("orders")
      .select(`
        *,
        quote:quotes(
          *,
          quote_request:quote_requests(*)
        ),
        user:users(name, phone)
      `)
      .eq("partner_id", partnerId)
      .order("created_at", { ascending: false })
      .limit(10)

    if (ordersError) throw ordersError

    // Get pending quotes
    const { data: pendingQuotes, error: quotesError } = await supabase
      .from("notifications")
      .select(`
        quote_request:quote_requests(
          *,
          quotes!quote_request_id(*)
        )
      `)
      .eq("partner_id", partnerId)
      .eq("status", "sent")

    if (quotesError) throw quotesError

    // Filter out quote requests that already have quotes from this partner
    const filteredQuotes = pendingQuotes?.filter(n => {
      const quoteRequest = n.quote_request as any
      const partnerQuotes = quoteRequest?.quotes?.filter(
        (q: any) => q.partner_id === partnerId
      )
      return !partnerQuotes || partnerQuotes.length === 0
    })

    // Get monthly statistics
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { data: monthlyStats, error: statsError } = await supabase
      .from("orders")
      .select("total_amount")
      .eq("partner_id", partnerId)
      .eq("status", "completed")
      .gte("completion_date", startOfMonth.toISOString())

    if (statsError) throw statsError

    const monthlyRevenue = monthlyStats?.reduce((sum, order) => sum + order.total_amount, 0) || 0

    return {
      success: true,
      dashboardData: {
        partner,
        recentOrders: recentOrders || [],
        pendingQuotes: filteredQuotes?.map(n => n.quote_request) || [],
        statistics: {
          monthlyRevenue,
          monthlyOrders: monthlyStats?.length || 0,
          totalOrders: partner.total_orders,
          averageRating: partner.rating,
          totalReviews: partner.total_reviews
        }
      }
    }
  } catch (error) {
    console.error("獲取合作夥伴儀表板數據錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "獲取數據失敗",
      dashboardData: null
    }
  }
}

// Admin functions

// Approve partner
export async function approvePartner(partnerId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("partners")
      .update({ status: "active" })
      .eq("id", partnerId)
      .select()
      .single()

    if (error) throw error

    // TODO: Send approval notification to partner

    return { success: true, partner: data }
  } catch (error) {
    console.error("審核合作夥伴錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "審核失敗"
    }
  }
}

// Suspend partner
export async function suspendPartner(partnerId: string, reason?: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("partners")
      .update({ 
        status: "suspended",
        notes: reason 
      })
      .eq("id", partnerId)
      .select()
      .single()

    if (error) throw error

    // TODO: Send suspension notification to partner

    return { success: true, partner: data }
  } catch (error) {
    console.error("停用合作夥伴錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "停用失敗"
    }
  }
}

// 獲取按服務區域篩選的合作夥伴
export async function getPartnersByServiceArea(area: string) {
  try {
    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .eq("status", "active")
      .contains("service_areas", [area])
      .order("rating", { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error("獲取合作夥伴錯誤:", error)
    return []
  }
}
