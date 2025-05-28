"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gift, UserCheck } from "lucide-react"
import { RegisterForm } from "@/components/auth/register-form"
import { verifyReferralCode } from "@/app/actions/referral-actions"

export default function InvitePage() {
  const params = useParams()
  const router = useRouter()
  const [isValidCode, setIsValidCode] = useState<boolean | null>(null)
  const [referrerName, setReferrerName] = useState("")
  const [referrerId, setReferrerId] = useState("")
  const code = params.code as string

  useEffect(() => {
    if (code) {
      validateCode()
    }
  }, [code])

  const validateCode = async () => {
    const result = await verifyReferralCode(code)
    setIsValidCode(result.valid)
    if (result.valid) {
      setReferrerName(result.referrerName || "")
      setReferrerId(result.referrerId || "")
    }
  }

  const handleRegistrationSuccess = () => {
    router.push("/dashboard")
  }

  if (isValidCode === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">載入中...</div>
      </div>
    )
  }

  if (!isValidCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-96">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">邀請碼無效</CardTitle>
            <CardDescription>您使用的邀請碼不存在或已失效</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-500 mb-4">請檢查邀請碼是否正確，或直接註冊使用我們的服務</p>
            <button onClick={() => router.push("/register")} className="text-blue-600 hover:underline">
              直接註冊
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-6">
        {/* 邀請信息卡片 */}
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Gift className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle>歡迎加入搬屋師！</CardTitle>
            <CardDescription>
              {referrerName && (
                <div className="flex items-center justify-center gap-2 mt-2">
                  <UserCheck className="h-4 w-4" />
                  <span>由 {referrerName} 邀請</span>
                </div>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-800 mb-2">🎉 註冊獎勵</h3>
              <p className="text-sm text-green-700">完成註冊並完成首次訂單後，您和邀請人都將獲得</p>
              <Badge className="mt-2 bg-green-600">$100 抵扣金額</Badge>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <p>
                邀請碼：<span className="font-mono font-bold">{code}</span>
              </p>
              <p>抵扣金額可用於搬運訂單的訂金支付</p>
              <p>有效期：獲得後12個月內使用</p>
            </div>
          </CardContent>
        </Card>

        {/* 註冊表單卡片 */}
        <Card>
          <CardHeader>
            <CardTitle>創建您的帳戶</CardTitle>
            <CardDescription>填寫以下信息完成註冊</CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm onSuccess={handleRegistrationSuccess} referralCode={code} referrerId={referrerId} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
