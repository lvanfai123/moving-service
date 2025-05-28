import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // 建立 Supabase 客戶端
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // 準備資料
    const partnerData = {
      name: body.companyName,
      contact_person: body.contactPerson,
      email: body.email,
      phone: body.phone,
      business_registration_number: body.businessRegistration,
      service_areas: body.serviceAreas ? [body.serviceAreas] : [],
      business_hours: body.businessHours,
      description: body.companyDescription,
      introduction: body.referral,
      status: 'pending' // 新申請默認為待審核狀態
    }
    
    // 插入資料到 partners 表
    const { data, error } = await supabase
      .from('partners')
      .insert([partnerData])
      .select()
      .single()
    
    if (error) {
      console.error('Database error:', error)
      
      // 檢查是否是重複的 email
      if (error.code === '23505' && error.message.includes('email')) {
        return NextResponse.json(
          { error: '此電郵已被使用' },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { error: '申請提交失敗，請稍後再試' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: '申請已成功提交，我們將盡快與您聯絡',
      data: data
    })
    
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: '伺服器錯誤，請稍後再試' },
      { status: 500 }
    )
  }
} 