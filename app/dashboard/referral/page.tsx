"use client"

import { useState, useEffect } from "react"
import { Copy, Share2, Users, Gift, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { generateUserReferralCode, getUserReferralStats } from "@/app/actions/referral-actions"
import type { ReferralStats } from "@/types/referral"

export default function ReferralPage() {
  const [referralCode, setReferralCode] = useState("")
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // 模擬用戶ID
  const userId = "user-123"

  useEffect(() => {
    loadReferralData()
  }, [])

  const loadReferralData = async () => {
    setIsLoading(true)

    // 獲取或生成邀請碼
    const codeResult = await generateUserReferralCode(userId)
    if (codeResult.success) {
      setReferralCode(codeResult.code!)
    }

    // 獲取推薦統計
    const statsResult = await getUserReferralStats(userId)
    if (statsResult.success) {
      setStats(statsResult.stats!)
    }

    setIsLoading(false)
  }

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode)
    toast({
      title: "已複製邀請碼",
      description: "邀請碼已複製到剪貼板",
    })
  }

  const copyReferralLink = () => {
    const link = `${window.location.origin}/invite/${referralCode}`
    navigator.clipboard.writeText(link)
    toast({
      title: "已複製邀請鏈接",
      description: "邀請鏈接已複製到剪貼板",
    })
  }

  const shareViaWhatsApp = () => {
    const message = `🏠 推薦您使用搬屋師專業搬運服務！\n\n使用我的邀請碼 ${referralCode}，我們都能獲得 $100 抵扣金額！\n\n立即註冊：${window.location.origin}/invite/${referralCode}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const shareViaEmail = () => {
    const subject = "推薦您使用搬屋師專業搬運服務"
    const body = `您好！\n\n我想推薦您使用搬屋師的專業搬運服務。他們提供快速報價配對，讓您輕鬆找到最合適的搬運公司。\n\n使用我的邀請碼 ${referralCode}，我們都能獲得 $100 的抵扣金額！\n\n立即註冊：${window.location.origin}/invite/${referralCode}\n\n謝謝！`
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoUrl)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">載入中...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tighter">推薦朋友</h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            邀請朋友使用搬屋師服務，雙方都能獲得 $100 抵扣金額！
          </p>
        </div>

        {/* 邀請碼卡片 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              我的邀請碼
            </CardTitle>
            <CardDescription>分享您的專屬邀請碼，朋友註冊並完成首次訂單後，雙方各獲得 $100 抵扣金額</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="referral-code">邀請碼</Label>
              <div className="flex gap-2">
                <Input
                  id="referral-code"
                  value={referralCode}
                  readOnly
                  className="font-mono text-lg font-bold text-center"
                />
                <Button onClick={copyReferralCode} variant="outline">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="referral-link">邀請鏈接</Label>
              <div className="flex gap-2">
                <Input
                  id="referral-link"
                  value={`${window.location.origin}/invite/${referralCode}`}
                  readOnly
                  className="text-sm"
                />
                <Button onClick={copyReferralLink} variant="outline">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-4">
              <Button onClick={shareViaWhatsApp} className="bg-green-600 hover:bg-green-700">
                WhatsApp 分享
              </Button>
              <Button onClick={shareViaEmail} variant="outline">
                電郵分享
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 統計卡片 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">已邀請人數</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalInvited || 0}</div>
              <p className="text-xs text-muted-foreground">累計邀請朋友數量</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">成功註冊</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalRegistered || 0}</div>
              <p className="text-xs text-muted-foreground">朋友成功註冊數量</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">完成訂單</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalCompleted || 0}</div>
              <p className="text-xs text-muted-foreground">朋友完成首次訂單數量</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">可用抵扣</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats?.availableCredit || 0}</div>
              <p className="text-xs text-muted-foreground">可用於訂單抵扣</p>
            </CardContent>
          </Card>
        </div>

        {/* 推薦規則 */}
        <Card>
          <CardHeader>
            <CardTitle>推薦規則</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium">如何獲得獎勵？</h4>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• 分享您的邀請碼給朋友</li>
                  <li>• 朋友使用邀請碼註冊</li>
                  <li>• 朋友完成首次訂單並付款</li>
                  <li>• 雙方各獲得 $100 抵扣金額</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">使用限制</h4>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• 抵扣金額有效期為12個月</li>
                  <li>• 只能用於搬運訂單的訂金支付</li>
                  <li>• 每筆訂單最多使用一次抵扣</li>
                  <li>• 不能提現或轉讓</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
