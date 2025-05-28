"use server"

import { revalidatePath } from "next/cache"
import { sendQuoteRequestToAllPartners } from "@/lib/notification-service"
import { getActivePartners } from "@/lib/data-service"
import type { QuoteRequest } from "@/types/quote-request"
import type { NotificationRecord } from "@/types/notification"

/**
 * 發送報價請求通知給所有搬運公司
 */
export async function sendQuoteRequestNotifications(quoteRequestId: string) {
  try {
    // 獲取報價請求詳情
    // 在實際應用中，這應該從數據庫獲取
    const quoteRequest = await getQuoteRequestById(quoteRequestId)

    if (!quoteRequest) {
      return {
        success: false,
        error: "找不到報價請求",
      }
    }

    // 獲取所有活躍的搬運公司
    const partners = await getActivePartners()

    if (!partners || partners.length === 0) {
      return {
        success: false,
        error: "沒有活躍的搬運公司",
      }
    }

    // 發送通知
    const { emailRecords, smsRecords } = await sendQuoteRequestToAllPartners(quoteRequest, partners)

    // 更新報價請求的通知狀態
    await updateQuoteRequestNotificationStatus(quoteRequestId, emailRecords, smsRecords)

    // 重新驗證路徑，更新UI
    revalidatePath(`/admin/orders/${quoteRequestId}`)
    revalidatePath("/admin/orders")

    return {
      success: true,
      emailSent: emailRecords.length,
      emailFailed: emailRecords.filter((r) => r.status === "failed").length,
      smsSent: smsRecords.length,
      smsFailed: smsRecords.filter((r) => r.status === "failed").length,
    }
  } catch (error) {
    console.error("發送通知錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "發送通知時發生未知錯誤",
    }
  }
}

/**
 * 重新發送失敗的通知
 */
export async function resendFailedNotifications(quoteRequestId: string) {
  try {
    // 獲取報價請求詳情
    const quoteRequest = await getQuoteRequestById(quoteRequestId)

    if (!quoteRequest) {
      return {
        success: false,
        error: "找不到報價請求",
      }
    }

    // 獲取失敗的通知記錄
    const failedNotifications = await getFailedNotifications(quoteRequestId)

    if (!failedNotifications || failedNotifications.length === 0) {
      return {
        success: false,
        error: "沒有失敗的通知需要重新發送",
      }
    }

    // 按合作夥伴ID分組
    const partnerIds = [...new Set(failedNotifications.map((n) => n.partnerId))]
    const partners = await getPartnersByIds(partnerIds)

    // 重新發送通知
    const emailRecords: NotificationRecord[] = []
    const smsRecords: NotificationRecord[] = []

    for (const notification of failedNotifications) {
      const partner = partners.find((p) => p.id === notification.partnerId)
      if (!partner) continue

      if (notification.type === "email") {
        const record = await sendQuoteRequestEmail(partner, quoteRequest)
        emailRecords.push(record)
      } else if (notification.type === "sms") {
        const record = await sendQuoteRequestSMS(partner, quoteRequest)
        smsRecords.push(record)
      }
    }

    // 更新報價請求的通知狀態
    await updateQuoteRequestNotificationStatus(quoteRequestId, emailRecords, smsRecords)

    // 重新驗證路徑，更新UI
    revalidatePath(`/admin/orders/${quoteRequestId}`)
    revalidatePath("/admin/orders")

    return {
      success: true,
      emailSent: emailRecords.filter((r) => r.status === "sent").length,
      emailFailed: emailRecords.filter((r) => r.status === "failed").length,
      smsSent: smsRecords.filter((r) => r.status === "sent").length,
      smsFailed: smsRecords.filter((r) => r.status === "failed").length,
    }
  } catch (error) {
    console.error("重新發送通知錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "重新發送通知時發生未知錯誤",
    }
  }
}

// 以下是模擬函數，在實際應用中應該連接到數據庫

async function getQuoteRequestById(id: string): Promise<QuoteRequest | null> {
  // 模擬從數據庫獲取報價請求
  return {
    id,
    customerName: "陳大文",
    customerPhone: "+85291234567",
    customerEmail: "chan@example.com",
    fromAddress: "九龍灣宏開道8號其士商業中心608室",
    toAddress: "沙田石門安群街3號京瑞廣場一期19樓C室",
    movingDate: "2023-05-10",
    movingTime: "14:00",
    hasElevatorFrom: true,
    hasElevatorTo: true,
    hasStairsFrom: false,
    hasStairsTo: false,
    parkingDistance: "10米內",
    items: [
      { name: "沙發", quantity: 1, size: "200cm x 90cm x 85cm" },
      { name: "雙人床", quantity: 1, size: "190cm x 150cm x 40cm" },
      { name: "衣櫃", quantity: 2, size: "180cm x 60cm x 200cm" },
      { name: "餐桌", quantity: 1, size: "150cm x 80cm x 75cm" },
      { name: "椅子", quantity: 4, size: "45cm x 45cm x 90cm" },
      { name: "封裝箱", quantity: 10, size: "50cm x 40cm x 40cm" },
    ],
    createdAt: new Date().toISOString(),
    status: "pending",
  }
}

async function updateQuoteRequestNotificationStatus(
  quoteRequestId: string,
  emailRecords: NotificationRecord[],
  smsRecords: NotificationRecord[],
) {
  // 模擬更新數據庫中的報價請求通知狀態
  console.log(`更新報價請求 ${quoteRequestId} 的通知狀態`)
  console.log(
    `電子郵件: 總共 ${emailRecords.length}, 成功 ${emailRecords.filter((r) => r.status === "sent").length}, 失敗 ${emailRecords.filter((r) => r.status === "failed").length}`,
  )
  console.log(
    `短信: 總共 ${smsRecords.length}, 成功 ${smsRecords.filter((r) => r.status === "sent").length}, 失敗 ${smsRecords.filter((r) => r.status === "failed").length}`,
  )

  // 在實際應用中，這裡應該更新數據庫
}

async function getFailedNotifications(quoteRequestId: string): Promise<NotificationRecord[]> {
  // 模擬從數據庫獲取失敗的通知記錄
  return []
}

async function getPartnersByIds(ids: string[]) {
  // 模擬從數據庫獲取搬運公司信息
  return []
}

// 這些函數在實際實現中需要導入
async function sendQuoteRequestEmail() {
  // 這個函數在實際實現中應該從notification-service.ts導入
  return {} as NotificationRecord
}

async function sendQuoteRequestSMS() {
  // 這個函數在實際���現中應該從notification-service.ts導入
  return {} as NotificationRecord
}
