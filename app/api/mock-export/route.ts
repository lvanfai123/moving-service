import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const format = searchParams.get("format")

  // 模擬處理時間
  await new Promise((resolve) => setTimeout(resolve, 500))

  // 返回成功響應
  return NextResponse.json({
    success: true,
    message: `成功模擬導出${type}數據為${format}格式`,
  })
}
