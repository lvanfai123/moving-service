import Link from "next/link"
import { ArrowLeft, MapPin, Calendar, Package, User, Phone, Mail, Clock, CheckCircle, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function SubmittedQuotePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/partner/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回儀表板
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">報價詳情</h1>
            <p className="text-gray-500">Q-2023-1006</p>
          </div>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 ml-auto">
            已報價
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 客戶信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                客戶信息
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-medium">林美玲</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>+852 8765 4321</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>lin.meiling@company.com</span>
              </div>
            </CardContent>
          </Card>

          {/* 搬運詳情 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                搬運詳情
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">深水埗 → 大埔</p>
                  <p className="text-sm text-gray-500">距離約 28 公里</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>2023-05-17 (星期三)</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>上午 8:00 - 下午 6:00</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 搬運物品清單 */}
        <Card>
          <CardHeader>
            <CardTitle>搬運物品清單</CardTitle>
            <CardDescription>辦公室設備搬遷</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-700">辦公家具</h4>
                <ul className="space-y-1 text-sm">
                  <li>• 辦公桌 x 8</li>
                  <li>• 辦公椅 x 10</li>
                  <li>• 會議桌 x 1</li>
                  <li>• 文件櫃 x 6</li>
                  <li>• 書架 x 4</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-700">電子設備</h4>
                <ul className="space-y-1 text-sm">
                  <li>• 電腦主機 x 8</li>
                  <li>• 顯示器 x 12</li>
                  <li>• 打印機 x 3</li>
                  <li>• 影印機 x 1</li>
                  <li>• 網絡設備 x 1批</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 已提交的報價 */}
        <Card className="bg-purple-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              您的報價
            </CardTitle>
            <CardDescription>已於 2023-05-16 14:30 提交</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-purple-600">HK$4,200</div>
                <div className="text-sm text-gray-500">報價金額</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold">3人</div>
                <div className="text-sm text-gray-500">工人數量</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-xl font-bold">5.5噸</div>
                <div className="text-sm text-gray-500">貨車</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-xl font-bold">6-8小時</div>
                <div className="text-sm text-gray-500">預計時間</div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">包含服務</h4>
                <p className="text-sm text-gray-600">
                  • 專業包裝材料
                  <br />• 辦公設備拆裝
                  <br />• 網絡設備重新安裝
                  <br />• 基本保險覆蓋
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">可服務日期</h4>
                <p className="text-sm text-gray-600">2023-05-17, 2023-05-18, 2023-05-19</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">備註說明</h4>
                <p className="text-sm text-gray-600">
                  我們有豐富的辦公室搬遷經驗，會特別小心處理電子設備，確保網絡設備在新辦公室正常運作。
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" className="flex-1">
                <Edit className="h-4 w-4 mr-2" />
                修改報價
              </Button>
              <Button variant="outline">聯絡客戶</Button>
            </div>
          </CardContent>
        </Card>

        {/* 競爭對手報價 */}
        <Card>
          <CardHeader>
            <CardTitle>其他報價情況</CardTitle>
            <CardDescription>目前共收到 3 份報價</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                <span className="font-medium text-purple-700">您的報價</span>
                <span className="font-bold text-purple-700">HK$4,200</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span>競爭對手 A</span>
                <span className="font-medium">HK$4,500</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span>競爭對手 B</span>
                <span className="font-medium">HK$3,800</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-700">💡 您的報價在合理範圍內，建議保持競爭力的同時確保服務品質。</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
