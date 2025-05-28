import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

// 生成報價請求 ID
function generateQuoteRequestId() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `Q-${year}${month}${day}-${random}`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value
    
    // 建立 Supabase 客戶端
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // 準備報價請求資料
    const quoteRequestData = {
      id: generateQuoteRequestId(),
      user_id: userId || null,
      customer_name: body.fullname,
      customer_phone: body.phone,
      customer_email: body.email,
      customer_whatsapp: body.whatsapp || body.phone,
      from_address: {
        address: body.fromAddress.address,
        building_type: body.fromAddress.buildingType,
        floor: body.fromAddress.floor,
        has_lift: body.fromAddress.hasLift,
        stairs_count: body.fromAddress.stairsCount,
        parking_distance: body.fromAddress.parkingDistance
      },
      to_address: {
        address: body.toAddress.address,
        building_type: body.toAddress.buildingType,
        floor: body.toAddress.floor,
        has_lift: body.toAddress.hasLift,
        stairs_count: body.toAddress.stairsCount,
        parking_distance: body.toAddress.parkingDistance
      },
      moving_date: body.moveDate,
      moving_time: body.moveTime,
      items: body.items || [],
      packaging_services: body.packagingServices || {},
      additional_services: body.additionalServices || {},
      special_requirements: body.specialRequirements || '',
      photos: body.photos || [],
      status: 'pending',
      notification_status: {
        email_sent: false,
        sms_sent: false,
        whatsapp_sent: false
      }
    }
    
    // 插入報價請求
    const { data, error } = await supabase
      .from('quote_requests')
      .insert([quoteRequestData])
      .select()
      .single()
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: '提交失敗，請稍後再試' },
        { status: 500 }
      )
    }
    
    // TODO: 發送通知給合作伙伴
    
    return NextResponse.json({
      success: true,
      data: data,
      message: '報價請求已成功提交',
      quoteRequestId: data.id
    })
    
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: '伺服器錯誤，請稍後再試' },
      { status: 500 }
    )
  }
} 