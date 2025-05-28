"use server"

import { headers } from "next/headers"

// Twilio Verify Service SID
const TWILIO_VERIFY_SID = "VA8ad1fe4447afc3ca5a99798a0d4b6927"
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "AC_MOCK_ACCOUNT_SID"
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "MOCK_AUTH_TOKEN"

// 在生產環境中，這些值應該從環境變量獲取
// const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
// const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN

interface TwilioResponse {
  success: boolean
  error?: string
  sid?: string
  status?: string
}

/**
 * 發送驗證碼到指定電話號碼
 */
export async function sendVerificationCode(phoneNumber: string): Promise<TwilioResponse> {
  try {
    // 檢查是否在開發環境
    const headersList = await headers()
    const host = headersList.get("host") || ""
    const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1")

    // 在開發環境中模擬Twilio API響應
    if (isLocalhost || !TWILIO_AUTH_TOKEN || TWILIO_AUTH_TOKEN === "MOCK_AUTH_TOKEN") {
      console.log(`[DEV] 模擬發送驗證碼到: ${phoneNumber}`)

      // 模擬延遲
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return {
        success: true,
        sid: "VE_MOCK_VERIFICATION_SID",
        status: "pending",
      }
    }

    // 在生產環境中使用實際的Twilio API
    const twilioUrl = `https://verify.twilio.com/v2/Services/${TWILIO_VERIFY_SID}/Verifications`

    const response = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64"),
      },
      body: new URLSearchParams({
        To: phoneNumber,
        Channel: "sms",
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "發送驗證碼失敗")
    }

    const data = await response.json()
    return {
      success: true,
      sid: data.sid,
      status: data.status,
    }
  } catch (error) {
    console.error("發送驗證碼錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "發送驗證碼時發生未知錯誤",
    }
  }
}

/**
 * 驗證用戶提供的驗證碼
 */
export async function checkVerificationCode(phoneNumber: string, code: string): Promise<TwilioResponse> {
  try {
    // 檢查是否在開發環境
    const headersList = await headers()
    const host = headersList.get("host") || ""
    const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1")

    // 在開發環境中模擬Twilio API響應
    if (isLocalhost || !TWILIO_AUTH_TOKEN || TWILIO_AUTH_TOKEN === "MOCK_AUTH_TOKEN") {
      console.log(`[DEV] 模擬驗證碼檢查: ${phoneNumber}, 代碼: ${code}`)

      // 模擬延遲
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 在開發環境中，任何6位數的代碼都視為有效，或者使用特定測試代碼
      if (code === "123456" || code === "000000" || /^\d{6}$/.test(code)) {
        return {
          success: true,
          status: "approved",
        }
      } else {
        return {
          success: false,
          error: "驗證碼不正確",
        }
      }
    }

    // 在生產環境中使用實際的Twilio API
    const twilioUrl = `https://verify.twilio.com/v2/Services/${TWILIO_VERIFY_SID}/VerificationCheck`

    const response = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64"),
      },
      body: new URLSearchParams({
        To: phoneNumber,
        Code: code,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "驗證碼驗證失敗")
    }

    const data = await response.json()
    return {
      success: data.status === "approved",
      status: data.status,
      error: data.status !== "approved" ? "驗證碼不正確" : undefined,
    }
  } catch (error) {
    console.error("驗證碼檢查錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "驗證碼檢查時發生未知錯誤",
    }
  }
}
