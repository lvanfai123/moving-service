"use client"

import type React from "react"

import { useState } from "react"
import { Check, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Recaptcha } from "@/components/recaptcha"
import { verifyRecaptcha } from "@/app/actions/verify-recaptcha"

export function AddUserForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [recaptchaToken, setRecaptchaToken] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!recaptchaToken) {
      toast({
        title: "請完成人機驗證",
        description: "請先完成 reCAPTCHA 驗證",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // 驗證 reCAPTCHA
    const isValid = await verifyRecaptcha(recaptchaToken)

    if (!isValid) {
      setIsLoading(false)
      toast({
        title: "人機驗證失敗",
        description: "請重新完成 reCAPTCHA 驗證",
        variant: "destructive",
      })
      return
    }

    // 模擬API請求
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    setOpen(false)

    toast({
      title: "用戶添加成功",
      description: "新的用戶已成功添加到系統中",
      action: (
        <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
          <Check className="h-4 w-4 text-white" />
        </div>
      ),
    })

    // 重新加載頁面以顯示新添加的用戶
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-500 hover:bg-green-600">
          <span className="mr-2">+</span> 新增用戶
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>新增用戶</DialogTitle>
          <DialogDescription>填寫以下信息以添加新的用戶到平台</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                姓名
              </Label>
              <Input id="name" placeholder="輸入用戶姓名" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                電郵
              </Label>
              <Input id="email" type="email" placeholder="輸入電郵地址" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                電話
              </Label>
              <Input id="phone" placeholder="輸入聯絡電話" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                密碼
              </Label>
              <Input id="password" type="password" placeholder="設置初始密碼" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                狀態
              </Label>
              <Select defaultValue="active">
                <SelectTrigger id="status" className="col-span-3">
                  <SelectValue placeholder="選擇用戶狀態" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">活躍</SelectItem>
                  <SelectItem value="inactive">非活躍</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 添加 reCAPTCHA */}
            <div className="col-span-4 flex justify-center">
              <Recaptcha onVerify={(token) => setRecaptchaToken(token)} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  處理中...
                </>
              ) : (
                "確認添加"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
