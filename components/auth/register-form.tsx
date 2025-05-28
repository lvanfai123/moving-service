"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { sendVerificationCode } from "@/app/actions/twilio-actions"
import { registerUser, verifyPhoneNumber } from "@/app/actions/auth-actions"

interface RegisterFormProps {
  onSuccess?: () => void
  prefillPhone?: string
  referralCode?: string
  referrerId?: string
}

export function RegisterForm({ onSuccess, prefillPhone = "", referralCode, referrerId }: RegisterFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState(prefillPhone)
  const [whatsapp, setWhatsapp] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [inputReferralCode, setInputReferralCode] = useState(referralCode || "")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSendVerificationCode = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!phone || phone.length < 8) {
      toast({
        title: "請輸入有效的電話號碼",
        description: "電話號碼格式不正確",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // 管理員快速登入功能
    if (phone === "12345678") {
      setTimeout(() => {
        setIsLoading(false)
        toast({
          title: "管理員註冊",
          description: "歡迎加入，管理員！",
        })
        if (onSuccess) onSuccess()
        router.push("/dashboard")
      }, 500)
      return
    }

    try {
      // 使用Twilio發送驗證���
      const formattedPhone = formatPhoneNumber(phone)
      const result = await sendVerificationCode(formattedPhone)

      if (result.success) {
        setIsLoading(false)
        setIsVerifying(true)
        toast({
          title: "驗證碼已發送",
          description: "請查看您的手機短信",
        })
      } else {
        throw new Error(result.error || "發送驗證碼失敗")
      }
    } catch (error) {
      setIsLoading(false)
      toast({
        title: "發送驗證碼失敗",
        description: error instanceof Error ? error.message : "請稍後再試",
        variant: "destructive",
      })
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!verificationCode || verificationCode.length < 4) {
      toast({
        title: "請輸入有效的驗證碼",
        description: "驗證碼格式不正確",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // 驗證電話號碼
      const formattedPhone = formatPhoneNumber(phone)
      const verifyResult = await verifyPhoneNumber(formattedPhone, verificationCode)

      if (!verifyResult.success) {
        throw new Error(verifyResult.error || "驗證碼不正確")
      }

      // 如果用戶已存在，直接登入
      if (verifyResult.userExists) {
        toast({
          title: "登入成功",
          description: "歡迎回來！",
        })
        if (onSuccess) onSuccess()
        router.push("/dashboard")
        return
      }

      // 創建新用戶
      const formData = new FormData()
      formData.append("name", name)
      formData.append("email", email)
      formData.append("phone", formattedPhone)
      formData.append("whatsapp", whatsapp)

      const registerResult = await registerUser(formData)

      if (registerResult.success) {
        // 如果有推薦碼，創建推薦關係
        if (inputReferralCode && referrerId) {
          // 這裡可以添加創建推薦關係的代碼
          toast({
            title: "註冊成功",
            description: "歡迎加入！推薦獎勵將在您完成首次訂單後發放。",
          })
        } else {
          toast({
            title: "註冊成功",
            description: "歡迎加入！",
          })
        }

        if (onSuccess) onSuccess()
        router.push("/dashboard")
      } else {
        throw new Error(registerResult.error || "註冊失敗")
      }
    } catch (error) {
      toast({
        title: "註冊失敗",
        description: error instanceof Error ? error.message : "請檢查您的資料是否正確",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 格式化電話號碼為國際格式 (+852)
  const formatPhoneNumber = (phoneNumber: string): string => {
    // 移除所有非數字字符
    const digits = phoneNumber.replace(/\D/g, "")

    // 如果已經有國際區號，直接返回
    if (digits.startsWith("852")) {
      return `+${digits}`
    }

    // 否則添加香港區號
    return `+852${digits}`
  }

  return (
    <div className="grid gap-4 py-4">
      {!isVerifying ? (
        <form onSubmit={handleSendVerificationCode} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">姓名</Label>
            <Input id="name" placeholder="請輸入姓名" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">電郵</Label>
            <Input
              id="email"
              type="email"
              placeholder="請輸入電郵"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">手機號碼</Label>
            <Input
              id="phone"
              placeholder="請輸入手機號碼"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500">我們將發送驗證碼至此號碼</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp號碼</Label>
            <Input
              id="whatsapp"
              placeholder="請輸入WhatsApp號碼（可選）"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
            <p className="text-xs text-gray-500">用於接收搬運相關通知</p>
          </div>

          {/* 邀請碼輸入框 */}
          {!referralCode && (
            <div className="space-y-2">
              <Label htmlFor="referral-code">邀請碼（可選）</Label>
              <Input
                id="referral-code"
                placeholder="請輸入邀請碼"
                value={inputReferralCode}
                onChange={(e) => setInputReferralCode(e.target.value.toUpperCase())}
              />
              <p className="text-xs text-gray-500">有邀請碼？輸入後雙方都能獲得 $100 抵扣金額</p>
            </div>
          )}

          {/* 顯示已有的邀請碼 */}
          {referralCode && (
            <div className="space-y-2">
              <Label>邀請碼</Label>
              <Input value={referralCode} disabled className="bg-green-50 border-green-200" />
              <p className="text-xs text-green-600">✓ 使用邀請碼註冊，完成首次訂單後雙方各獲得 $100 抵扣金額</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "發送中..." : "發送驗證碼"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">姓名</Label>
            <Input id="name" value={name} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">電郵</Label>
            <Input id="email" value={email} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">手機號碼</Label>
            <Input id="phone" value={phone} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp號碼</Label>
            <Input id="whatsapp" value={whatsapp} disabled />
          </div>

          {/* 顯示邀請碼信息 */}
          {(referralCode || inputReferralCode) && (
            <div className="space-y-2">
              <Label>邀請碼</Label>
              <Input value={referralCode || inputReferralCode} disabled className="bg-green-50 border-green-200" />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="verification-code">驗證碼</Label>
            <Input
              id="verification-code"
              placeholder="請輸入驗證碼"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "驗證中..." : "註冊"}
          </Button>
        </form>
      )}
    </div>
  )
}
