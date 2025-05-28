import Link from "next/link"
import {
  CalendarIcon,
  PackageIcon,
  TruckIcon,
  DollarSignIcon,
  Settings,
  Building,
  Clock,
  CheckCircle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function PartnerDashboardPage() {
  // 模擬訂單數據 - 在實際應用中，這些數據應該從API獲取
  const recentOrders = [
    {
      id: "Q-2023-1007",
      customer: "王小華",
      from: "尖沙咀",
      to: "屯門",
      date: "2023-05-18",
      status: "awaiting_quote",
      amount: 0, // 尚未報價
      description: "3房2廳家庭搬遷",
    },
    {
      id: "Q-2023-1006",
      customer: "林美玲",
      from: "深水埗",
      to: "大埔",
      date: "2023-05-17",
      status: "quoted",
      amount: 4200,
      description: "辦公室設備搬遷",
    },
    {
      id: "ORD-2023-1005",
      customer: "陳大文",
      from: "太古城",
      to: "將軍澳",
      date: "2023-05-15",
      status: "confirmed",
      amount: 3400,
      description: "2房1廳住宅搬遷",
    },
    {
      id: "ORD-2023-1004",
      customer: "李小明",
      from: "銅鑼灣",
      to: "沙田",
      date: "2023-05-14",
      status: "pending",
      amount: 3000,
      description: "小型辦公室搬遷",
    },
    {
      id: "ORD-2023-1003",
      customer: "黃麗華",
      from: "旺角",
      to: "元朗",
      date: "2023-05-12",
      status: "completed",
      amount: 7200,
      description: "大型家庭搬遷",
    },
    {
      id: "ORD-2023-1002",
      customer: "張三",
      from: "中環",
      to: "北角",
      date: "2023-05-10",
      status: "completed",
      amount: 5000,
      description: "商業搬遷",
    },
    {
      id: "ORD-2023-1001",
      customer: "李四",
      from: "觀塘",
      to: "九龍灣",
      date: "2023-05-08",
      status: "completed",
      amount: 4000,
      description: "住宅搬遷",
    },
  ]

  // 獲取訂單狀態統計
  const getOrderStats = () => {
    const stats = {
      awaiting_quote: 0,
      quoted: 0,
      pending: 0,
      confirmed: 0,
      completed: 0,
      total: recentOrders.length,
    }

    recentOrders.forEach((order) => {
      if (order.status in stats) {
        stats[order.status]++
      }
    })

    return stats
  }

  const orderStats = getOrderStats()

  // 計算未來結算日期（下一個星期五）
  const getNextFriday = () => {
    const today = new Date()
    const dayOfWeek = today.getDay() // 0 = 星期日, 1 = 星期一, ..., 6 = 星期六
    const daysUntilFriday = (5 - dayOfWeek + 7) % 7 || 7 // 如果今天是星期五，則計算下週五
    const nextFriday = new Date(today)
    nextFriday.setDate(today.getDate() + daysUntilFriday)

    // 格式化日期為 YYYY-MM-DD
    return nextFriday.toISOString().split("T")[0]
  }

  // 獲取訂單狀態對應的標籤樣式
  const getStatusBadge = (status) => {
    switch (status) {
      case "awaiting_quote":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            等待報價
          </Badge>
        )
      case "quoted":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            已報價
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            待確認
          </Badge>
        )
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            已確認
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            已完成
          </Badge>
        )
      default:
        return <Badge variant="outline">未知</Badge>
    }
  }

  // 計算待結算金額
  const calculatePendingSettlement = () => {
    return recentOrders
      .filter((order) => order.status === "completed")
      .reduce((total, order) => total + order.amount * 0.3, 0) // 假設訂金為總金額的30%
  }

  // 獲取操作按鈕
  const getActionButton = (order) => {
    switch (order.status) {
      case "awaiting_quote":
        return (
          <Button size="sm" className="bg-orange-600 hover:bg-orange-700" asChild>
            <Link href={`/partner/quotes/${order.id}`}>立即報價</Link>
          </Button>
        )
      case "quoted":
        return (
          <Button size="sm" variant="outline" asChild>
            <Link href={`/partner/quotes/${order.id}`}>查看報價</Link>
          </Button>
        )
      case "pending":
      case "confirmed":
        return (
          <Button size="sm" variant="outline" asChild>
            <Link href={`/partner/jobs/${order.id}`}>查看詳情</Link>
          </Button>
        )
      case "completed":
        return (
          <Button size="sm" variant="ghost" asChild>
            <Link href={`/partner/jobs/${order.id}`}>查看記錄</Link>
          </Button>
        )
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tighter">合作夥伴儀表板</h1>
            <p className="text-gray-500 dark:text-gray-400">管理您的訂單和業務</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/partner/dashboard/settings">
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                公司設定
              </Button>
            </Link>
            <Link href="/partner/dashboard/profile">
              <Button variant="outline">
                <Building className="h-4 w-4 mr-2" />
                資料管理
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CalendarIcon className="h-4 w-4 text-primary" />
              <span>下次結算: {getNextFriday()} (星期五)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <span className="text-sm text-gray-500">等待報價</span>
                </div>
                <span className="text-2xl font-bold text-orange-600">{orderStats.awaiting_quote}</span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                  <span className="text-sm text-gray-500">已報價</span>
                </div>
                <span className="text-2xl font-bold text-purple-600">{orderStats.quoted}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <PackageIcon className="h-5 w-5 text-primary" />
                  <span className="text-sm text-gray-500">待確認訂單</span>
                </div>
                <span className="text-2xl font-bold">{orderStats.pending}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <TruckIcon className="h-5 w-5 text-primary" />
                  <span className="text-sm text-gray-500">進行中訂單</span>
                </div>
                <span className="text-2xl font-bold">{orderStats.confirmed}</span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <DollarSignIcon className="h-5 w-5 text-primary" />
                  <span className="text-sm text-gray-500">待結算金額</span>
                </div>
                <span className="text-2xl font-bold">HK${calculatePendingSettlement().toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>最近訂單</CardTitle>
            <CardDescription>查看和管理您的最近訂單</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>訂單編號</TableHead>
                  <TableHead>客戶</TableHead>
                  <TableHead>搬運路線</TableHead>
                  <TableHead>日期</TableHead>
                  <TableHead>描述</TableHead>
                  <TableHead>狀態</TableHead>
                  <TableHead className="text-right">金額</TableHead>
                  <TableHead className="text-center">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      {order.status === "awaiting_quote" || order.status === "quoted" ? (
                        <span className="text-primary">{order.id}</span>
                      ) : (
                        <Link href={`/partner/jobs/${order.id}`} className="text-primary hover:underline">
                          {order.id}
                        </Link>
                      )}
                    </TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>
                      {order.from} → {order.to}
                    </TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell className="text-sm text-gray-500">{order.description}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right">{order.amount > 0 ? `HK$${order.amount}` : "-"}</TableCell>
                    <TableCell className="text-center">{getActionButton(order)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline" size="sm" asChild>
              <Link href="/partner/jobs">查看所有訂單</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
