export interface Partner {
  id: string
  name: string
  contact_person: string
  email: string
  phone: string
  whatsapp?: string
  password_hash?: string
  logo_url?: string
  description?: string
  service_areas?: string[]
  businessRegistrationNumber: string
  introduction: string
  businessHours: string
  rating: number
  total_reviews: number
  total_orders: number
  createdAt: string
  updated_at: string
  status: "active" | "inactive" | "pending"
}
