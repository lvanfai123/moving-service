import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, DollarSign, Shield, Star, FileText } from "lucide-react"

export default function PromisesPage() {
  return (
    <div className="py-12 md:py-24">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl whitespace-nowrap">服務承諾</h1>
          <p className="text-gray-500 dark:text-gray-400 md:text-xl max-w-2xl mx-auto">
            我們致力為您提供最優質的搬屋配對服務，以下是我們對您的承諾
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="shadow-lg h-full flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
                  <DollarSign className="h-6 w-6 text-primary dark:text-primary-50" />
                </div>
                <div>
                  <CardTitle className="text-2xl">$0報價 無限配對</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-gray-500 dark:text-gray-400 mt-4">
                我們的平台完全免費為您提供搬屋報價服務。您可以免費獲取多份報價，並根據自己的需求和預算選擇最合適的搬運公司，無需支付任何中介費用。
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <span>完全免費獲取報價</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <span>無限次使用配對服務</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <span>無需支付任何中介費用</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg h-full flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
                  <Shield className="h-6 w-6 text-primary dark:text-primary-50" />
                </div>
                <div>
                  <CardTitle className="text-2xl">價格保障</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-gray-500 dark:text-gray-400 mt-4">
                我們確保您獲得的報價是市場上最具競爭力的價格。我們的合作伙伴直接向您提供報價，沒有隱藏費用，讓您清楚了解服務內容和價格，做出明智的選擇。
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <span>透明定價，無隱藏費用</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <span>多份報價比較，選擇最優惠</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <span>價格與服務質量的最佳平衡</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg h-full flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
                  <Clock className="h-6 w-6 text-primary dark:text-primary-50" />
                </div>
                <div>
                  <CardTitle className="text-2xl">快速報價：1 小時內最少 3 份報價</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-gray-500 dark:text-gray-400 mt-4">
                我們承諾在您提交需求後的1小時內，為您提供至少3份來自不同搬運公司的報價。這讓您可以快速比較不同公司的服務和價格，節省寶貴的時間。
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <span>1小時內獲取多份報價</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <span>快速回應您的搬運需求</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <span>節省比價時間和精力</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg h-full flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
                  <Star className="h-6 w-6 text-primary dark:text-primary-50" />
                </div>
                <div>
                  <CardTitle className="text-2xl">公司口碑審查</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-gray-500 dark:text-gray-400 mt-4">
                我們對所有合作的搬運公司進行嚴格的審查，確保他們具備專業資格和良好的服務記錄。您可以查看其他客戶的評價和評分，選擇信譽良好的公司。
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <span>嚴格審核合作伙伴資質</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <span>真實客戶評價和評分</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <span>持續監控服務質量</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* 退款保障卡片 */}
        <Card className="shadow-lg bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-green-800">
              <FileText className="h-6 w-6" />
              退款保障
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-green-700">我們提供完善的退款保障政策，確保您的權益得到充分保護。</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">24小時</div>
                <div className="text-sm text-green-700">搬運前取消可全額退款</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">1-3天</div>
                <div className="text-sm text-green-700">退款申請審核時間</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">5-7天</div>
                <div className="text-sm text-green-700">退款到賬時間</div>
              </div>
            </div>
            <div className="text-center">
              <Button asChild variant="outline" className="border-green-600 text-green-600 hover:bg-green-100">
                <Link href="/refund-terms">查看完整退款條款</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">我們的使命</h2>
          <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            我們致力於為客戶提供最便捷、最可靠的搬屋服務配對平台，讓搬屋變得簡單輕鬆。我們相信，通過連接優質的搬運公司和有需要的客戶，我們可以為雙方創造價值，提升整個行業的服務水平。
          </p>
        </div>
      </div>
    </div>
  )
}
