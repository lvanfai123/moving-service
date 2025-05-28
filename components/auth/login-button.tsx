"use client"

import { useState } from "react"
import Link from "next/link"
import { User, LogIn, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth/auth-provider"

export function LoginButton() {
  const { isLoggedIn, userName, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const handleLogout = () => {
    logout()
    toast({
      title: "登出成功",
      description: "您已成功登出系統",
    })
  }

  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-2">
        {/* 用戶下拉菜單 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{userName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href="/dashboard">
              <DropdownMenuItem>
                <span>我的儀表板</span>
              </DropdownMenuItem>
            </Link>
            <Link href="/dashboard/settings">
              <DropdownMenuItem>
                <span>個人設定</span>
              </DropdownMenuItem>
            </Link>
            <Link href="/dashboard/orders">
              <DropdownMenuItem>
                <span>我的訂單</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              <span>登出</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 登出按鈕 */}
        <Button
          variant="outline"
          onClick={handleLogout}
          className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">登出</span>
        </Button>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <LogIn className="h-4 w-4" />
          <span>登入 / 登記</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>會員登入 / 登記</DialogTitle>
          <DialogDescription>登入或登記成為會員，以獲取搬運報價</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">登入</TabsTrigger>
            <TabsTrigger value="register">登記</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm onSuccess={() => setOpen(false)} />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm onSuccess={() => setOpen(false)} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
