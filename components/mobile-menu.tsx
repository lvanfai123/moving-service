"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, LogOut, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth/auth-provider"

export function MobileMenu() {
  const { isLoggedIn, userName, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const handleLogout = () => {
    logout()
    toast({
      title: "登出成功",
      description: "您已成功登出系統",
    })
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">打開菜單</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between border-b pb-4">
            <span className="text-lg font-medium">菜單</span>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">關閉菜單</span>
            </Button>
          </div>
          <nav className="flex flex-col gap-4 py-6">
            <Link
              href="/"
              className="text-base font-medium hover:text-primary transition-colors"
              onClick={() => setOpen(false)}
            >
              首頁
            </Link>
            <Link
              href="/partner"
              className="text-base font-medium hover:text-primary transition-colors"
              onClick={() => setOpen(false)}
            >
              成為合作伙伴
            </Link>
            <Link
              href="/promises"
              className="text-base font-medium hover:text-primary transition-colors"
              onClick={() => setOpen(false)}
            >
              服務承諾
            </Link>
            <Link
              href="/contact"
              className="text-base font-medium hover:text-primary transition-colors"
              onClick={() => setOpen(false)}
            >
              聯絡我們
            </Link>
            {isLoggedIn ? (
              <>
                <div className="border-t my-2 pt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="h-5 w-5" />
                    <p className="text-base font-medium">您好，{userName}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="text-base font-medium hover:text-primary transition-colors block mb-2"
                    onClick={() => setOpen(false)}
                  >
                    我的儀表板
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="text-base font-medium hover:text-primary transition-colors block mb-2"
                    onClick={() => setOpen(false)}
                  >
                    個人設定
                  </Link>
                  <Link
                    href="/dashboard/orders"
                    className="text-base font-medium hover:text-primary transition-colors block mb-4"
                    onClick={() => setOpen(false)}
                  >
                    我的訂單
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full text-red-600 border-red-200 hover:bg-red-50 flex items-center gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>登出</span>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="border-t my-2"></div>
                <Link
                  href="/login"
                  className="text-base font-medium hover:text-primary transition-colors"
                  onClick={() => setOpen(false)}
                >
                  會員登入 / 登記
                </Link>
                <Link
                  href="/partner/login"
                  className="text-base font-medium hover:text-primary transition-colors"
                  onClick={() => setOpen(false)}
                >
                  合作伙伴登入
                </Link>
              </>
            )}
          </nav>
          <div className="mt-auto">
            <Link href="/quote" onClick={() => setOpen(false)}>
              <Button className="w-full bg-[#17B890] hover:bg-primary-600">立即獲取報價</Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
