export interface ReferralCode {
  id: string
  userId: string
  code: string
  createdAt: string
  isActive: boolean
}

export interface ReferralRelationship {
  id: string
  referrerId: string
  refereeId: string
  referralCode: string
  createdAt: string
  status: "pending" | "completed" | "expired"
  rewardGranted: boolean
  firstOrderId?: string
  firstOrderDate?: string
}

export interface ReferralReward {
  id: string
  userId: string
  amount: number
  type: "referrer" | "referee"
  referralId: string
  createdAt: string
  expiresAt: string
  usedAt?: string
  usedOrderId?: string
  status: "active" | "used" | "expired"
}

export interface ReferralStats {
  totalInvited: number
  totalRegistered: number
  totalCompleted: number
  totalRewards: number
  availableCredit: number
  pendingCredit: number
}
