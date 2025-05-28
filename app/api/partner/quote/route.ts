import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const cookieStore = await cookies()
    const partnerId = cookieStore.get('partnerId')?.value
    
    if (!partnerId) {
      return NextResponse.json(
        { error: '請先登入' },
        { status: 401 }
      )
    }
    
    // 建立 Supabase 客戶端
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // 準備報價資料
    const quoteData = {
      quote_request_id: body.quoteRequestId,
      partner_id: partnerId,
      basic_fee: body.basicFee,
      additional_services: body.additionalServices || {},
      discount: body.discount || 0,
      total_amount: body.totalAmount,
      available_times: body.availableTimes || [],
      remarks: body.remarks || '',
      status: 'submitted',
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7天後過期
    }
    
    // 插入報價
    const { data, error } = await supabase
      .from('quotes')
      .insert([quoteData])
      .select()
      .single()
    
    if (error) {
      console.error('Database error:', error)
      
      // 檢查是否已經提交過報價
      if (error.code === '23505') {
        return NextResponse.json(
          { error: '您已經為此需求提交過報價' },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { error: '提交失敗，請稍後再試' },
        { status: 500 }
      )
    }
    
    // 更新報價請求狀態
    await supabase
      .from('quote_requests')
      .update({ status: 'quoted' })
      .eq('id', body.quoteRequestId)
    
    return NextResponse.json({
      success: true,
      data: data,
      message: '報價已成功提交'
    })
    
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: '伺服器錯誤，請稍後再試' },
      { status: 500 }
    )
  }
} 