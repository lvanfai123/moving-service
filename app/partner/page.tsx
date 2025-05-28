'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function PartnerPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    businessRegistration: '',
    businessHours: '',
    serviceAreas: '',
    companyDescription: '',
    referral: '',
    services: {
      residential: false,
      office: false,
      international: false,
      storage: false,
      packing: false,
      furniture: false
    }
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id.replace(/-([a-z])/g, (g) => g[1].toUpperCase())]: value
    }))
  }

  const handleCheckboxChange = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [service]: !prev.services[service as keyof typeof prev.services]
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 驗證必填欄位
    if (!formData.companyName || !formData.contactPerson || !formData.phone || !formData.email) {
      toast({
        title: "請填寫必填欄位",
        description: "公司名稱、聯絡人、電話和電郵為必填項目",
        variant: "destructive"
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/partner/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "申請成功",
          description: data.message || "我們已收到您的申請，將盡快與您聯絡",
        })
        
        // 重置表單
        setFormData({
          companyName: '',
          contactPerson: '',
          phone: '',
          email: '',
          address: '',
          businessRegistration: '',
          businessHours: '',
          serviceAreas: '',
          companyDescription: '',
          referral: '',
          services: {
            residential: false,
            office: false,
            international: false,
            storage: false,
            packing: false,
            furniture: false
          }
        })
      } else {
        toast({
          title: "申請失敗",
          description: data.error || "提交申請時發生錯誤，請稍後再試",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "網絡錯誤",
        description: "無法連接到伺服器，請檢查網絡連接",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-12 md:py-24">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">成為合作伙伴</h1>
          <p className="text-2xl font-medium text-primary dark:text-primary-400">免費成為合作伙伴，拓展生意機會</p>
          <p className="text-gray-500 dark:text-gray-400 md:text-xl max-w-2xl mx-auto">
            加入我們的搬屋服務配對平台，獲取更多客戶，提升業務增長。我們將為您提供優質的客戶資源，助您拓展業務。
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>合作伙伴申請表格</CardTitle>
            <CardDescription>請填寫以下資料，我們將盡快與您聯絡</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company-name">公司名稱 *</Label>
                  <Input 
                    id="company-name" 
                    placeholder="請輸入公司名稱" 
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-person">聯絡人 *</Label>
                  <Input 
                    id="contact-person" 
                    placeholder="請輸入聯絡人姓名" 
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">電話 *</Label>
                  <Input 
                    id="phone" 
                    placeholder="請輸入電話" 
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">電郵 *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="請輸入電郵" 
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">公司地址</Label>
                <Input 
                  id="address" 
                  placeholder="請輸入公司地址" 
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="business-registration">商業登記證號碼</Label>
                <Input 
                  id="business-registration" 
                  placeholder="請輸入商業登記證號碼" 
                  value={formData.businessRegistration}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="services">服務內容</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="residential" 
                      checked={formData.services.residential}
                      onCheckedChange={() => handleCheckboxChange('residential')}
                    />
                    <Label htmlFor="residential" className="font-normal">
                      住宅搬運
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="office" 
                      checked={formData.services.office}
                      onCheckedChange={() => handleCheckboxChange('office')}
                    />
                    <Label htmlFor="office" className="font-normal">
                      辦公室搬運
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="international" 
                      checked={formData.services.international}
                      onCheckedChange={() => handleCheckboxChange('international')}
                    />
                    <Label htmlFor="international" className="font-normal">
                      國際搬運
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="storage" 
                      checked={formData.services.storage}
                      onCheckedChange={() => handleCheckboxChange('storage')}
                    />
                    <Label htmlFor="storage" className="font-normal">
                      儲存服務
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="packing" 
                      checked={formData.services.packing}
                      onCheckedChange={() => handleCheckboxChange('packing')}
                    />
                    <Label htmlFor="packing" className="font-normal">
                      包裝服務
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="furniture" 
                      checked={formData.services.furniture}
                      onCheckedChange={() => handleCheckboxChange('furniture')}
                    />
                    <Label htmlFor="furniture" className="font-normal">
                      家具拆裝
                    </Label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="business-hours">營業時間</Label>
                  <Input 
                    id="business-hours" 
                    placeholder="例如：09:00-18:00" 
                    value={formData.businessHours}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service-areas">服務地區</Label>
                  <Input 
                    id="service-areas" 
                    placeholder="例如：全港、九龍、新界等" 
                    value={formData.serviceAreas}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-description">公司簡介</Label>
                <textarea
                  id="company-description"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="請簡單介紹您的公司和服務特色"
                  value={formData.companyDescription}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div className="space-y-2">
                <Label htmlFor="referral">如何得知我們的平台</Label>
                <Input 
                  id="referral" 
                  placeholder="例如：網上搜尋、朋友介紹等" 
                  value={formData.referral}
                  onChange={handleInputChange}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary-600"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    提交中...
                  </>
                ) : (
                  '提交申請'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">成為合作伙伴的好處</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-6">
            <div className="space-y-2">
              <h3 className="font-medium">獲取更多客戶</h3>
              <p className="text-gray-600 dark:text-gray-300">
                通過我們的平台，您可以接觸到更多有搬運需求的客戶，擴大您的客戶群。
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">提高品牌知名度</h3>
              <p className="text-gray-600 dark:text-gray-300">
                在我們的平台上展示您的公司資料和服務，提高品牌曝光率和知名度。
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">零成本加入</h3>
              <p className="text-gray-600 dark:text-gray-300">
                免費成為我們的合作伙伴，無需支付任何費用，只有在成功接單後才需支付少量佣金。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
