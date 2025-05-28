import sgMail from "@sendgrid/mail"
import twilio from "twilio"
import { supabaseAdmin } from "./supabase"
import type { Partner } from "@/types/partner"
import type { QuoteRequest } from "@/types/quote"
import type { NotificationRecord } from "@/types/notification"

// 初始化SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "")

// 初始化Twilio
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || ""

/**
 * 發送報價請求通知給合作夥伴
 */
export async function sendQuoteNotification(partners: any[], quoteRequest: any) {
  const notificationPromises = partners.map(async (partner) => {
    try {
      // Send email notification
      const emailResult = await sendQuoteRequestEmail(partner, quoteRequest)
      
      // Send SMS notification
      const smsResult = await sendQuoteRequestSMS(partner, quoteRequest)
      
      // Store notification records in database
      await supabaseAdmin
        .from("notifications")
        .insert([
          {
            partner_id: partner.id,
            quote_request_id: quoteRequest.id,
            type: "email",
            status: emailResult.status,
            sent_at: emailResult.sentAt,
            content: emailResult.content,
            response: emailResult.response,
            error_message: emailResult.error
          },
          {
            partner_id: partner.id,
            quote_request_id: quoteRequest.id,
            type: "sms",
            status: smsResult.status,
            sent_at: smsResult.sentAt,
            content: smsResult.content,
            response: smsResult.response,
            error_message: smsResult.error
          }
        ])
      
      return { success: true, partner: partner.id }
    } catch (error) {
      console.error(`發送通知給合作夥伴 ${partner.id} 失敗:`, error)
      return { success: false, partner: partner.id, error }
    }
  })
  
  const results = await Promise.all(notificationPromises)
  
  // Update notification status in quote request
  const successCount = results.filter(r => r.success).length
  const failedCount = results.filter(r => !r.success).length
  
  await supabaseAdmin
    .from("quote_requests")
    .update({
      notification_status: {
        email: {
          total: partners.length,
          sent: successCount,
          failed: failedCount
        },
        sms: {
          total: partners.length,
          sent: successCount,
          failed: failedCount
        }
      }
    })
    .eq("id", quoteRequest.id)
  
  return results
}

/**
 * 發送報價請求電子郵件給搬運公司
 */
export async function sendQuoteRequestEmail(partner: any, quoteRequest: any): Promise<NotificationRecord> {
  try {
    // 準備電子郵件內容
    const msg = {
      to: partner.email,
      from: {
        email: "notifications@movingmaster.com",
        name: "搬屋師報價系統",
      },
      subject: `新的搬運報價請求 #${quoteRequest.id}`,
      templateId: "d-e1f8959b120e4bfca8717547d6b07cc1", // SendGrid動態模板ID
      dynamicTemplateData: {
        request_id: quoteRequest.id,
        customer_name: quoteRequest.customer_name,
        from_address: quoteRequest.from_address?.address || "",
        to_address: quoteRequest.to_address?.address || "",
        moving_date: quoteRequest.moving_date,
        moving_time: quoteRequest.moving_time,
        items: quoteRequest.items || [],
        special_requirements: quoteRequest.special_requirements || "無",
        quote_url: `https://movingmaster.com/partner/quotes/${quoteRequest.id}?token=${generatePartnerToken(partner.id)}`,
        partner_name: partner.name,
      },
    }

    // 發送電子郵件
    const response = await sgMail.send(msg)

    // 記錄發送結果
    const notificationRecord: NotificationRecord = {
      id: generateId(),
      partnerId: partner.id,
      quoteRequestId: quoteRequest.id,
      type: "email",
      status: response[0].statusCode === 202 ? "sent" : "failed",
      sentAt: new Date().toISOString(),
      content: JSON.stringify(msg),
      response: JSON.stringify(response[0]),
      error: null,
    }

    return notificationRecord
  } catch (error) {
    console.error("發送電子郵件錯誤:", error)

    // 記錄錯誤
    const notificationRecord: NotificationRecord = {
      id: generateId(),
      partnerId: partner.id,
      quoteRequestId: quoteRequest.id,
      type: "email",
      status: "failed",
      sentAt: new Date().toISOString(),
      content: "",
      response: "",
      error: error instanceof Error ? error.message : "未知錯誤",
    }

    return notificationRecord
  }
}

/**
 * 發送報價請求短信給搬運公司
 */
export async function sendQuoteRequestSMS(partner: any, quoteRequest: any): Promise<NotificationRecord> {
  try {
    // 準備短信內容
    const shortUrl = `https://mvmstr.com/q/${quoteRequest.id}`
    const fromAddress = quoteRequest.from_address?.address || ""
    const toAddress = quoteRequest.to_address?.address || ""
    const message = `【搬屋師】新報價請求 #${quoteRequest.id}：從${fromAddress.substring(0, 10)}...到${toAddress.substring(0, 10)}...，搬運日期${quoteRequest.moving_date}。查看詳情並報價：${shortUrl}`

    // 發送短信
    const response = await twilioClient.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: partner.phone,
    })

    // 記錄發送結果
    const notificationRecord: NotificationRecord = {
      id: generateId(),
      partnerId: partner.id,
      quoteRequestId: quoteRequest.id,
      type: "sms",
      status: response.status === "queued" || response.status === "sent" ? "sent" : "failed",
      sentAt: new Date().toISOString(),
      content: message,
      response: JSON.stringify(response),
      error: null,
    }

    return notificationRecord
  } catch (error) {
    console.error("發送短信錯誤:", error)

    // 記錄錯誤
    const notificationRecord: NotificationRecord = {
      id: generateId(),
      partnerId: partner.id,
      quoteRequestId: quoteRequest.id,
      type: "sms",
      status: "failed",
      sentAt: new Date().toISOString(),
      content: "",
      response: "",
      error: error instanceof Error ? error.message : "未知錯誤",
    }

    return notificationRecord
  }
}

/**
 * 向所有搬運公司發送報價請求通知
 */
export async function sendQuoteRequestToAllPartners(
  quoteRequest: QuoteRequest,
  partners: Partner[],
): Promise<{
  emailRecords: NotificationRecord[]
  smsRecords: NotificationRecord[]
}> {
  const emailRecords: NotificationRecord[] = []
  const smsRecords: NotificationRecord[] = []

  // 使用Promise.all並行處理所有發送任務
  const emailPromises = partners.map((partner) =>
    sendQuoteRequestEmail(partner, quoteRequest).then((record) => emailRecords.push(record)),
  )

  const smsPromises = partners.map((partner) =>
    sendQuoteRequestSMS(partner, quoteRequest).then((record) => smsRecords.push(record)),
  )

  // 等待所有發送任務完成
  await Promise.all([...emailPromises, ...smsPromises])

  return { emailRecords, smsRecords }
}

/**
 * 生成合作夥伴訪問令牌
 */
function generatePartnerToken(partnerId: string): string {
  // 在實際應用中，應使用更安全的方法生成和驗證令牌
  return Buffer.from(`partner-${partnerId}-${Date.now()}`).toString("base64")
}

/**
 * 生成唯一ID
 */
function generateId(): string {
  return `not-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}
