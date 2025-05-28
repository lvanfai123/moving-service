export interface Quote {
  id: string
  quote_request_id: string
  partner_id: string
  basic_fee: number
  additional_services?: {
    disposalService?: number
    storageService?: number
    furnitureAssembly?: number
    governmentDisposalFee?: number
    packaging?: number
  }
  discount: number
  total_amount: number
  available_times: Array<{
    date: string
    time: string
  }>
  remarks?: string
  created_at: string
  updated_at: string
  status: "pending" | "submitted" | "accepted" | "rejected" | "expired"
  expires_at?: string
}

export interface QuoteRequest {
  id: string
  user_id?: string
  customer_name: string
  customer_phone: string
  customer_email: string
  customer_whatsapp?: string
  from_address: any // JSONB
  to_address: any // JSONB
  moving_date: string
  moving_time: string
  items: any // JSONB
  packaging_services?: any // JSONB
  additional_services?: any // JSONB
  special_requirements?: string
  photos?: string[]
  created_at: string
  updated_at: string
  status: "pending" | "sent" | "quoted" | "accepted" | "completed" | "cancelled"
  notification_status?: any // JSONB
} 