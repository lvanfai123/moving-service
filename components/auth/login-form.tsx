"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { sendVerificationCode, checkVerificationCode } from "@/app/actions/twilio-actions"

interface LoginFormProps {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [phone, setPhone] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
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

    // reCAPTCHA驗證已暫時移除

    // 管理員快速登入功能
    if (phone === "12345678") {
      setTimeout(() => {
        setIsLoading(false)
        toast({
          title: "管理員登入",
          description: "歡迎回來，管理員！",
        })
        if (onSuccess) onSuccess()
        router.push("/dashboard")
      }, 500)
      return
    }

    try {
      // 使用Twilio發送驗證碼
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

  const handleLogin = async (e: React.FormEvent) => {
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
      // 使用Twilio驗證驗證碼
      const formattedPhone = formatPhoneNumber(phone)
      const result = await checkVerificationCode(formattedPhone, verificationCode)

      if (result.success) {
        toast({
          title: "登入成功",
          description: "歡迎回來！",
        })
        if (onSuccess) onSuccess()
        router.push("/dashboard")
      } else {
        throw new Error(result.error || "驗證碼不正確")
      }
    } catch (error) {
      toast({
        title: "驗證失敗",
        description: error instanceof Error ? error.message : "請檢查驗證碼是否正確",
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "發送中..." : "發送驗證碼"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">手機號碼</Label>
            <Input id="phone" value={phone} disabled />
          </div>
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
            {isLoading ? "驗證中..." : "登入"}
          </Button>
        </form>
      )}
    </div>
  )
}
