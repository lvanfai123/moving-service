import { supabase, supabaseAdmin } from "./supabase"
import type { User } from "@/types/user"

// 創建新用戶
export async function createUser(userData: Omit<User, "id" | "created_at" | "updated_at" | "status">) {
  try {
    const { data, error } = await supabaseAdmin.from("users").insert([userData]).select().single()

    if (error) throw error
    return { success: true, user: data }
  } catch (error) {
    console.error("創建用戶錯誤:", error)
    return { success: false, error: error.message }
  }
}

// 通過電話號碼獲取用戶
export async function getUserByPhone(phone: string) {
  try {
    const { data, error } = await supabase.from("users").select("*").eq("phone", phone).single()

    if (error && error.code !== "PGRST116") throw error // PGRST116 是未找到記錄的錯誤
    return { success: true, user: data }
  } catch (error) {
    console.error("獲取用戶錯誤:", error)
    return { success: false, error: error.message }
  }
}

// 更新用戶資料
export async function updateUser(userId: string, userData: Partial<User>) {
  try {
    const { data, error } = await supabaseAdmin.from("users").update(userData).eq("id", userId).select().single()

    if (error) throw error
    return { success: true, user: data }
  } catch (error) {
    console.error("更新用戶錯誤:", error)
    return { success: false, error: error.message }
  }
}

// 獲取用戶詳情
export async function getUserById(userId: string) {
  try {
    const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

    if (error) throw error
    return { success: true, user: data }
  } catch (error) {
    console.error("獲取用戶錯誤:", error)
    return { success: false, error: error.message }
  }
}
