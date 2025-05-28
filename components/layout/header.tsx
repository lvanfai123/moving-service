"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LoginButton } from "@/components/auth/login-button"
import { Logo } from "@/components/ui/logo"
import { MobileMenu } from "@/components/mobile-menu"
import { useAuth } from "@/components/auth/auth-provider"

export function HeaderComponent() {
  const { isLoggedIn, userName } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-24 items-center justify-between">
        <Logo size="md" />
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            首頁
          </Link>
          <Link href="/partner" className="text-sm font-medium hover:text-primary transition-colors">
            成為合作伙伴
          </Link>
          <Link href="/promises" className="text-sm font-medium hover:text-primary transition-colors">
            服務承諾
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
            聯絡我們
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <LoginButton />
          {!isLoggedIn && (
            <Link href="/partner/login" className="hidden md:block">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary-50">
                合作伙伴登入
              </Button>
            </Link>
          )}
          <Link href="/quote" className="hidden md:block">
            <Button className="bg-[#17B890] hover:bg-primary-600">立即獲取報價</Button>
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
