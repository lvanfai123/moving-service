import type { ReferralCode, ReferralRelationship, ReferralReward, ReferralStats } from "@/types/referral"

// 模擬數據存儲
const referralCodes: ReferralCode[] = []
const referralRelationships: ReferralRelationship[] = []
const referralRewards: ReferralReward[] = []

/**
 * 生成邀請碼
 */
export function generateReferralCode(userId: string): string {
  const year = new Date().getFullYear()
  const randomChars = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `MOVE${year}${randomChars}`
}

/**
 * 為用戶創建邀請碼
 */
export async function createReferralCode(userId: string): Promise<ReferralCode> {
  // 檢查用戶是否已有邀請碼
  const existingCode = referralCodes.find((code) => code.userId === userId && code.isActive)
  if (existingCode) {
    return existingCode
  }

  // 生成新的邀請碼
  let code: string
  let isUnique = false

  do {
    code = generateReferralCode(userId)
    isUnique = !referralCodes.some((rc) => rc.code === code)
  } while (!isUnique)

  const referralCode: ReferralCode = {
    id: `rc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    userId,
    code,
    createdAt: new Date().toISOString(),
    isActive: true,
  }

  referralCodes.push(referralCode)
  return referralCode
}

/**
 * 驗證邀請碼
 */
export async function validateReferralCode(
  code: string,
): Promise<{ valid: boolean; referrerId?: string; referrerName?: string }> {
  const referralCode = referralCodes.find((rc) => rc.code.toLowerCase() === code.toLowerCase() && rc.isActive)

  if (!referralCode) {
    return { valid: false }
  }

  // 在實際應用中，這裡會查詢用戶數據庫獲取推薦者信息
  const referrerName = "推薦用戶" // 模擬數據

  return {
    valid: true,
    referrerId: referralCode.userId,
    referrerName,
  }
}

/**
 * 創建推薦關係
 */
export async function createReferralRelationship(
  referrerId: string,
  refereeId: string,
  referralCode: string,
): Promise<ReferralRelationship> {
  const relationship: ReferralRelationship = {
    id: `rr-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    referrerId,
    refereeId,
    referralCode,
    createdAt: new Date().toISOString(),
    status: "pending",
    rewardGranted: false,
  }

  referralRelationships.push(relationship)
  return relationship
}

/**
 * 處理首次訂單完成，發放獎勵
 */
export async function processFirstOrderReward(
  userId: string,
  orderId: string,
): Promise<{ success: boolean; rewards?: ReferralReward[] }> {
  // 查找該用戶作為被推薦人的關係
  const relationship = referralRelationships.find(
    (rr) => rr.refereeId === userId && rr.status === "pending" && !rr.rewardGranted,
  )

  if (!relationship) {
    return { success: false }
  }

  // 更新推薦關係狀態
  relationship.status = "completed"
  relationship.rewardGranted = true
  relationship.firstOrderId = orderId
  relationship.firstOrderDate = new Date().toISOString()

  // 創建獎勵記錄
  const expiresAt = new Date()
  expiresAt.setFullYear(expiresAt.getFullYear() + 1) // 1年有效期

  const referrerReward: ReferralReward = {
    id: `rw-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    userId: relationship.referrerId,
    amount: 100,
    type: "referrer",
    referralId: relationship.id,
    createdAt: new Date().toISOString(),
    expiresAt: expiresAt.toISOString(),
    status: "active",
  }

  const refereeReward: ReferralReward = {
    id: `rw-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    userId: relationship.refereeId,
    amount: 100,
    type: "referee",
    referralId: relationship.id,
    createdAt: new Date().toISOString(),
    expiresAt: expiresAt.toISOString(),
    status: "active",
  }

  referralRewards.push(referrerReward, refereeReward)

  return {
    success: true,
    rewards: [referrerReward, refereeReward],
  }
}

/**
 * 獲取用戶的推薦統計
 */
export async function getReferralStats(userId: string): Promise<ReferralStats> {
  const userRelationships = referralRelationships.filter((rr) => rr.referrerId === userId)
  const userRewards = referralRewards.filter((rw) => rw.userId === userId)

  const totalInvited = userRelationships.length
  const totalRegistered = userRelationships.length // 在這個簡化版本中，創建關係就表示已註冊
  const totalCompleted = userRelationships.filter((rr) => rr.status === "completed").length
  const totalRewards = userRewards.filter((rw) => rw.status === "active").reduce((sum, rw) => sum + rw.amount, 0)
  const availableCredit = userRewards.filter((rw) => rw.status === "active").reduce((sum, rw) => sum + rw.amount, 0)
  const pendingCredit = userRewards
    .filter((rw) => rw.status === "active" && !rw.usedAt)
    .reduce((sum, rw) => sum + rw.amount, 0)

  return {
    totalInvited,
    totalRegistered,
    totalCompleted,
    totalRewards,
    availableCredit,
    pendingCredit,
  }
}

/**
 * 使用抵扣金額
 */
export async function useReferralCredit(
  userId: string,
  amount: number,
  orderId: string,
): Promise<{ success: boolean; usedAmount: number }> {
  const availableRewards = referralRewards
    .filter((rw) => rw.userId === userId && rw.status === "active" && !rw.usedAt)
    .sort((a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime()) // 按到期時間排序

  let remainingAmount = amount
  let usedAmount = 0

  for (const reward of availableRewards) {
    if (remainingAmount <= 0) break

    const useAmount = Math.min(remainingAmount, reward.amount)

    // 標記為已使用
    reward.status = "used"
    reward.usedAt = new Date().toISOString()
    reward.usedOrderId = orderId

    remainingAmount -= useAmount
    usedAmount += useAmount
  }

  return {
    success: usedAmount > 0,
    usedAmount,
  }
}

/**
 * 獲取用戶可用的抵扣金額
 */
export async function getAvailableCredit(userId: string): Promise<number> {
  return referralRewards
    .filter((rw) => rw.userId === userId && rw.status === "active" && !rw.usedAt)
    .reduce((sum, rw) => sum + rw.amount, 0)
}
