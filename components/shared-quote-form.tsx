"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Camera, Info, Upload } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import { EnhancedItemSelector } from "@/components/enhanced-item-selector"
import { AddressDetailsComponent } from "@/components/address-details"
import { PackagingServices } from "@/components/packaging-services"
import type { QuoteRequestItem, PackagingService, AdditionalService, AddressDetails } from "@/types/quote-request"

interface SharedQuoteFormProps {
  showTitle?: boolean
  redirectPath?: string
  containerClassName?: string
  submitButtonText?: string
  showCard?: boolean
  title?: string
  description?: string
}

export function SharedQuoteForm({
  showTitle = true,
  redirectPath = "/quote/submit",
  containerClassName = "",
  submitButtonText = "提交需求",
  showCard = true,
  title = "搬運需求表格",
  description = "請填寫您的搬運需求詳情，以獲取最準確的報價",
}: SharedQuoteFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [phone, setPhone] = useState("")
  const [hasStairs, setHasStairs] = useState("no")
  const [itemPhotos, setItemPhotos] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showStairsCount, setShowStairsCount] = useState(false)
  const [items, setItems] = useState<QuoteRequestItem[]>([])
  const [fromAddress, setFromAddress] = useState<AddressDetails>({
    address: "",
    buildingType: "ground_floor",
  })
  const [toAddress, setToAddress] = useState<AddressDetails>({
    address: "",
    buildingType: "ground_floor",
  })
  const [packagingServices, setPackagingServices] = useState<PackagingService>({
    boxes: { needed: false, quantity: 0 },
    bubbleWrap: { needed: false, quantity: 0 },
  })
  const [additionalServices, setAdditionalServices] = useState<AdditionalService>({
    disposalService: false,
    storageService: false,
    furnitureAssembly: false,
    governmentDisposalFee: false,
  })
  const [specialPackaging, setSpecialPackaging] = useState("")

  // 使用useEffect來監聽hasStairs的變化
  useEffect(() => {
    console.log("hasStairs狀態變更為:", hasStairs)
    setShowStairsCount(hasStairs === "yes")
  }, [hasStairs])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 收集表單資料
      const formElement = e.target as HTMLFormElement
      const formData = new FormData(formElement)
      
      const requestData = {
        fullname: formData.get('fullname'),
        phone: phone,
        email: formData.get('email'),
        whatsapp: formData.get('whatsapp') || phone,
        fromAddress: fromAddress,
        toAddress: toAddress,
        moveDate: formData.get('move-date'),
        moveTime: formData.get('move-time'),
        items: items,
        packagingServices: packagingServices,
        additionalServices: additionalServices,
        specialRequirements: formData.get('special-requirements'),
        photos: [] // TODO: 實現照片上傳
      }

      // 提交到 API
      const response = await fetch('/api/quote-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '提交失敗')
      }

      toast({
        title: "提交成功",
        description: "您的搬運需求已成功提交，我們將盡快為您安排報價。",
      })

      // 重定向到提交成功頁面
      router.push(`${redirectPath}?phone=${encodeURIComponent(phone)}&quoteId=${result.quoteRequestId}`)
    } catch (error) {
      toast({
        title: "提交失敗",
        description: error instanceof Error ? error.message : "請稍後再試",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhotos = Array.from(e.target.files)
      setItemPhotos((prev) => [...prev, ...newPhotos])
    }
  }

  const removePhoto = (index: number) => {
    setItemPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  // 直接處理原生radio按鈕的變更
  const handleStairsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    console.log("Radio按鈕變更為:", value)
    setHasStairs(value)
  }

  const FormContent = () => (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullname">姓名</Label>
          <Input id="fullname" placeholder="請輸入姓名" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">電話</Label>
          <Input
            id="phone"
            placeholder="請輸入電話"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">電郵</Label>
        <Input id="email" type="email" placeholder="請輸入電郵" required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AddressDetailsComponent label="搬出地址" address={fromAddress} onAddressChange={setFromAddress} />
        <AddressDetailsComponent label="搬入地址" address={toAddress} onAddressChange={setToAddress} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="move-date">搬運日期</Label>
          <Input id="move-date" type="date" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="move-time">搬運時間</Label>
          <Input id="move-time" type="time" required />
        </div>
      </div>

      <EnhancedItemSelector items={items} onItemsChange={setItems} />

      <PackagingServices
        packagingServices={packagingServices}
        additionalServices={additionalServices}
        onPackagingChange={setPackagingServices}
        onAdditionalChange={setAdditionalServices}
        specialPackaging={specialPackaging}
        onSpecialPackagingChange={setSpecialPackaging}
      />

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Label className="text-base font-medium">上傳物品照片</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-gray-500 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                上傳物品照片可以幫助搬運公司更準確地評估搬運難度和所需時間，從而提供更精確的報價。
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="bg-tertiary-50 dark:bg-gray-900 p-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
          <div className="space-y-4">
            <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
              <p className="flex items-center gap-1">
                <Camera className="h-4 w-4" />
                <span>請上傳您需要搬運的大型物品（如沙發、床、衣櫃等）的照片</span>
              </p>
              <p>上傳照片有助於搬運公司：</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>評估物品的實際尺寸和重量</li>
                <li>了解物品的形狀和結構複雜度</li>
                <li>判斷是否需要特殊的搬運設備或技術</li>
                <li>提供更準確的報價和時間估算</li>
              </ul>
              <p>
                <strong>提示：</strong> 請確保照片清晰，並從不同角度拍攝，以便搬運公司能夠全面了解物品情況。
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              {itemPhotos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(photo) || "/placeholder.svg"}
                    alt={`物品照片 ${index + 1}`}
                    className="h-24 w-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
              <label className="h-24 w-24 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
                <Upload className="h-6 w-6 text-gray-400" />
                <span className="text-xs text-gray-500 mt-2">上傳照片</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="special-requirements">特殊要求</Label>
        <Textarea
          id="special-requirements"
          placeholder="請描述任何特殊要求，例如需要拆裝家具、需要包裝服務等"
          rows={4}
        />
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary-600" disabled={isLoading}>
        {isLoading ? "處理中..." : submitButtonText}
      </Button>
    </form>
  )

  if (!showCard) {
    return (
      <div className={containerClassName}>
        <FormContent />
      </div>
    )
  }

  return (
    <Card className={containerClassName}>
      {showTitle && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      )}
      <CardContent>
        <FormContent />
      </CardContent>
    </Card>
  )
}
