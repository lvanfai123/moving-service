import { ArrowLeft, Building, Mail, MapPin, Phone, User } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function PartnerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const partnerId = (await params).id

  // 在實際應用中，這裡會從API獲取合作伙伴數據
  const partner = partners.find((p) => p.id === partnerId)

  if (!partner) {
    notFound()
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/partners">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">合作伙伴詳情</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/partners/${partnerId}/edit`}>編輯資料</Link>
          </Button>
          {partner.status === "pending" && <Button>審核申請</Button>}
          {partner.status === "active" && <Button variant="destructive">停用帳戶</Button>}
          {partner.status === "suspended" && <Button variant="default">重新啟用</Button>}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本資料</CardTitle>
          <CardDescription>合作伙伴的基本信息</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">公司名稱</p>
                  <p className="font-medium">{partner.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">聯絡人</p>
                  <p className="font-medium">{partner.contactPerson}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">電話</p>
                  <p className="font-medium">{partner.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">電郵</p>
                  <p className="font-medium">{partner.email || "未提供"}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">地址</p>
                  <p className="font-medium">{partner.address || "未提供"}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">商業登記號碼</p>
                <p className="font-medium">{partner.businessReg || "未提供"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">加入日期</p>
                <p className="font-medium">{partner.joinDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">狀態</p>
                <PartnerStatusBadge status={partner.status} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">訂單記錄</TabsTrigger>
          <TabsTrigger value="reviews">評價記錄</TabsTrigger>
          <TabsTrigger value="payments">付款記錄</TabsTrigger>
        </TabsList>
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>訂單記錄</CardTitle>
              <CardDescription>該合作伙伴的所有訂單記錄</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>訂單編號</TableHead>
                    <TableHead>客戶</TableHead>
                    <TableHead>日期</TableHead>
                    <TableHead>金額</TableHead>
                    <TableHead>狀態</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partner.orders && partner.orders.length > 0 ? (
                    partner.orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>${order.amount}</TableCell>
                        <TableCell>
                          <OrderStatusBadge status={order.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/orders/${order.id}`}>查看</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        暫無訂單記錄
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>評價記錄</CardTitle>
              <CardDescription>客戶對該合作伙伴的評價</CardDescription>
            </CardHeader>
            <CardContent>
              {partner.reviews && partner.reviews.length > 0 ? (
                <div className="space-y-4">
                  {partner.reviews.map((review, index) => (
                    <div key={index} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{review.customer}</div>
                        <div className="text-sm text-muted-foreground">{review.date}</div>
                      </div>
                      <div className="mt-2 flex items-center">
                        <div className="text-amber-500">★★★★★</div>
                        <div className="ml-2">{review.rating}/5</div>
                      </div>
                      <p className="mt-2 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">暫無評價記錄</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>付款記錄</CardTitle>
              <CardDescription>平台向該合作伙伴的付款記錄</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>交易編號</TableHead>
                    <TableHead>日期</TableHead>
                    <TableHead>金額</TableHead>
                    <TableHead>狀態</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partner.payments && partner.payments.length > 0 ? (
                    partner.payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.id}</TableCell>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>${payment.amount}</TableCell>
                        <TableCell>
                          <PaymentStatusBadge status={payment.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/payments/${payment.id}`}>查看</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        暫無付款記錄
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function PartnerStatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, { label: string; variant: "outline" | "secondary" | "destructive" | "default" }> = {
    active: { label: "已審核", variant: "default" },
    pending: { label: "待審核", variant: "secondary" },
    suspended: { label: "已停用", variant: "destructive" },
  }

  const { label, variant } = statusMap[status] || { label: status, variant: "outline" }

  return <Badge variant={variant}>{label}</Badge>
}

function OrderStatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, { label: string; variant: "outline" | "secondary" | "destructive" | "default" }> = {
    completed: { label: "已完成", variant: "default" },
    pending: { label: "處理中", variant: "secondary" },
    cancelled: { label: "已取消", variant: "destructive" },
  }

  const { label, variant } = statusMap[status] || { label: status, variant: "outline" }

  return <Badge variant={variant}>{label}</Badge>
}

function PaymentStatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, { label: string; variant: "outline" | "secondary" | "destructive" | "default" }> = {
    completed: { label: "已完成", variant: "default" },
    pending: { label: "處理中", variant: "secondary" },
    failed: { label: "失敗", variant: "destructive" },
  }

  const { label, variant } = statusMap[status] || { label: status, variant: "outline" }

  return <Badge variant={variant}>{label}</Badge>
}

// 模擬數據
const partners = [
  {
    id: "P001",
    name: "安心搬屋公司",
    contactPerson: "王經理",
    phone: "9876 5432",
    email: "info@anxin.com",
    address: "香港九龍旺角彌敦道123號",
    businessReg: "12345678",
    joinDate: "2022-10-01",
    completedOrders: 42,
    rating: "4.8",
    status: "active",
    logo: "/images/partners/anxin-moving.png",
    orders: [
      { id: "O001", customer: "陳大文", date: "2023-05-15", amount: 2500, status: "completed" },
      { id: "O002", customer: "李小明", date: "2023-06-20", amount: 1800, status: "completed" },
      { id: "O003", customer: "黃麗華", date: "2023-07-10", amount: 3200, status: "pending" },
    ],
    reviews: [
      { customer: "陳大文", date: "2023-05-18", rating: 5, comment: "服務非常好，搬運員工專業有禮。" },
      { customer: "李小明", date: "2023-06-22", rating: 4.5, comment: "整體滿意，只是比預定時間晚了一點。" },
    ],
    payments: [
      { id: "P001", date: "2023-05-20", amount: 2250, status: "completed" },
      { id: "P002", date: "2023-06-25", amount: 1620, status: "completed" },
    ],
  },
  {
    id: "P002",
    name: "專業搬運有限公司",
    contactPerson: "李經理",
    phone: "9765 4321",
    joinDate: "2022-11-15",
    completedOrders: 38,
    rating: "4.7",
    status: "active",
    logo: "/images/partners/professional-moving-ltd.png",
  },
  {
    id: "P003",
    name: "快捷搬運服務",
    contactPerson: "陳經理",
    phone: "9654 3210",
    joinDate: "2023-01-10",
    completedOrders: 25,
    rating: "4.5",
    status: "active",
    logo: "/images/partners/quick-moving-service.png",
  },
  {
    id: "P004",
    name: "新興搬屋公司",
    contactPerson: "張經理",
    phone: "9543 2109",
    joinDate: "2023-04-05",
    completedOrders: 0,
    rating: "0",
    status: "pending",
    logo: "/images/partners/xinxing-moving.png",
  },
  {
    id: "P005",
    name: "大眾搬運服務",
    contactPerson: "黃經理",
    phone: "9432 1098",
    joinDate: "2022-12-20",
    completedOrders: 15,
    rating: "3.2",
    status: "suspended",
    logo: "/images/partners/public-moving.png",
  },
]
