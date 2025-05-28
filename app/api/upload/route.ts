import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value
    let sessionId = cookieStore.get('sessionId')?.value
    
    // 如果沒有 userId 和 sessionId，創建一個臨時 sessionId
    if (!userId && !sessionId) {
      sessionId = `temp_${Date.now()}_${Math.random().toString(36).substring(7)}`
      // 設置 sessionId cookie
      const response = NextResponse.json({ needsCookie: true, sessionId })
      response.cookies.set('sessionId', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 // 24 hours
      })
    }
    
    const uploaderId = userId || sessionId
    if (!uploaderId) {
      return NextResponse.json(
        { error: '無法識別用戶身份' },
        { status: 401 }
      )
    }
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: '請選擇要上傳的檔案' },
        { status: 400 }
      )
    }
    
    // 檢查檔案類型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '只支援 JPG, PNG, WEBP 格式的圖片' },
        { status: 400 }
      )
    }
    
    // 檢查檔案大小 (5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: '檔案大小不能超過 5MB' },
        { status: 400 }
      )
    }
    
    // 建立 Supabase 客戶端
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // 生成唯一檔名
    const timestamp = Date.now()
    const fileExt = file.name.split('.').pop()
    const fileName = `${uploaderId}/${timestamp}.${fileExt}`
    
    // 將 File 轉換為 ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // 上傳到 Supabase Storage
    const { data, error } = await supabase.storage
      .from('quote-images')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      })
    
    if (error) {
      console.error('Storage error:', error)
      return NextResponse.json(
        { error: '上傳失敗，請稍後再試' },
        { status: 500 }
      )
    }
    
    // 獲取公開 URL
    const { data: { publicUrl } } = supabase.storage
      .from('quote-images')
      .getPublicUrl(fileName)
    
    const response = NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: fileName,
      message: '上傳成功'
    })
    
    // 如果創建了新的 sessionId，設置 cookie
    if (!userId && !cookieStore.get('sessionId')?.value && sessionId) {
      response.cookies.set('sessionId', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 // 24 hours
      })
    }
    
    return response
    
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: '伺服器錯誤，請稍後再試' },
      { status: 500 }
    )
  }
}

// 刪除照片的 API
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const fileName = searchParams.get('fileName')
    
    if (!fileName) {
      return NextResponse.json(
        { error: '請提供檔案名稱' },
        { status: 400 }
      )
    }
    
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value
    const sessionId = cookieStore.get('sessionId')?.value
    const uploaderId = userId || sessionId
    
    if (!uploaderId) {
      return NextResponse.json(
        { error: '無法識別用戶身份' },
        { status: 401 }
      )
    }
    
    // 確保用戶只能刪除自己的檔案
    if (!fileName.startsWith(`${uploaderId}/`)) {
      return NextResponse.json(
        { error: '無權刪除此檔案' },
        { status: 403 }
      )
    }
    
    // 建立 Supabase 客戶端
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // 從 Storage 刪除檔案
    const { error } = await supabase.storage
      .from('quote-images')
      .remove([fileName])
    
    if (error) {
      console.error('Storage error:', error)
      return NextResponse.json(
        { error: '刪除失敗，請稍後再試' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: '刪除成功'
    })
    
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: '伺服器錯誤，請稍後再試' },
      { status: 500 }
    )
  }
} 