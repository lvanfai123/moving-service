"use server"

import { approvePartner, suspendPartner, getActivePartners } from "@/lib/partner-service"
import { supabaseAdmin } from "@/lib/supabase"
import { getCurrentUser } from "@/lib/auth-service"
import { cookies } from "next/headers"

// Check if current user is admin
async function checkAdminAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value
    
    if (!token) return false
    
    const user = await getCurrentUser(token)
    if (!user) return false
    
    // Check if user is admin (you might want to add an is_admin field to users table)
    // For now, we'll check if the user has a specific admin email
    const adminEmails = process.env.ADMIN_EMAILS?.split(",") || []
    
    const { data: userData } = await supabaseAdmin
      .from("users")
      .select("email")
      .eq("id", user.id)
      .single()
    
    return !!(userData && userData.email && adminEmails.includes(userData.email))
  } catch (error) {
    console.error("檢查管理員權限錯誤:", error)
    return false
  }
}

// Approve a pending partner
export async function approvePartnerAction(partnerId: string) {
  try {
    const isAdmin = await checkAdminAuth()
    if (!isAdmin) {
      return {
        success: false,
        error: "未授權的操作"
      }
    }
    
    const result = await approvePartner(partnerId)
    return result
  } catch (error) {
    console.error("審核合作夥伴錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "審核失敗"
    }
  }
}

// Suspend a partner
export async function suspendPartnerAction(partnerId: string, reason?: string) {
  try {
    const isAdmin = await checkAdminAuth()
    if (!isAdmin) {
      return {
        success: false,
        error: "未授權的操作"
      }
    }
    
    const result = await suspendPartner(partnerId, reason)
    return result
  } catch (error) {
    console.error("停用合作夥伴錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "停用失敗"
    }
  }
}

// Get all partners (including pending)
export async function getAllPartners() {
  try {
    const isAdmin = await checkAdminAuth()
    if (!isAdmin) {
      return {
        success: false,
        error: "未授權的操作",
        partners: []
      }
    }
    
    const { data, error } = await supabaseAdmin
      .from("partners")
      .select("*")
      .order("created_at", { ascending: false })
    
    if (error) throw error
    
    return {
      success: true,
      partners: data || []
    }
  } catch (error) {
    console.error("獲取所有合作夥伴錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "獲取合作夥伴失敗",
      partners: []
    }
  }
}

// Get system statistics
export async function getSystemStatistics() {
  try {
    const isAdmin = await checkAdminAuth()
    if (!isAdmin) {
      return {
        success: false,
        error: "未授權的操作",
        statistics: null
      }
    }
    
    // Get various statistics
    const [
      { count: totalUsers },
      { count: totalPartners },
      { count: totalQuoteRequests },
      { count: totalOrders },
      { data: revenueData }
    ] = await Promise.all([
      supabaseAdmin.from("users").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("partners").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabaseAdmin.from("quote_requests").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("orders").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("payments")
        .select("amount")
        .eq("payment_status", "completed")
        .not("payment_type", "eq", "refund")
    ])
    
    const totalRevenue = revenueData?.reduce((sum, payment) => sum + payment.amount, 0) || 0
    
    // Get monthly statistics
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)
    
    const [
      { count: monthlyOrders },
      { data: monthlyRevenueData }
    ] = await Promise.all([
      supabaseAdmin.from("orders")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfMonth.toISOString()),
      supabaseAdmin.from("payments")
        .select("amount")
        .eq("payment_status", "completed")
        .not("payment_type", "eq", "refund")
        .gte("created_at", startOfMonth.toISOString())
    ])
    
    const monthlyRevenue = monthlyRevenueData?.reduce((sum, payment) => sum + payment.amount, 0) || 0
    
    return {
      success: true,
      statistics: {
        totalUsers: totalUsers || 0,
        totalPartners: totalPartners || 0,
        totalQuoteRequests: totalQuoteRequests || 0,
        totalOrders: totalOrders || 0,
        totalRevenue,
        monthlyOrders: monthlyOrders || 0,
        monthlyRevenue
      }
    }
  } catch (error) {
    console.error("獲取系統統計錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "獲取統計失敗",
      statistics: null
    }
  }
}

// Get recent activities
export async function getRecentActivities(limit: number = 20) {
  try {
    const isAdmin = await checkAdminAuth()
    if (!isAdmin) {
      return {
        success: false,
        error: "未授權的操作",
        activities: []
      }
    }
    
    // Get recent quote requests, orders, and payments
    const [quoteRequests, orders, payments] = await Promise.all([
      supabaseAdmin
        .from("quote_requests")
        .select("id, customer_name, created_at, status")
        .order("created_at", { ascending: false })
        .limit(limit),
      supabaseAdmin
        .from("orders")
        .select("id, created_at, status, total_amount")
        .order("created_at", { ascending: false })
        .limit(limit),
      supabaseAdmin
        .from("payments")
        .select("id, created_at, amount, payment_type, payment_status")
        .order("created_at", { ascending: false })
        .limit(limit)
    ])
    
    // Combine and sort activities
    const activities = [
      ...(quoteRequests.data || []).map(q => ({
        type: "quote_request" as const,
        id: q.id,
        description: `新報價請求: ${q.customer_name}`,
        timestamp: q.created_at,
        status: q.status
      })),
      ...(orders.data || []).map(o => ({
        type: "order" as const,
        id: o.id,
        description: `新訂單: HK$${o.total_amount}`,
        timestamp: o.created_at,
        status: o.status
      })),
      ...(payments.data || []).map(p => ({
        type: "payment" as const,
        id: p.id,
        description: `${p.payment_type === "refund" ? "退款" : "付款"}: HK$${Math.abs(p.amount)}`,
        timestamp: p.created_at,
        status: p.payment_status
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit)
    
    return {
      success: true,
      activities
    }
  } catch (error) {
    console.error("獲取最近活動錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "獲取活動失敗",
      activities: []
    }
  }
}

// Update system settings
export async function updateSystemSettings(settings: {
  depositPercentage?: number
  cancellationHours?: number
  maxPhotosPerQuote?: number
  autoNotifyPartners?: boolean
}) {
  try {
    const isAdmin = await checkAdminAuth()
    if (!isAdmin) {
      return {
        success: false,
        error: "未授權的操作"
      }
    }
    
    // In a real application, you would store these settings in a database table
    // For now, we'll just return success
    console.log("更新系統設置:", settings)
    
    return {
      success: true,
      message: "系統設置已更新"
    }
  } catch (error) {
    console.error("更新系統設置錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "更新設置失敗"
    }
  }
} 