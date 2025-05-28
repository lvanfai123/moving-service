"use server"

import { submitQuote, getPartnerQuoteRequests } from "@/lib/quote-service"
import { loginPartner, registerPartner, updatePartnerProfile, getPartnerDashboardData, getPartnerById } from "@/lib/partner-service"
import { getCurrentUser } from "@/lib/auth-service"
import { uploadFile } from "@/lib/upload-service"
import { cookies } from "next/headers"
import type { Quote } from "@/types/quote"

// Partner login
export async function partnerLogin(email: string, password: string) {
  try {
    const result = await loginPartner(email, password)
    
    if (result.success && result.token) {
      // Set auth cookie
      const cookieStore = await cookies()
      cookieStore.set("partner-token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })
    }
    
    return result
  } catch (error) {
    console.error("合作夥伴登入錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "登入失敗"
    }
  }
}

// Partner registration
export async function partnerRegister(data: {
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
    const result = await registerPartner(data)
    return result
  } catch (error) {
    console.error("合作夥伴註冊錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "註冊失敗"
    }
  }
}

// Get current partner
export async function getCurrentPartner() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("partner-token")?.value
    
    if (!token) {
      return null
    }
    
    const user = await getCurrentUser(token)
    if (!user) {
      return null
    }
    
    const result = await getPartnerById(user.id)
    return result.success ? result.partner : null
  } catch (error) {
    console.error("獲取當前合作夥伴錯誤:", error)
    return null
  }
}

// Submit quote for a quote request
export async function submitPartnerQuote(formData: FormData) {
  try {
    // Get current partner
    const partner = await getCurrentPartner()
    if (!partner) {
      return {
        success: false,
        error: "請先登入"
      }
    }

    // Parse form data
    const quoteRequestId = formData.get("quoteRequestId") as string
    const basicFee = parseFloat(formData.get("basicFee") as string)
    const discount = parseFloat(formData.get("discount") as string) || 0
    
    // Parse additional services
    const additionalServices: {
      disposalService?: number
      storageService?: number
      furnitureAssembly?: number
      governmentDisposalFee?: number
      packaging?: number
    } = {}
    
    const serviceFields = [
      "disposalService",
      "storageService", 
      "furnitureAssembly",
      "governmentDisposalFee",
      "packaging"
    ] as const
    
    serviceFields.forEach(service => {
      const value = formData.get(service)
      if (value) {
        additionalServices[service] = parseFloat(value as string)
      }
    })
    
    // Parse available times
    const availableTimes: Quote["available_times"] = []
    const timeSlots = formData.getAll("availableTimes") as string[]
    timeSlots.forEach(slot => {
      const [date, time] = slot.split("|")
      availableTimes.push({ date, time })
    })
    
    // Calculate total amount
    const additionalTotal = Object.values(additionalServices).reduce((sum, fee) => sum + (fee || 0), 0)
    const totalAmount = basicFee + additionalTotal - discount
    
    // Prepare quote data
    const quoteData: Omit<Quote, "id" | "created_at" | "updated_at" | "status" | "expires_at"> = {
      quote_request_id: quoteRequestId,
      partner_id: partner.id,
      basic_fee: basicFee,
      additional_services: additionalServices,
      discount: discount,
      total_amount: totalAmount,
      available_times: availableTimes,
      remarks: formData.get("remarks") as string || undefined
    }
    
    const result = await submitQuote(quoteData)
    
    return result
  } catch (error) {
    console.error("提交報價錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "提交報價失敗"
    }
  }
}

// Get partner's quote requests
export async function getPartnerQuotes() {
  try {
    const partner = await getCurrentPartner()
    if (!partner) {
      return {
        success: false,
        error: "請先登入",
        quoteRequests: []
      }
    }
    
    const result = await getPartnerQuoteRequests(partner.id)
    return result
  } catch (error) {
    console.error("獲取報價請求錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "獲取報價請求失敗",
      quoteRequests: []
    }
  }
}

// Get partner dashboard data
export async function getPartnerDashboard() {
  try {
    const partner = await getCurrentPartner()
    if (!partner) {
      return {
        success: false,
        error: "請先登入",
        dashboardData: null
      }
    }
    
    const result = await getPartnerDashboardData(partner.id)
    return result
  } catch (error) {
    console.error("獲取儀表板數據錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "獲取數據失敗",
      dashboardData: null
    }
  }
}

// Update partner profile
export async function updatePartnerProfileAction(formData: FormData) {
  try {
    const partner = await getCurrentPartner()
    if (!partner) {
      return {
        success: false,
        error: "請先登入"
      }
    }
    
    // Handle logo upload if provided
    let logoUrl = partner.logo_url
    const logoFile = formData.get("logo") as File
    
    if (logoFile && logoFile.size > 0) {
      const uploadResult = await uploadFile(logoFile, "partner-logos")
      if (uploadResult.success && uploadResult.publicUrl) {
        logoUrl = uploadResult.publicUrl
      }
    }
    
    // Prepare update data
    const updates = {
      name: formData.get("name") as string || partner.name,
      contact_person: formData.get("contact_person") as string || partner.contact_person,
      phone: formData.get("phone") as string || partner.phone,
      whatsapp: formData.get("whatsapp") as string || partner.whatsapp,
      description: formData.get("description") as string || partner.description,
      business_hours: formData.get("business_hours") as string || partner.business_hours,
      logo_url: logoUrl,
      service_areas: formData.has("service_areas") 
        ? JSON.parse(formData.get("service_areas") as string) 
        : partner.service_areas
    }
    
    const result = await updatePartnerProfile(partner.id, updates)
    
    return result
  } catch (error) {
    console.error("更新合作夥伴資料錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "更新資料失敗"
    }
  }
}

// Partner logout
export async function partnerLogout() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete("partner-token")
    
    return {
      success: true,
      message: "已成功登出"
    }
  } catch (error) {
    console.error("登出錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "登出失敗"
    }
  }
} 