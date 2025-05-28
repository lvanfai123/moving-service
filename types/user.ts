export interface User {
  id: string
  name: string
  email: string
  phone: string
  whatsapp?: string
  password_hash?: string
  created_at: string
  updated_at: string
  status: "active" | "inactive" | "suspended"
}
