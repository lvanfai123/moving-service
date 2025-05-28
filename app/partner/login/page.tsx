"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
// 移除reCAPTCHA相關的導入
// import { Recaptcha } from "@/components/recaptcha"
// import { verifyRecaptcha } from "@/app/actions/verify-recaptcha"
import { sendVerificationCode, checkVerificationCode } from "@/app/actions/twilio-actions"

export default function PartnerLoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [phone, setPhone] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  // 移除reCAPTCHA相關的狀態
  // const [recaptchaToken, setRecaptchaToken] = useState("")

  const handleSendVerificationCode = async (e: React.FormEvent) => {
    e.preventDefault()

    // 修改handleSendVerificationCode函數，移除reCAPTCHA驗證
    // reCAPTCHA驗證已暫時移除

    if (!phone || phone.length < 8) {
      toast({
        title: "請輸入有效的電話號碼",
        description: "電話號碼格式不正確",
        variant: "destructive",
      })
      return
    }

    // // 驗證 reCAPTCHA
    // const isValid = await verifyRecaptcha(recaptchaToken)

    // if (!isValid) {
    //   toast({
    //     title: "人機驗證失敗",
    //     description: "請重新完成 reCAPTCHA 驗證",
    //     variant: "destructive",
    //   })
    //   return
    // }

    // 快速登入功能
    if (phone === "12345678") {
      toast({
        title: "合作伙伴快速登入",
        description: "歡迎回來，合作伙伴！",
      })
      router.push("/partner/dashboard")
      return
    }

    // 管理員後台入口
    if (phone === "88888888") {
      toast({
        title: "管理員後台登入",
        description: "歡迎回來，管理員！",
      })
      router.push("/admin/dashboard")
      return
    }

    setIsLoading(true)

    try {
      // 使用Twilio發送驗證碼
      const formattedPhone = formatPhoneNumber(phone)
      const result = await sendVerificationCode(formattedPhone)

      if (result.success) {
        setIsVerifying(true)
        setCountdown(60)

        // 倒計時
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              return 0
            }
            return prev - 1
          })
        }, 1000)

        toast({
          title: "驗證碼已發送",
          description: "請查看您的手機短信",
        })
      } else {
        throw new Error(result.error || "發送驗證碼失敗")
      }
    } catch (error) {
      toast({
        title: "發送驗證碼失敗",
        description: error instanceof Error ? error.message : "請稍後再試",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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
        router.push("/partner/dashboard")
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

  const handleResendCode = async () => {
    if (countdown > 0) return

    setIsLoading(true)

    try {
      // 使用Twilio重新發送驗證碼
      const formattedPhone = formatPhoneNumber(phone)
      const result = await sendVerificationCode(formattedPhone)

      if (result.success) {
        setCountdown(60)

        // 倒計時
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              return 0
            }
            return prev - 1
          })
        }, 1000)

        toast({
          title: "驗證碼已重新發送",
          description: "請查看您的手機短信",
        })
      } else {
        throw new Error(result.error || "發送驗證碼失敗")
      }
    } catch (error) {
      toast({
        title: "發送驗證碼失敗",
        description: error instanceof Error ? error.message : "請稍後再試",
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
    <div className="py-12 md:py-24">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
              <Truck className="h-8 w-8 text-primary dark:text-primary-300" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tighter mb-2">搬運公司專區</h1>
          <p className="text-gray-500 dark:text-gray-400">登入您的搬運公司帳戶，管理報價和訂單</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>搬運公司登入</CardTitle>
            <CardDescription>請使用您的手機號碼登入系統</CardDescription>
          </CardHeader>
          <CardContent>
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

                {/* 移除reCAPTCHA組件 */}
                {/* <Recaptcha onVerify={(token) => setRecaptchaToken(token)} /> */}

                <Button type="submit" className="w-full bg-primary hover:bg-primary-600" disabled={isLoading}>
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
                  <div className="flex justify-between items-center">
                    <Label htmlFor="verification-code">驗證碼</Label>
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={countdown > 0 || isLoading}
                      className="text-xs text-primary hover:underline disabled:text-gray-400"
                    >
                      {countdown > 0 ? `重新發送 (${countdown}s)` : "重新發送"}
                    </button>
                  </div>
                  <Input
                    id="verification-code"
                    placeholder="請輸入驗證碼"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary-600" disabled={isLoading}>
                  {isLoading ? "登入中..." : "登入"}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
              還不是合作伙伴？
              <Link href="/partner" className="text-primary hover:underline ml-1">
                立即申請成為合作伙伴
              </Link>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              如有任何問題，請聯絡我們的客戶服務：
              <a href="tel:66668888" className="text-primary hover:underline ml-1">
                6666 8888
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
