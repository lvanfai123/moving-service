import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertTriangle, Clock, DollarSign, X } from "lucide-react"

export default function RefundTermsPage() {
  return (
    <div className="py-12 md:py-24">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">退款及條款</h1>
          <p className="text-gray-500 dark:text-gray-400 md:text-xl max-w-2xl mx-auto">
            了解我們的退款政策和服務條款，保障您的權益
          </p>
        </div>

        {/* 退款政策 */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <DollarSign className="h-6 w-6 text-primary" />
              退款政策
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-700">全額退回按金</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>服務開始前5個工作天取消：100%退款</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>因天氣等不可抗力因素取消</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>搬運公司無故取消服務</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-orange-700">部分退回按金</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span>服務開始前4個工作天內取消：扣除 $150 手續費</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span>服務開始前3個工作天內取消：扣除 50% 按金</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-red-700">不接受退回按金情況</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <X className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <span>服務開始前1個工作天內取消</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <span>服務已經開始後取消</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <span>客戶提供錯誤或不完整的搬運信息</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <span>客戶在約定時間不在現場</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <span>因客戶個人原因導致無法完成搬運</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">更改服務期</h4>
                <p className="text-blue-700 text-sm">請與搬運公司自行協商</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 退款流程 */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Clock className="h-6 w-6 text-primary" />
              退款流程及時間
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h4 className="font-semibold">提交申請</h4>
                <p className="text-sm text-gray-600">聯絡客服或在平台提交退款申請</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h4 className="font-semibold">審核處理</h4>
                <p className="text-sm text-gray-600">1-3個工作日內完成審核</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <h4 className="font-semibold">退款到賬</h4>
                <p className="text-sm text-gray-600">5-7個工作日退回原付款方式</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">退款說明</h4>
              <ul className="text-blue-700 space-y-1 text-sm">
                <li>• 退款將退回至原付款方式（信用卡、銀行轉賬等）</li>
                <li>• 如使用優惠券或積分，將按比例退回</li>
                <li>• 銀行處理時間可能影響到賬時間</li>
                <li>• 退款完成後會發送確認通知</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* 服務條款 */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">服務條款</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">1. 服務範圍</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• 我們提供搬運公司配對服務，不直接提供搬運服務</li>
                <li>• 平台負責篩選合格的搬運公司並提供報價配對</li>
                <li>• 實際搬運服務由第三方搬運公司提供</li>
                <li>• 我們對搬運公司的服務質量進行監督和評估</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">2. 用戶責任</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• 提供準確完整的搬運需求信息</li>
                <li>• 確保搬運地址和聯絡方式正確</li>
                <li>• 配合搬運公司進行服務</li>
                <li>• 及時支付約定費用</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">3. 平台責任</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• 提供優質的配對服務</li>
                <li>• 確保合作搬運公司具備相關資質</li>
                <li>• 處理用戶投訴和糾紛</li>
                <li>• 保護用戶個人信息安全</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">4. 免責聲明</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• 對於搬運過程中的物品損壞，由搬運公司承擔責任</li>
                <li>• 平台不對不可抗力因素造成的損失承擔責任</li>
                <li>• 用戶與搬運公司的直接糾紛由雙方協商解決</li>
                <li>• 平台保留最終解釋權</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* 聯絡我們 */}
        <Card className="shadow-lg bg-primary-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">需要幫助？</h3>
              <p className="text-gray-600">如有任何關於退款或條款的疑問，請隨時聯絡我們的客服團隊</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="text-sm">
                  <strong>客服電話：</strong> 3702 3702
                </div>
                <div className="text-sm">
                  <strong>客服時間：</strong> 星期一至六 10:00-20:00
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
