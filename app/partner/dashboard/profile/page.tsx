"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Save, Trash2, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { PartnerLogo } from "@/components/partner-logo"

export default function PartnerProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 模擬合作伙伴數據
  const [partnerData, setPartnerData] = useState({
    name: "安心搬運",
    description: "專業搬運服務，提供住宅、辦公室搬運及包裝服務",
    address: "九龍新蒲崗大有街31號善美工業大廈20樓A座21室",
    phone: "6666 8888",
    email: "info@ansum-moving.com",
    website: "https://www.ansum-moving.com",
    logo: "/partners/partner1.png",
  })

  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setLogoPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveLogo = () => {
    setLogoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPartnerData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // 模擬保存數據
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "資料已更新",
        description: "您的公司資料已成功更新",
      })

      // 如果有新的 logo，在實際應用中這裡會上傳並獲取 URL
      if (logoPreview) {
        setPartnerData((prev) => ({
          ...prev,
          logo: logoPreview,
        }))
        setLogoPreview(null)
      }
    }, 1500)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tighter">公司資料管理</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>公司 Logo</CardTitle>
              <CardDescription>上傳您的公司 logo，建議使用正方形圖片以獲得最佳效果</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  {logoPreview ? (
                    <PartnerLogo src={logoPreview} alt="預覽 Logo" size="lg" />
                  ) : (
                    <PartnerLogo src={partnerData.logo} alt={partnerData.name} size="lg" />
                  )}
                  <p className="text-sm text-gray-500">預覽</p>
                </div>

                <div className="flex flex-col gap-4 flex-1">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="logo-upload">上傳新 Logo</Label>
                    <Input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleLogoChange}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-gray-500">
                      支持 PNG, JPG, GIF 格式，最大 2MB。Logo 將以圓形方式顯示，但上傳的原始圖片不會被剪裁。
                    </p>
                  </div>

                  {logoPreview && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveLogo}
                      className="w-fit flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>移除新上傳的 Logo</span>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>基本資料</CardTitle>
              <CardDescription>更新您的公司基本資料</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">公司名稱</Label>
                <Input id="name" name="name" value={partnerData.name} onChange={handleInputChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">公司簡介</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={partnerData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">聯絡電話</Label>
                  <Input id="phone" name="phone" value={partnerData.phone} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">電郵地址</Label>
                  <Input id="email" name="email" type="email" value={partnerData.email} onChange={handleInputChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">公司地址</Label>
                <Input id="address" name="address" value={partnerData.address} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">公司網站</Label>
                <Input id="website" name="website" value={partnerData.website} onChange={handleInputChange} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" className="bg-primary hover:bg-primary-600" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-1">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    儲存中...
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Save className="h-4 w-4" />
                    儲存變更
                  </span>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  )
}
