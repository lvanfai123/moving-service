import { supabase, supabaseAdmin } from './supabase'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { checkVerificationCode } from '@/app/actions/twilio-actions'

interface AuthUser {
  id: string
  name: string
  email: string
  phone: string
  whatsapp?: string
  status: string
}

interface AuthResult {
  success: boolean
  user?: AuthUser
  error?: string
  token?: string
}

// Authenticate user with phone and verification code
export async function authenticateUser(phone: string, verificationCode: string): Promise<AuthResult> {
  try {
    // 1. Verify SMS code with Twilio
    const verificationResult = await checkVerificationCode(phone, verificationCode)
    
    if (!verificationResult.success) {
      return {
        success: false,
        error: '驗證碼不正確或已過期'
      }
    }

    // 2. Check if user exists in database
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Database error:', fetchError)
      return {
        success: false,
        error: '系統錯誤，請稍後再試'
      }
    }

    let user: AuthUser

    if (existingUser) {
      // User exists, return their data
      user = {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        phone: existingUser.phone,
        whatsapp: existingUser.whatsapp,
        status: existingUser.status
      }
    } else {
      // User doesn't exist, create a temporary user record
      // They will need to complete registration
      return {
        success: true,
        user: undefined,
        error: '請先完成註冊'
      }
    }

    // 3. Create session token
    const token = await createUserSession(user.id)

    return {
      success: true,
      user,
      token
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return {
      success: false,
      error: '認證過程中發生錯誤'
    }
  }
}

// Create user session (JWT token)
export async function createUserSession(userId: string): Promise<string> {
  const payload = {
    userId,
    iat: Date.now(),
    exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
  }

  const secret = process.env.SUPABASE_JWT_SECRET || 'your-secret-key'
  return jwt.sign(payload, secret)
}

// Validate session token
export async function validateSession(token: string): Promise<{ valid: boolean; userId?: string }> {
  try {
    const secret = process.env.SUPABASE_JWT_SECRET || 'your-secret-key'
    const decoded = jwt.verify(token, secret) as any

    if (decoded.exp < Date.now()) {
      return { valid: false }
    }

    return {
      valid: true,
      userId: decoded.userId
    }
  } catch (error) {
    return { valid: false }
  }
}

// Get current user from session
export async function getCurrentUser(token: string): Promise<AuthUser | null> {
  const session = await validateSession(token)
  
  if (!session.valid || !session.userId) {
    return null
  }

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', session.userId)
    .single()

  if (error || !user) {
    return null
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    whatsapp: user.whatsapp,
    status: user.status
  }
}

// Register new user
export async function registerUser(userData: {
  name: string
  email: string
  phone: string
  whatsapp?: string
  password?: string
}): Promise<AuthResult> {
  try {
    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('phone', userData.phone)
      .single()

    if (existingUser) {
      return {
        success: false,
        error: '此電話號碼已被註冊'
      }
    }

    // Hash password if provided
    let passwordHash = null
    if (userData.password) {
      passwordHash = await bcrypt.hash(userData.password, 10)
    }

    // Create new user
    const { data: newUser, error: insertError } = await supabaseAdmin
      .from('users')
      .insert({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        whatsapp: userData.whatsapp,
        password_hash: passwordHash,
        status: 'active'
      })
      .select()
      .single()

    if (insertError) {
      console.error('Insert error:', insertError)
      return {
        success: false,
        error: '創建用戶失敗'
      }
    }

    const user: AuthUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      whatsapp: newUser.whatsapp,
      status: newUser.status
    }

    const token = await createUserSession(user.id)

    return {
      success: true,
      user,
      token
    }
  } catch (error) {
    console.error('Registration error:', error)
    return {
      success: false,
      error: '註冊過程中發生錯誤'
    }
  }
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  updates: Partial<{
    name: string
    email: string
    whatsapp: string
  }>
): Promise<AuthResult> {
  try {
    const { data: updatedUser, error } = await supabaseAdmin
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Update error:', error)
      return {
        success: false,
        error: '更新用戶資料失敗'
      }
    }

    const user: AuthUser = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      whatsapp: updatedUser.whatsapp,
      status: updatedUser.status
    }

    return {
      success: true,
      user
    }
  } catch (error) {
    console.error('Update profile error:', error)
    return {
      success: false,
      error: '更新過程中發生錯誤'
    }
  }
}

// Logout user (client-side token removal)
export async function logoutUser(): Promise<void> {
  // Token removal should be handled on the client side
  // This function can be used for any server-side cleanup if needed
  return Promise.resolve()
} 