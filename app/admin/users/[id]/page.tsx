import { ArrowLeft, Mail, MapPin, Phone, User } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const userId = (await params).id

  // 在實際應用中，這裡會從API獲取用戶數據
  const user = users.find((u) => u.id === userId)

  if (!user) {
    notFound()
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/users">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">用戶詳情</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/users/${userId}/edit`}>編輯資料</Link>
          </Button>
          {user.status === "active" && <Button variant="destructive">停用帳戶</Button>}
          {user.status === "suspended" || user.status === "inactive" ? (
            <Button variant="default">重新啟用</Button>
          ) : null}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本資料</CardTitle>
          <CardDescription>用戶的基本信息</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">姓名</p>
                  <p className="font-medium">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">電話</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">電郵</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">地址</p>
                  <p className="font-medium">{user.address || "未提供"}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">註冊日期</p>
                <p className="font-medium">{user.registeredDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">狀態</p>
                <UserStatusBadge status={user.status} />
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
              <CardDescription>該用戶的所有訂單記錄</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>訂單編號</TableHead>
                    <TableHead>搬運公司</TableHead>
                    <TableHead>日期</TableHead>
                    <TableHead>金額</TableHead>
                    <TableHead>狀態</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.orders && user.orders.length > 0 ? (
                    user.orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.company}</TableCell>
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
              <CardDescription>該用戶對搬運公司的評價</CardDescription>
            </CardHeader>
            <CardContent>
              {user.reviews && user.reviews.length > 0 ? (
                <div className="space-y-4">
                  {user.reviews.map((review, index) => (
                    <div key={index} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{review.company}</div>
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
              <CardDescription>該用戶的所有付款記錄</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>交易編號</TableHead>
                    <TableHead>日期</TableHead>
                    <TableHead>金額</TableHead>
                    <TableHead>付款方式</TableHead>
                    <TableHead>狀態</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.payments && user.payments.length > 0 ? (
                    user.payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.id}</TableCell>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>${payment.amount}</TableCell>
                        <TableCell>{payment.method}</TableCell>
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
                      <TableCell colSpan={6} className="text-center">
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

function UserStatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, { label: string; variant: "outline" | "secondary" | "destructive" | "default" }> = {
    active: { label: "活躍", variant: "default" },
    inactive: { label: "非活躍", variant: "outline" },
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
const users = [
  {
    id: "U001",
    name: "陳大文",
    email: "chan@example.com",
    phone: "9123 4567",
    address: "香港島中環皇后大道中100號",
    registeredDate: "2023-01-15",
    orderCount: 3,
    status: "active",
    orders: [
      { id: "O001", company: "安心搬屋公司", date: "2023-05-15", amount: 2500, status: "completed" },
      { id: "O004", company: "專業搬運有限公司", date: "2023-08-20", amount: 1800, status: "pending" },
    ],
    reviews: [{ company: "安心搬屋公司", date: "2023-05-18", rating: 5, comment: "服務非常好，搬運員工專業有禮。" }],
    payments: [
      { id: "P001", date: "2023-05-15", amount: 2500, method: "信用卡", status: "completed" },
      { id: "P004", date: "2023-08-20", amount: 900, method: "PayMe", status: "completed" },
    ],
  },
  {
    id: "U002",
    name: "李小明",
    email: "lee@example.com",
    phone: "9234 5678",
    registeredDate: "2023-02-20",
    orderCount: 2,
    status: "active",
  },
  {
    id: "U003",
    name: "黃麗華",
    email: "wong@example.com",
    phone: "9345 6789",
    registeredDate: "2023-03-05",
    orderCount: 1,
    status: "active",
  },
  {
    id: "U004",
    name: "張三",
    email: "cheung@example.com",
    phone: "9456 7890",
    registeredDate: "2023-03-10",
    orderCount: 0,
    status: "inactive",
  },
  {
    id: "U005",
    name: "劉志強",
    email: "lau@example.com",
    phone: "9567 8901",
    registeredDate: "2023-04-01",
    orderCount: 1,
    status: "suspended",
  },
]
