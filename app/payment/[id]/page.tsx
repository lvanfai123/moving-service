"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, Shield, Star, InfoIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { RefundInfoTooltip } from "@/components/refund-info-tooltip"

export default function PaymentPage({ params }: { params: { id: string } }) {
  const quoteId = params.id
  const router = useRouter()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [termsAccepted, setTermsAccepted] = useState(false)

  // 模擬報價數據 - 在實際應用中，這些數據應該從API獲取
  const quoteData = {
    id: quoteId,
    companyName: "搬運公司 A (A-003)",
    rating: 4.8,
    moveDate: "2023-06-15",
    moveTime: "14:00",
    fromAddress: "九龍灣宏開道8號其士商業中心608室",
    toAddress: "沙田石門安群街3號京瑞廣場一期19樓C室",
    items: [
      { name: "沙發", quantity: 1, dimensions: "200cm x 90cm x 85cm" },
      { name: "雙人床", quantity: 1, dimensions: "190cm x 150cm x 40cm" },
      { name: "衣櫃", quantity: 2, dimensions: "180cm x 60cm x 200cm" },
      { name: "餐桌", quantity: 1, dimensions: "150cm x 80cm x 75cm" },
      { name: "椅子", quantity: 4, dimensions: "45cm x 45cm x 90cm" },
      { name: "封裝箱", quantity: 10, dimensions: "50cm x 40cm x 40cm" },
    ],
    pricing: {
      basicFee: 2800,
      additionalServices: [
        { name: "家具拆裝服務", fee: 500 },
        { name: "包裝材料", fee: 300 },
      ],
      discount: 200,
      total: 3400,
      deposit: 1020, // 30% of total
    },
    customer: {
      name: "陳大文",
      phone: "9123 4567",
      email: "chan@example.com",
    },
  }

  const handlePayment = () => {
    if (!termsAccepted) {
      toast({
        title: "請接受服務條款",
        description: "您需要接受我們的服務條款才能繼續",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    // 模擬支付處理
    setTimeout(() => {
      setIsProcessing(false)
      toast({
        title: "支付成功！",
        description: "您的訂金已成功支付，我們將發送確認電郵給您。",
      })
      router.push(`/payment/${quoteId}/success`)
    }, 2000)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 進度指示器 */}
        <div className="flex justify-center mb-8">
          <ol className="flex items-center w-full">
            <li className="flex items-center text-primary">
              <span className="flex items-center justify-center w-8 h-8 border-2 border-primary rounded-full shrink-0">
                1
              </span>
              <span className="mx-2 text-sm font-medium">選擇報價</span>
            </li>
            <div className="w-12 h-0.5 bg-primary"></div>
            <li className="flex items-center text-primary">
              <span className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full shrink-0">
                2
              </span>
              <span className="mx-2 text-sm font-medium">支付訂金</span>
            </li>
            <div className="w-12 h-0.5 bg-gray-200"></div>
            <li className="flex items-center text-gray-400">
              <span className="flex items-center justify-center w-8 h-8 border-2 border-gray-200 rounded-full shrink-0">
                3
              </span>
              <span className="mx-2 text-sm font-medium">完成預約</span>
            </li>
          </ol>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <Link
            href={`/dashboard/quotes/${quoteId}`}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tighter">支付訂金</h1>
          <RefundInfoTooltip />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 左側 - 訂單摘要 */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>訂單摘要</CardTitle>
                <CardDescription>請確認您的搬運服務詳情</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert variant="info" className="mb-4">
                  <InfoIcon className="h-4 w-4" />
                  <AlertTitle>關於搬運公司代號</AlertTitle>
                  <AlertDescription>
                    為確保公平競爭和客觀選擇，我們使用代號（如
                    A-003）代替搬運公司真實名稱。您所選擇的搬運公司已通過我們的嚴格審核，確保服務質素。完成訂單後，您將收到搬運公司的完整聯絡資料。
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{quoteData.companyName}</h3>
                      <div className="flex items-center text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">{quoteData.rating}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    搬運日期: {quoteData.moveDate} {quoteData.moveTime}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">搬運地址</h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                    <p>
                      <span className="font-medium">從:</span> {quoteData.fromAddress}
                    </p>
                    <p>
                      <span className="font-medium">到:</span> {quoteData.toAddress}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">搬運物品</h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                    {quoteData.items.map((item, index) => (
                      <p key={index}>
                        {item.name} x {item.quantity} ({item.dimensions})
                      </p>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="font-medium">價格明細</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>基本搬運費用</span>
                      <span>HK${quoteData.pricing.basicFee}</span>
                    </div>
                    {quoteData.pricing.additionalServices.map((service, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{service.name}</span>
                        <span>HK${service.fee}</span>
                      </div>
                    ))}
                    {quoteData.pricing.discount > 0 && (
                      <div className="flex justify-between text-sm text-primary">
                        <span>優惠折扣</span>
                        <span>-HK${quoteData.pricing.discount}</span>
                      </div>
                    )}
                    <div className="h-px w-full bg-gray-200 my-3"></div>
                    <div className="flex justify-between font-medium text-lg">
                      <span>總金額</span>
                      <span className="text-primary">HK${quoteData.pricing.total}</span>
                    </div>
                    <div className="flex justify-between font-bold text-xl mt-2 pt-2 border-t border-dashed">
                      <span className="text-primary">訂金金額 (30%)</span>
                      <span className="text-primary">HK${quoteData.pricing.deposit}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      *餘款 HK${quoteData.pricing.total - quoteData.pricing.deposit} 將在搬運完成後支付給搬運公司
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>客戶資訊</CardTitle>
                <CardDescription>請確認您的聯絡資料</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">姓名</Label>
                    <Input id="name" defaultValue={quoteData.customer.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">聯絡電話</Label>
                    <Input id="phone" defaultValue={quoteData.customer.phone} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">電子郵件</Label>
                  <Input id="email" type="email" defaultValue={quoteData.customer.email} />
                  <p className="text-xs text-gray-500">用於發送確認郵件和收據</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右側 - 付款方式 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>付款方式</CardTitle>
                <CardDescription>請選擇您偏好的付款方式</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="credit-card" onValueChange={setPaymentMethod} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="credit-card">信用卡</TabsTrigger>
                    <TabsTrigger value="digital">電子支付</TabsTrigger>
                  </TabsList>
                  <TabsContent value="credit-card" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="card-number">卡號</Label>
                      <Input id="card-number" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">到期日</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name-on-card">持卡人姓名</Label>
                      <Input id="name-on-card" placeholder="請輸入持卡人姓名" />
                    </div>
                  </TabsContent>
                  <TabsContent value="digital" className="mt-4">
                    <RadioGroup defaultValue="payme" className="space-y-3">
                      <div className="flex items-center space-x-2 border rounded-md p-3">
                        <RadioGroupItem value="payme" id="payme" />
                        <Label htmlFor="payme" className="flex-grow cursor-pointer">
                          PayMe / FPS
                        </Label>
                        <img src="/images/payme-logo.png" alt="PayMe" className="h-6" />
                      </div>
                      <div className="flex items-center space-x-2 border rounded-md p-3">
                        <RadioGroupItem value="alipay" id="alipay" />
                        <Label htmlFor="alipay" className="flex-grow cursor-pointer">
                          支付寶
                        </Label>
                        <img src="/images/alipay-logo.png" alt="Alipay" className="h-6" />
                      </div>
                      <div className="flex items-center space-x-2 border rounded-md p-3">
                        <RadioGroupItem value="wechat" id="wechat" />
                        <Label htmlFor="wechat" className="flex-grow cursor-pointer">
                          微信支付
                        </Label>
                        <img src="/images/wechat-pay-logo.png" alt="WeChat Pay" className="h-6" />
                      </div>
                      <div className="flex items-center space-x-2 border rounded-md p-3">
                        <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                        <Label htmlFor="bank-transfer" className="flex-grow cursor-pointer">
                          銀行轉帳
                        </Label>
                        <CreditCard className="h-5 w-5 text-gray-500" />
                      </div>
                    </RadioGroup>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={termsAccepted}
                      onCheckedChange={(checked) => setTermsAccepted(!!checked)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="terms"
                        className="text-sm font-normal text-gray-500 dark:text-gray-400 cursor-pointer"
                      >
                        我已閱讀並同意
                        <Link href="/refund-terms" className="text-primary hover:underline ml-1">
                          退款及條款
                        </Link>
                        及
                        <Link href="/privacy" className="text-primary hover:underline ml-1">
                          私隱政策
                        </Link>
                      </Label>
                    </div>
                  </div>

                  <div className="bg-primary-50 dark:bg-primary-900/20 p-3 rounded-md flex items-start space-x-2">
                    <Shield className="h-5 w-5 text-primary mt-0.5" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      您的支付資訊受到加密保護。我們使用安全的支付處理系統，確保您的個人資料安全。
                    </p>
                  </div>

                  <Button
                    onClick={handlePayment}
                    disabled={isProcessing || !termsAccepted}
                    className="w-full bg-primary hover:bg-primary-600 text-lg py-6"
                  >
                    {isProcessing ? "處理中..." : `確認支付 HK$${quoteData.pricing.deposit}`}
                  </Button>

                  <p className="text-xs text-center text-gray-500">
                    如有任何問題，請聯絡我們的客戶服務：
                    <a href="tel:66668888" className="text-primary hover:underline">
                      6666 8888
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
