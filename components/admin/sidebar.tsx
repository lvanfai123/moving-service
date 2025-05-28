"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Users, Truck, CreditCard, Settings, LogOut, Home, FileText, Bell, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function AdminSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button variant="outline" size="icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar for mobile and desktop */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transition-transform duration-300 ease-in-out transform lg:translate-x-0 lg:static",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="border-b p-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <Home className="h-6 w-6" />
            <span className="font-bold text-xl">搬屋師管理後台</span>
          </Link>
        </div>
        <div className="p-4 space-y-6">
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground px-3 py-2">主要功能</div>
            <nav className="flex flex-col space-y-1">
              <Link
                href="/admin/dashboard"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === "/admin/dashboard" ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                )}
                onClick={() => setIsOpen(false)}
              >
                <BarChart3 className="h-5 w-5" />
                <span>儀表板</span>
              </Link>
              <Link
                href="/admin/orders"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === "/admin/orders" || pathname.startsWith("/admin/orders/")
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground",
                )}
                onClick={() => setIsOpen(false)}
              >
                <FileText className="h-5 w-5" />
                <span>訂單管理</span>
              </Link>
              <Link
                href="/admin/users"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === "/admin/users" || pathname.startsWith("/admin/users/")
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground",
                )}
                onClick={() => setIsOpen(false)}
              >
                <Users className="h-5 w-5" />
                <span>用戶管理</span>
              </Link>
              <Link
                href="/admin/partners"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === "/admin/partners" || pathname.startsWith("/admin/partners/")
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground",
                )}
                onClick={() => setIsOpen(false)}
              >
                <Truck className="h-5 w-5" />
                <span>合作伙伴管理</span>
              </Link>
              <Link
                href="/admin/payments"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === "/admin/payments" || pathname.startsWith("/admin/payments/")
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground",
                )}
                onClick={() => setIsOpen(false)}
              >
                <CreditCard className="h-5 w-5" />
                <span>付款記錄</span>
              </Link>
              <Link
                href="/admin/notifications"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === "/admin/notifications" || pathname.startsWith("/admin/notifications/")
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground",
                )}
                onClick={() => setIsOpen(false)}
              >
                <Bell className="h-5 w-5" />
                <span>通知管理</span>
              </Link>
            </nav>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground px-3 py-2">系統設置</div>
            <nav className="flex flex-col space-y-1">
              <Link
                href="/admin/settings"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === "/admin/settings" ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                )}
                onClick={() => setIsOpen(false)}
              >
                <Settings className="h-5 w-5" />
                <span>系統設置</span>
              </Link>
            </nav>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 border-t p-4">
          <Button variant="outline" className="w-full justify-start" asChild onClick={() => setIsOpen(false)}>
            <Link href="/admin/logout">
              <LogOut className="mr-2 h-4 w-4" />
              登出
            </Link>
          </Button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsOpen(false)} aria-hidden="true" />
      )}
    </>
  )
}
