"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, MessageSquare, AlertTriangle, RefreshCw } from "lucide-react"
import { sendQuoteRequestNotifications, resendFailedNotifications } from "@/app/actions/notification-actions"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

interface NotificationStatusProps {
  quoteRequestId: string
  notificationStatus?: {
    email: {
      total: number
      sent: number
      failed: number
    }
    sms: {
      total: number
      sent: number
      failed: number
    }
  }
  onStatusChange?: () => void
}

export function NotificationStatus({ quoteRequestId, notificationStatus, onStatusChange }: NotificationStatusProps) {
  const [isSending, setIsSending] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const hasNotifications =
    notificationStatus && (notificationStatus.email.total > 0 || notificationStatus.sms.total > 0)

  const hasFailedNotifications =
    notificationStatus && (notificationStatus.email.failed > 0 || notificationStatus.sms.failed > 0)

  const handleSendNotifications = async () => {
    setIsSending(true)
    try {
      const result = await sendQuoteRequestNotifications(quoteRequestId)

      if (result.success) {
        toast({
          title: "通知發送成功",
          description: `已成功發送 ${result.emailSent} 封電子郵件和 ${result.smsSent} 條短信。`,
        })
        if (onStatusChange) onStatusChange()
      } else {
        toast({
          title: "通知發送失敗",
          description: result.error || "發送通知時發生錯誤。",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "通知發送失敗",
        description: "發送通知時發生未知錯誤。",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleResendFailedNotifications = async () => {
    setIsResending(true)
    try {
      const result = await resendFailedNotifications(quoteRequestId)

      if (result.success) {
        toast({
          title: "重新發送成功",
          description: `已成功重新發送 ${result.emailSent} 封電子郵件和 ${result.smsSent} 條短信。`,
        })
        if (onStatusChange) onStatusChange()
      } else {
        toast({
          title: "重新發送失敗",
          description: result.error || "重新發送通知時發生錯誤。",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "重新發送失敗",
        description: "重新發送通知時發生未知錯誤。",
        variant: "destructive",
      })
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Mail className="mr-2 h-5 w-5" />
          通知狀態
        </CardTitle>
        <CardDescription>報價請求通知發送狀態</CardDescription>
      </CardHeader>
      <CardContent>
        {!hasNotifications ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
            <h3 className="text-lg font-medium">尚未發送通知</h3>
            <p className="text-sm text-gray-500 mt-2">此報價請求尚未向搬運公司發送通知。</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                <span>電子郵件</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">總計: {notificationStatus?.email.total || 0}</Badge>
                <Badge variant="default" className="bg-green-500">
                  成功: {notificationStatus?.email.sent || 0}
                </Badge>
                {notificationStatus?.email.failed ? (
                  <Badge variant="destructive">失敗: {notificationStatus?.email.failed}</Badge>
                ) : null}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                <span>短信</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">總計: {notificationStatus?.sms.total || 0}</Badge>
                <Badge variant="default" className="bg-green-500">
                  成功: {notificationStatus?.sms.sent || 0}
                </Badge>
                {notificationStatus?.sms.failed ? (
                  <Badge variant="destructive">失敗: {notificationStatus?.sms.failed}</Badge>
                ) : null}
              </div>
            </div>

            {hasFailedNotifications && (
              <div className="mt-4 rounded-md bg-yellow-50 p-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">部分通知發送失敗</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        有 {notificationStatus?.email.failed || 0} 封電子郵件和 {notificationStatus?.sms.failed || 0}{" "}
                        條短信發送失敗。 您可以嘗試重新發送失敗的通知。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {!hasNotifications ? (
          <Button onClick={handleSendNotifications} disabled={isSending} className="w-full">
            {isSending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                發送中...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                發送通知給搬運公司
              </>
            )}
          </Button>
        ) : (
          <>
            <Button variant="outline" onClick={handleSendNotifications} disabled={isSending}>
              {isSending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  發送中...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  重新發送所有
                </>
              )}
            </Button>

            {hasFailedNotifications && (
              <Button variant="secondary" onClick={handleResendFailedNotifications} disabled={isResending}>
                {isResending ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    重新發送中...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    重新發送失敗項
                  </>
                )}
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  )
}
