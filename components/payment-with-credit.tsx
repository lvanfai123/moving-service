"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Gift, DollarSign } from "lucide-react"
import { getUserAvailableCredit, applyReferralCredit } from "@/app/actions/referral-actions"
import { useToast } from "@/components/ui/use-toast"

interface PaymentWithCreditProps {
  orderId: string
  originalAmount: number
  onPaymentComplete: (finalAmount: number, usedCredit: number) => void
}

export function PaymentWithCredit({ orderId, originalAmount, onPaymentComplete }: PaymentWithCreditProps) {
  const [availableCredit, setAvailableCredit] = useState(0)
  const [useCredit, setUseCredit] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // 模擬用戶ID
  const userId = "user-123"

  useEffect(() => {
    loadAvailableCredit()
  }, [])

  const loadAvailableCredit = async () => {
    const result = await getUserAvailableCredit(userId)
    if (result.success) {
      setAvailableCredit(result.credit!)
    }
  }

  const creditToUse = useCredit ? Math.min(availableCredit, originalAmount) : 0
  const finalAmount = originalAmount - creditToUse

  const handlePayment = async () => {
    setIsLoading(true)

    try {
      let usedCredit = 0

      // 如果選擇使用抵扣金額
      if (useCredit && creditToUse > 0) {
        const creditResult = await applyReferralCredit(userId, creditToUse, orderId)
        if (creditResult.success) {
          usedCredit = creditResult.usedAmount!
          toast({
            title: "抵扣金額已使用",
            description: `已使用 $${usedCredit} 抵扣金額`,
          })
        }
      }

      // 模擬付款處理
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "付款成功",
        description: `已完成付款 $${finalAmount}`,
      })

      onPaymentComplete(finalAmount, usedCredit)
    } catch (error) {
      toast({
        title: "付款失敗",
        description: "請稍後再試",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* 抵扣金額卡片 */}
      {availableCredit > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Gift className="h-5 w-5" />
              推薦獎勵抵扣
            </CardTitle>
            <CardDescription className="text-green-700">您有可用的推薦獎勵抵扣金額</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="use-credit"
                  checked={useCredit}
                  onCheckedChange={(checked) => setUseCredit(checked as boolean)}
                />
                <label htmlFor="use-credit" className="text-sm font-medium text-green-800">
                  使用推薦獎勵抵扣
                </label>
              </div>
              <Badge className="bg-green-600">可用 ${availableCredit}</Badge>
            </div>

            {useCredit && (
              <div className="text-sm text-green-700 bg-white p-3 rounded border">
                <p>
                  本次將使用 <span className="font-bold">${creditToUse}</span> 抵扣金額
                </p>
                {creditToUse < availableCredit && (
                  <p className="text-xs mt-1">剩餘 ${availableCredit - creditToUse} 可用於下次訂單</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 付款明細卡片 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            付款明細
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>訂金金額</span>
              <span>${originalAmount}</span>
            </div>

            {useCredit && creditToUse > 0 && (
              <div className="flex justify-between text-green-600">
                <span>推薦獎勵抵扣</span>
                <span>-${creditToUse}</span>
              </div>
            )}

            <hr />

            <div className="flex justify-between font-bold text-lg">
              <span>實付金額</span>
              <span>${finalAmount}</span>
            </div>
          </div>

          <Button onClick={handlePayment} className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? "處理中..." : `確認付款 $${finalAmount}`}
          </Button>

          <p className="text-xs text-gray-500 text-center">點擊確認付款即表示您同意我們的服務條款</p>
        </CardContent>
      </Card>
    </div>
  )
}
