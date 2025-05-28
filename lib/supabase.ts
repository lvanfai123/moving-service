import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

// 創建客戶端實例
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 創建服務端客戶端實例（具有更高權限）
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// 創建客戶端單例（避免多次實例化）
let clientInstance = null

export const getSupabaseClient = () => {
  if (clientInstance) return clientInstance
  clientInstance = createClient(supabaseUrl, supabaseAnonKey)
  return clientInstance
}

// 創建服務端操作工具
export const getServiceSupabase = () => {
  return createClient(supabaseUrl, supabaseServiceKey)
}
