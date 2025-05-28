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
  const [uploadedPhotos, setUploadedPhotos] = useState<{url: string, fileName: string}[]>([])
  const [isUploading, setIsUploading] = useState(false)
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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhotos = Array.from(e.target.files)
      
      // 檢查總照片數量
      if (itemPhotos.length + uploadedPhotos.length + newPhotos.length > 10) {
        toast({
          title: "照片數量超過限制",
          description: "最多只能上傳10張照片",
          variant: "destructive"
        })
        return
      }
      
      setItemPhotos((prev) => [...prev, ...newPhotos])
      
      // 立即開始上傳
      setIsUploading(true)
      
      for (const photo of newPhotos) {
        try {
          const formData = new FormData()
          formData.append('file', photo)
          
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          })
          
          const result = await response.json()
          
          if (response.ok) {
            setUploadedPhotos(prev => [...prev, { url: result.url, fileName: result.fileName }])
            // 從待上傳列表中移除已上傳的照片
            setItemPhotos(prev => prev.filter(p => p !== photo))
          } else {
            throw new Error(result.error || '上傳失敗')
          }
        } catch (error) {
          toast({
            title: "照片上傳失敗",
            description: error instanceof Error ? error.message : "請稍後再試",
            variant: "destructive"
          })
        }
      }
      
      setIsUploading(false)
    }
  }

  const removePhoto = async (index: number, isUploaded: boolean = false) => {
    if (isUploaded && uploadedPhotos[index]) {
      // 如果是已上傳的照片，需要從服務器刪除
      try {
        const response = await fetch(`/api/upload?fileName=${uploadedPhotos[index].fileName}`, {
          method: 'DELETE'
        })
        
        if (!response.ok) {
          throw new Error('刪除失敗')
        }
        
        setUploadedPhotos((prev) => prev.filter((_, i) => i !== index))
      } catch (error) {
        toast({
          title: "刪除失敗",
          description: "無法刪除照片，請稍後再試",
          variant: "destructive"
        })
      }
    } else {
      // 如果是未上傳的照片，直接從列表中移除
      setItemPhotos((prev) => prev.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 確保所有照片都已上傳
    if (itemPhotos.length > 0 && !isUploading) {
      toast({
        title: "請等待照片上傳完成",
        description: "照片正在上傳中，請稍候",
        variant: "destructive"
      })
      return
    }
    
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
        photos: uploadedPhotos.map(p => p.url) // 使用已上傳的照片URL
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
              {/* 顯示已上傳的照片 */}
              {uploadedPhotos.map((photo, index) => (
                <div key={`uploaded-${index}`} className="relative">
                  <img
                    src={photo.url}
                    alt={`物品照片 ${index + 1}`}
                    className="h-24 w-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index, true)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    disabled={isUploading}
                  >
                    ×
                  </button>
                </div>
              ))}
              
              {/* 顯示待上傳的照片 */}
              {itemPhotos.map((photo, index) => (
                <div key={`pending-${index}`} className="relative">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`待上傳照片 ${index + 1}`}
                    className="h-24 w-24 object-cover rounded-md opacity-50"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      上傳中...
                    </div>
                  </div>
                </div>
              ))}
              
              {/* 上傳按鈕 */}
              {(itemPhotos.length + uploadedPhotos.length < 10) && (
                <label className="h-24 w-24 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Upload className="h-6 w-6 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-2">上傳照片</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    className="hidden" 
                    onChange={handlePhotoUpload}
                    disabled={isUploading}
                  />
                </label>
              )}
            </div>
            
            {isUploading && (
              <p className="text-sm text-blue-600 mt-2">正在上傳照片，請稍候...</p>
            )}
            
            <p className="text-xs text-gray-500 mt-2">
              已上傳 {uploadedPhotos.length} 張照片，最多可上傳 10 張
            </p>
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

      <Button type="submit" className="w-full bg-primary hover:bg-primary-600" disabled={isLoading || isUploading}>
        {isLoading ? "處理中..." : isUploading ? "照片上傳中..." : submitButtonText}
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
