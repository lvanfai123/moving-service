import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpDown, MoreHorizontal, Search, Calendar } from "lucide-react"

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

export const metadata: Metadata = {
  title: "付款記錄 | 搬屋師平台",
  description: "搬屋師平台付款記錄頁面",
}

export default function PaymentsPage() {
  return (
    <div className="space-y-4 py-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">付款記錄</h2>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="搜尋付款記錄..." className="pl-8" />
          </div>
          <Button className="w-full sm:w-auto">
            <Calendar className="mr-2 h-4 w-4" />
            篩選日期
          </Button>
          <ExportButton dataType="payments" className="w-full sm:w-auto" />
        </div>
      </div>
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
          <TabsTrigger value="all">全部記錄</TabsTrigger>
          <TabsTrigger value="deposit">訂金付款</TabsTrigger>
          <TabsTrigger value="settlement">結算付款</TabsTrigger>
          <TabsTrigger value="refund">退款記錄</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>付款記錄列表</CardTitle>
              <CardDescription>平台上的所有付款交易記錄</CardDescription>
            </CardHeader>
            <CardContent className="px-0 sm:px-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">交易編號</TableHead>
                      <TableHead>訂單編號</TableHead>
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
                      <TableHead>類型</TableHead>
                      <TableHead>狀態</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.id}</TableCell>
                        <TableCell>{payment.orderId}</TableCell>
                        <TableCell>{payment.customer}</TableCell>
                        <TableCell>{payment.company}</TableCell>
                        <TableCell>HK${payment.amount}</TableCell>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>
                          <PaymentTypeBadge type={payment.type} />
                        </TableCell>
                        <TableCell>
                          <PaymentStatusBadge status={payment.status} />
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
                                <Link href={`/admin/payments/${payment.id}`}>查看詳情</Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>下載收據</DropdownMenuItem>
                              <DropdownMenuItem>處理退款</DropdownMenuItem>
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

function PaymentTypeBadge({ type }: { type: string }) {
  const typeMap: Record<string, { label: string; variant: "outline" | "secondary" | "destructive" | "default" }> = {
    deposit: { label: "訂金", variant: "secondary" },
    settlement: { label: "結算", variant: "default" },
    refund: { label: "退款", variant: "destructive" },
  }

  const { label, variant } = typeMap[type] || { label: type, variant: "outline" }

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

const payments = [
  {
    id: "T001",
    orderId: "J-20230510-001",
    customer: "陳大文",
    company: "安心搬屋公司",
    amount: "840",
    date: "2023-05-10",
    type: "deposit",
    status: "completed",
  },
  {
    id: "T002",
    orderId: "J-20230512-002",
    customer: "李小明",
    company: "專業搬運有限公司",
    amount: "960",
    date: "2023-05-12",
    type: "deposit",
    status: "completed",
  },
  {
    id: "T003",
    orderId: "J-20230510-001",
    company: "安心搬屋公司",
    customer: "陳大文",
    amount: "756",
    date: "2023-05-12",
    type: "settlement",
    status: "completed",
  },
  {
    id: "T004",
    orderId: "J-20230515-003",
    customer: "黃麗華",
    company: "快捷搬運服務",
    amount: "450",
    date: "2023-05-15",
    type: "deposit",
    status: "pending",
  },
  {
    id: "T005",
    orderId: "J-20230518-004",
    customer: "張三",
    company: "安心搬屋公司",
    amount: "630",
    date: "2023-05-18",
    type: "refund",
    status: "completed",
  },
]
