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
import { Recaptcha } from "@/components/recaptcha"
import { verifyRecaptcha } from "@/app/actions/verify-recaptcha"

export function AddPartnerForm() {
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
      title: "合作伙伴添加成功",
      description: "新的合作伙伴已成功添加到系統中",
      action: (
        <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
          <Check className="h-4 w-4 text-white" />
        </div>
      ),
    })

    // 重新加載頁面以顯示新添加的合作伙伴
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-500 hover:bg-green-600">
          <span className="mr-2">+</span> 新增合作伙伴
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>合作伙伴申請表格</DialogTitle>
          <DialogDescription>請填寫以下資料，我們將盡快與您聯絡</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 表單內容保持不變，只在底部添加 reCAPTCHA */}

          {/* 省略原有表單內容... */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">公司名稱</Label>
              <Input id="company-name" placeholder="請輸入公司名稱" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-person">聯絡人</Label>
              <Input id="contact-person" placeholder="請輸入聯絡人姓名" required />
            </div>
          </div>

          {/* 其他表單字段... */}

          {/* 添加 reCAPTCHA */}
          <div className="flex justify-center">
            <Recaptcha onVerify={(token) => setRecaptchaToken(token)} />
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
                "提交申請"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
