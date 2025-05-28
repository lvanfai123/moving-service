import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    // 測試環境變數是否正確載入
    const envCheck = {
      SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      DATABASE_URL: !!process.env.DATABASE_URL,
    }

    // 建立 Supabase 客戶端
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 測試資料庫連接 - 檢查 users 表
    const { data: usersCheck, error: usersError } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    // 測試資料庫連接 - 檢查 partners 表
    const { data: partnersCheck, error: partnersError } = await supabase
      .from('partners')
      .select('count')
      .limit(1)

    // 測試資料庫連接 - 檢查 quote_requests 表
    const { data: quotesCheck, error: quotesError } = await supabase
      .from('quote_requests')
      .select('count')
      .limit(1)

    const result = {
      status: 'success',
      timestamp: new Date().toISOString(),
      environment: {
        ...envCheck,
        NODE_ENV: process.env.NODE_ENV,
      },
      database: {
        connected: !usersError && !partnersError && !quotesError,
        tables: {
          users: usersError ? { error: usersError.message } : { status: 'OK' },
          partners: partnersError ? { error: partnersError.message } : { status: 'OK' },
          quote_requests: quotesError ? { error: quotesError.message } : { status: 'OK' },
        }
      },
      supabase: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
      }
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
} 