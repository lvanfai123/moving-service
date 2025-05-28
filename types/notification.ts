export type NotificationStatus = "pending" | "sent" | "delivered" | "failed" | "read"
export type NotificationType = "email" | "sms"

export interface NotificationRecord {
  id: string
  partnerId: string
  quoteRequestId: string
  type: NotificationType
  status: NotificationStatus
  sentAt: string
  content: string
  response: string
  error: string | null
  deliveredAt?: string
  readAt?: string
}
