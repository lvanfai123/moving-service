import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Printer, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { NotificationStatus } from "@/components/admin/notification-status"

export const metadata: Metadata = {
  title: "訂單詳情 | 搬屋師平台",
  description: "搬屋師平台訂單詳情頁面",
}

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // 模擬訂單數據
  const order = {
    id,
    customerName: "陳大文",
    customerPhone: "9123 4567",
    customerEmail: "chan@example.com",
    companyName: "安心搬屋公司",
    companyContact: "王經理",
    companyPhone: "9876 5432",
    companyEmail: "info@onsum.com",
    totalAmount: "2,800",
    platformFee: "280",
    deposit: "840",
    balance: "1,960",
    paymentMethod: "信用卡",
    paymentStatus: "已付訂金",
    createdDate: "2023-05-10",
    movingDate: "2023-05-15 14:00",
    status: "confirmed",
    customerRegisteredDate: "2023-01-15",
    customerOrderCount: "3",
    companyJoinDate: "2022-10-01",
    companyOrderCount: "42",
    fromAddress: "太古城中心第三期20樓A室",
    fromAddressDetail: "香港太古城道14號",
    fromElevator: "有升降機",
    toAddress: "將軍澳中心5座12樓B室",
    toAddressDetail: "新界將軍澳唐俊街9號",
    toElevator: "有升降機",
    additionalServices: ["拆裝傢俬", "包裝服務"],
    notes: "客戶要求搬運工人必須穿鞋套，小心搬運玻璃製品。",
    items: [
      { name: "三座位梳化", quantity: "1", size: "大型", notes: "需要拆裝" },
      { name: "雙人床", quantity: "1", size: "大型", notes: "需要拆裝" },
      { name: "衣櫃", quantity: "2", size: "大型", notes: "需要拆裝" },
      { name: "餐桌", quantity: "1", size: "中型", notes: "玻璃桌面，需小心搬運" },
      { name: "紙箱", quantity: "10", size: "小型", notes: "書籍和廚具" },
    ],
    history: [
      { action: "訂單建立", date: "2023-05-10 09:15", user: "陳大文 (客戶)", note: "" },
      { action: "報價提交", date: "2023-05-10 10:30", user: "安心搬屋公司", note: "提供了HK$2,800的報價" },
      { action: "報價接受", date: "2023-05-10 11:45", user: "陳大文 (客戶)", note: "" },
      { action: "訂金支付", date: "2023-05-10 11:50", user: "陳大文 (客戶)", note: "支付了HK$840訂金" },
      { action: "訂單確認", date: "2023-05-10 12:00", user: "系統", note: "訂單已確認，等待搬運日期" },
    ],
    notificationStatus: {
      email: {
        total: 15,
        sent: 14,
        failed: 1,
      },
      sms: {
        total: 15,
        sent: 13,
        failed: 2,
      },
    },
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/admin/orders">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">訂單詳情</h2>
          <Badge variant="outline" className="ml-2">
            已確認
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            列印
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            匯出
          </Button>
          <Button>更新狀態</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>訂單資訊</CardTitle>
            <CardDescription>訂單基本資訊</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">訂單編號</dt>
                <dd className="mt-1 text-sm">{order.id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">建立日期</dt>
                <dd className="mt-1 text-sm">{order.createdDate}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">搬運日期</dt>
                <dd className="mt-1 text-sm">{order.movingDate}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">狀態</dt>
                <dd className="mt-1 text-sm">
                  <Badge variant="secondary">已確認</Badge>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>付款資訊</CardTitle>
            <CardDescription>訂單付款詳情</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">總金額</dt>
                <dd className="mt-1 text-sm font-bold">HK${order.totalAmount}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">平台服務費 (10%)</dt>
                <dd className="mt-1 text-sm">HK${order.platformFee}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">已付訂金 (30%)</dt>
                <dd className="mt-1 text-sm">HK${order.deposit}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">餘款 (70%)</dt>
                <dd className="mt-1 text-sm">HK${order.balance}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">付款方式</dt>
                <dd className="mt-1 text-sm">{order.paymentMethod}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">付款狀態</dt>
                <dd className="mt-1 text-sm">
                  <Badge variant="outline">{order.paymentStatus}</Badge>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>客戶資訊</CardTitle>
            <CardDescription>客戶聯絡資料</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">姓名</dt>
                <dd className="mt-1 text-sm">{order.customerName}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">電話</dt>
                <dd className="mt-1 text-sm">{order.customerPhone}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">電郵</dt>
                <dd className="mt-1 text-sm">{order.customerEmail}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">註冊日期</dt>
                <dd className="mt-1 text-sm">{order.customerRegisteredDate}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">訂單數量</dt>
                <dd className="mt-1 text-sm">{order.customerOrderCount}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>搬運公司資訊</CardTitle>
            <CardDescription>搬運公司聯絡資料</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">公司名稱</dt>
                <dd className="mt-1 text-sm">{order.companyName}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">聯絡人</dt>
                <dd className="mt-1 text-sm">{order.companyContact}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">電話</dt>
                <dd className="mt-1 text-sm">{order.companyPhone}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">電郵</dt>
                <dd className="mt-1 text-sm">{order.companyEmail}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">加入日期</dt>
                <dd className="mt-1 text-sm">{order.companyJoinDate}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">完成訂單數</dt>
                <dd className="mt-1 text-sm">{order.companyOrderCount}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* 新增的通知狀態卡片 */}
      <NotificationStatus
        quoteRequestId={id}
        notificationStatus={order.notificationStatus}
        onStatusChange={() => console.log("通知狀態已更新")}
      />

      <Card>
        <CardHeader>
          <CardTitle>搬運詳情</CardTitle>
          <CardDescription>搬運地址和物品清單</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="details" className="space-y-4">
            <TabsList>
              <TabsTrigger value="details">搬運資訊</TabsTrigger>
              <TabsTrigger value="items">物品清單</TabsTrigger>
              <TabsTrigger value="history">訂單歷史</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium">搬出地址</h3>
                  <p className="mt-2 text-sm">{order.fromAddress}</p>
                  <p className="mt-1 text-sm">{order.fromAddressDetail}</p>
                  <p className="mt-1 text-sm">{order.fromElevator}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium">搬入地址</h3>
                  <p className="mt-2 text-sm">{order.toAddress}</p>
                  <p className="mt-1 text-sm">{order.toAddressDetail}</p>
                  <p className="mt-1 text-sm">{order.toElevator}</p>
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="text-lg font-medium">額外服務</h3>
                <ul className="mt-2 list-disc pl-5 text-sm">
                  {order.additionalServices.map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
                </ul>
              </div>
              <Separator />
              <div>
                <h3 className="text-lg font-medium">備註</h3>
                <p className="mt-2 text-sm">{order.notes}</p>
              </div>
            </TabsContent>
            <TabsContent value="items">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>物品名稱</TableHead>
                    <TableHead>數量</TableHead>
                    <TableHead>尺寸</TableHead>
                    <TableHead>備註</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.size}</TableCell>
                      <TableCell>{item.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="history">
              <div className="space-y-4">
                {order.history.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">{index + 1}</div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{item.action}</p>
                      <p className="text-xs text-gray-500">
                        {item.date} - {item.user}
                      </p>
                      {item.note && <p className="text-xs italic">{item.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
