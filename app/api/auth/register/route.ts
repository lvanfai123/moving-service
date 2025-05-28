import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // 建立 Supabase 客戶端
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // 檢查用戶是否已存在
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('phone', body.phone)
      .single()
    
    if (existingUser) {
      return NextResponse.json(
        { error: '此電話號碼已被註冊' },
        { status: 400 }
      )
    }
    
    // 創建新用戶
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{
        name: body.name,
        email: body.email,
        phone: body.phone,
        whatsapp: body.whatsapp || body.phone,
        status: 'active'
      }])
      .select()
      .single()
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: '註冊失敗，請稍後再試' },
        { status: 500 }
      )
    }
    
    // 創建響應並設置 cookie
    const response = NextResponse.json({
      success: true,
      user: newUser,
      message: '註冊成功'
    })
    
    // 設置 session cookie
    response.cookies.set('userId', newUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    
    return response
    
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: '伺服器錯誤，請稍後再試' },
      { status: 500 }
    )
  }
} 