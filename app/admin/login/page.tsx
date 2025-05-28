import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { AdminLoginForm } from "@/components/admin/login-form"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "管理員登入 | 搬屋師平台",
  description: "搬屋師平台管理員登入頁面",
}

export default function AdminLoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          <span>返回首頁</span>
        </div>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Image src="/logo.svg" alt="搬屋師 Logo" width={120} height={60} className="mx-auto" />
          <h1 className="text-2xl font-semibold tracking-tight">管理員登入</h1>
          <p className="text-sm text-muted-foreground">請輸入您的管理員帳號和密碼</p>
        </div>
        <Card>
          <CardContent className="pt-4">
            <AdminLoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
