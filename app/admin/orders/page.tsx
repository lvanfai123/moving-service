import type { Metadata } from "next"
import Link from "next/link"
import { CalendarIcon, ArrowUpDown, MoreHorizontal, Search, Mail, MessageSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExportButton } from "@/components/admin/export-button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export const metadata: Metadata = {
  title: "訂單管理 | 搬屋師平台",
  description: "搬屋師平台訂單管理頁面",
}

export default function OrdersPage() {
  return (
    <div className="space-y-4 py-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">訂單管理</h2>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="搜尋訂單..." className="pl-8" />
          </div>
          <Button className="w-full sm:w-auto">
            <CalendarIcon className="mr-2 h-4 w-4" />
            篩選日期
          </Button>
          <ExportButton dataType="orders" className="w-full sm:w-auto" />
        </div>
      </div>
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
          <TabsTrigger value="all">全部訂單</TabsTrigger>
          <TabsTrigger value="pending">待確認</TabsTrigger>
          <TabsTrigger value="confirmed">已確認</TabsTrigger>
          <TabsTrigger value="completed">已完成</TabsTrigger>
          <TabsTrigger value="cancelled">已取消</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>訂單列表</CardTitle>
              <CardDescription>平台上的所有訂單記錄</CardDescription>
            </CardHeader>
            <CardContent className="px-0 sm:px-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">訂單編號</TableHead>
                      <TableHead>客戶</TableHead>
                      <TableHead>搬運公司</TableHead>
                      <TableHead>
                        <div className="flex items-center">
                          金額
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center">
                          日期
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>狀態</TableHead>
                      <TableHead>通知</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.company}</TableCell>
                        <TableCell>HK${order.amount}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          <OrderStatusBadge status={order.status} />
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center">
                                    <Badge
                                      variant={
                                        order.notificationStatus?.email === "sent"
                                          ? "default"
                                          : order.notificationStatus?.email === "partial"
                                            ? "secondary"
                                            : "outline"
                                      }
                                      className="h-6 px-2 rounded-full"
                                    >
                                      <Mail className="h-3 w-3" />
                                    </Badge>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    {order.notificationStatus?.email === "sent"
                                      ? "電子郵件已全部發送"
                                      : order.notificationStatus?.email === "partial"
                                        ? "部分電子郵件發送失敗"
                                        : order.notificationStatus?.email === "failed"
                                          ? "電子郵件發送失敗"
                                          : "尚未發送電子郵件"}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center">
                                    <Badge
                                      variant={
                                        order.notificationStatus?.sms === "sent"
                                          ? "default"
                                          : order.notificationStatus?.sms === "partial"
                                            ? "secondary"
                                            : "outline"
                                      }
                                      className="h-6 px-2 rounded-full"
                                    >
                                      <MessageSquare className="h-3 w-3" />
                                    </Badge>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    {order.notificationStatus?.sms === "sent"
                                      ? "短信已全部發送"
                                      : order.notificationStatus?.sms === "partial"
                                        ? "部分短信發送失敗"
                                        : order.notificationStatus?.sms === "failed"
                                          ? "短信發送失敗"
                                          : "尚未發送短信"}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">開啟選單</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>操作</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Link href={`/admin/orders/${order.id}`}>查看詳情</Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>編輯訂單</DropdownMenuItem>
                              <DropdownMenuItem>取消訂單</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>發送通知</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function OrderStatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, { label: string; variant: "outline" | "secondary" | "destructive" | "default" }> = {
    pending: { label: "待確認", variant: "outline" },
    confirmed: { label: "已確認", variant: "secondary" },
    completed: { label: "已完成", variant: "default" },
    cancelled: { label: "已取消", variant: "destructive" },
  }

  const { label, variant } = statusMap[status] || { label: status, variant: "outline" }

  return <Badge variant={variant}>{label}</Badge>
}

// 擴展訂單數據，添加通知狀態
const orders = [
  {
    id: "J-20230510-001",
    customer: "陳大文",
    company: "安心搬屋公司",
    amount: "2800",
    date: "2023-05-10",
    status: "completed",
    notificationStatus: {
      email: "sent",
      sms: "sent",
    },
  },
  {
    id: "J-20230512-002",
    customer: "李小明",
    company: "專業搬運有限公司",
    amount: "3200",
    date: "2023-05-12",
    status: "confirmed",
    notificationStatus: {
      email: "partial",
      sms: "sent",
    },
  },
  {
    id: "J-20230515-003",
    customer: "黃麗華",
    company: "快捷搬運服務",
    amount: "1500",
    date: "2023-05-15",
    status: "pending",
    notificationStatus: {
      email: null,
      sms: null,
    },
  },
  {
    id: "J-20230518-004",
    customer: "張三",
    company: "安心搬屋公司",
    amount: "2100",
    date: "2023-05-18",
    status: "cancelled",
    notificationStatus: {
      email: "sent",
      sms: "failed",
    },
  },
  {
    id: "J-20230520-005",
    customer: "劉志強",
    company: "專業搬運有限公司",
    amount: "3500",
    date: "2023-05-20",
    status: "confirmed",
    notificationStatus: {
      email: "sent",
      sms: "partial",
    },
  },
]
