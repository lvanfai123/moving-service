"use server"

import { headers } from "next/headers"

// reCAPTCHA 密鑰
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || "6LeX6UQrAAAAACcnmpQimGb91CHrrp1_IUuBNP1d"

/**
 * 驗證 reCAPTCHA 令牌
 */
export async function verifyRecaptcha(token: string): Promise<boolean> {
  // 如果沒有配置 reCAPTCHA 密鑰，直接返回 true（開發環境）
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    console.warn("reCAPTCHA secret key not configured")
    return true
  }

  try {
    const headersList = await headers()
    const host = headersList.get("host") || ""
    const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1")

    // 在開發環境中模擬 reCAPTCHA 驗證
    if (isLocalhost) {
      console.log("[DEV] 模擬 reCAPTCHA 驗證")
      return true
    }

    // 在生產環境中使用實際的 Google reCAPTCHA API
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: RECAPTCHA_SECRET_KEY,
        response: token,
      }),
    })

    const data = await response.json()
    return data.success === true
  } catch (error) {
    console.error("reCAPTCHA 驗證錯誤:", error)
    return false
  }
}
