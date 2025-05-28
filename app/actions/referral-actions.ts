"use server"

import {
  createReferralCode,
  validateReferralCode,
  createReferralRelationship,
  getReferralStats,
  getAvailableCredit,
  useReferralCredit,
  processFirstOrderReward,
} from "@/lib/referral-service"

export async function generateUserReferralCode(userId: string) {
  try {
    const referralCode = await createReferralCode(userId)
    return { success: true, code: referralCode.code }
  } catch (error) {
    console.error("生成邀請碼失敗:", error)
    return { success: false, error: "生成邀請碼失敗" }
  }
}

export async function verifyReferralCode(code: string) {
  try {
    const result = await validateReferralCode(code)
    return result
  } catch (error) {
    console.error("驗證邀請碼失敗:", error)
    return { valid: false }
  }
}

export async function registerWithReferral(referrerId: string, refereeId: string, referralCode: string) {
  try {
    const relationship = await createReferralRelationship(referrerId, refereeId, referralCode)
    return { success: true, relationshipId: relationship.id }
  } catch (error) {
    console.error("創建推薦關係失敗:", error)
    return { success: false, error: "創建推薦關係失敗" }
  }
}

export async function getUserReferralStats(userId: string) {
  try {
    const stats = await getReferralStats(userId)
    return { success: true, stats }
  } catch (error) {
    console.error("獲取推薦統計失敗:", error)
    return { success: false, error: "獲取推薦統計失敗" }
  }
}

export async function getUserAvailableCredit(userId: string) {
  try {
    const credit = await getAvailableCredit(userId)
    return { success: true, credit }
  } catch (error) {
    console.error("獲取可用抵扣金額失敗:", error)
    return { success: false, error: "獲取可用抵扣金額失敗" }
  }
}

export async function applyReferralCredit(userId: string, amount: number, orderId: string) {
  try {
    const result = await useReferralCredit(userId, amount, orderId)
    return { success: result.success, usedAmount: result.usedAmount }
  } catch (error) {
    console.error("使用抵扣金額失敗:", error)
    return { success: false, error: "使用抵扣金額失敗" }
  }
}

export async function completeFirstOrder(userId: string, orderId: string) {
  try {
    const result = await processFirstOrderReward(userId, orderId)
    return result
  } catch (error) {
    console.error("處理首次訂單獎勵失敗:", error)
    return { success: false, error: "處理首次訂單獎勵失敗" }
  }
}
