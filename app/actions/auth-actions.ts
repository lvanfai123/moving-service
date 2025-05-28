"use server"

import { registerUser as registerUserService, authenticateUser, updateUserProfile as updateUserProfileService } from "@/lib/auth-service"
import { checkVerificationCode, sendVerificationCode } from "./twilio-actions"

export async function registerUser(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const whatsapp = (formData.get("whatsapp") as string) || undefined

    // Register the user using the auth service
    const result = await registerUserService({
      name,
      email,
      phone,
      whatsapp
    })

    if (!result.success) {
      return {
        success: false,
        error: result.error
      }
    }

    return {
      success: true,
      userId: result.user?.id,
      user: result.user,
      token: result.token
    }
  } catch (error) {
    console.error("註冊用戶錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "註冊過程中發生未知錯誤",
    }
  }
}

export async function verifyPhoneNumber(phone: string, code: string) {
  try {
    // Authenticate user with phone and verification code
    const result = await authenticateUser(phone, code)

    if (!result.success) {
      return {
        success: false,
        error: result.error || "驗證碼不正確",
        userExists: false
      }
    }

    return {
      success: true,
      userExists: !!result.user,
      userId: result.user?.id,
      user: result.user,
      token: result.token
    }
  } catch (error) {
    console.error("驗證電話錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "驗證過程中發生未知錯誤",
    }
  }
}

export async function updateUserProfile(
  userId: string,
  userData: { name?: string; email?: string; whatsapp?: string },
) {
  try {
    const result = await updateUserProfileService(userId, userData)

    if (!result.success) {
      return {
        success: false,
        error: result.error
      }
    }

    return {
      success: true,
      user: result.user,
    }
  } catch (error) {
    console.error("更新用戶資料錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "更新過程中發生未知錯誤",
    }
  }
}

export async function sendPhoneVerification(phone: string) {
  try {
    const result = await sendVerificationCode(phone)
    
    if (!result.success) {
      return {
        success: false,
        error: result.error || "發送驗證碼失敗"
      }
    }

    return {
      success: true
    }
  } catch (error) {
    console.error("發送驗證碼錯誤:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "發送驗證碼過程中發生未知錯誤",
    }
  }
}
