import Link from "next/link"
import { CheckCircle, ArrowRight, Calendar, Phone, Mail, InfoIcon, Globe, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export default function PaymentSuccessPage({ params }: { params: { id: string } }) {
  const quoteId = params.id

  // 模擬報價數據 - 在實際應用中，這些數據應該從API獲取
  // 付款成功後，顯示真實公司資料而非代號
  const quoteData = {
    id: quoteId,
    companyCode: "A-003",
    companyRealName: "安心搬運有限公司", // 真實公司名稱
    moveDate: "2023-06-15",
    moveTime: "14:00",
    contactPerson: "李先生",
    contactPhone: "9876 5432",
    contactEmail: "service@ansum-moving.com", // 聯絡電郵
    companyAddress: "九龍新蒲崗大有街31號善美工業大廈20樓A座21室", // 公司地址
    companyWebsite: "www.ansum-moving.com", // 公司網站
    deposit: 1020,
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="max-w-2xl mx-auto space-y-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
            <CheckCircle className="h-10 w-10 text-primary dark:text-primary-300" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter">支付成功！</h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            您已成功支付訂金 HK${quoteData.deposit}。我們已發送確認電郵至您的郵箱，請查收。
          </p>
        </div>

        <Alert variant="info" className="text-left">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>重要提示</AlertTitle>
          <AlertDescription>
            您已完成訂金支付，搬運公司的真實資料現已向您公開。搬運公司將在1-2個工作天內主動與您聯絡，確認搬運細節。如有任何疑問，您也可以直接聯絡搬運公司或我們的客戶服務。
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>預約詳情</CardTitle>
            <CardDescription>您的搬運服務已確認</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-gray-500">訂單編號</span>
              <span className="font-medium">{quoteId}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-gray-500">搬運公司</span>
              <span className="font-medium">{quoteData.companyRealName}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-gray-500">公司代號</span>
              <span className="font-medium text-primary">{quoteData.companyCode}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-gray-500">搬運日期</span>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-primary" />
                <span className="font-medium">
                  {quoteData.moveDate} {quoteData.moveTime}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>搬運公司聯絡資料</CardTitle>
            <CardDescription>您可以直接聯絡搬運公司確認詳情</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-gray-500">聯絡人</span>
              <span className="font-medium">{quoteData.contactPerson}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-gray-500">聯絡電話</span>
              <div className="flex items-center">
                <Phone className="mr-2 h-4 w-4 text-primary" />
                <a href={`tel:${quoteData.contactPhone}`} className="font-medium hover:text-primary">
                  {quoteData.contactPhone}
                </a>
              </div>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-gray-500">電郵地址</span>
              <div className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-primary" />
                <a href={`mailto:${quoteData.contactEmail}`} className="font-medium hover:text-primary">
                  {quoteData.contactEmail}
                </a>
              </div>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-gray-500">公司地址</span>
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-primary" />
                <span className="font-medium text-right">{quoteData.companyAddress}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">公司網站</span>
              <div className="flex items-center">
                <Globe className="mr-2 h-4 w-4 text-primary" />
                <a
                  href={`https://${quoteData.companyWebsite}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:text-primary"
                >
                  {quoteData.companyWebsite}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-medium">下一步</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-2">
                  <Phone className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-medium">搬運公司將與您聯絡</h3>
                  <p className="text-sm text-gray-500">搬運公司將在1-2個工作天內主動與您聯絡，確認搬運細節</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-2">
                  <Mail className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-medium">確認電郵</h3>
                  <p className="text-sm text-gray-500">請查收我們發送的確認電郵，其中包含所有預約詳情和搬運公司資料</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center pt-4">
          <Link href="/dashboard">
            <Button variant="outline">返回會員中心</Button>
          </Link>
          <Link href="/contact">
            <Button className="bg-primary hover:bg-primary-600">
              需要幫助？
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
