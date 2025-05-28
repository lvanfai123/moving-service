import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpDown, MoreHorizontal, Search } from "lucide-react"

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
import { AddPartnerForm } from "@/components/admin/add-partner-form"

export const metadata: Metadata = {
  title: "合作伙伴管理 | 搬屋師平台",
  description: "搬屋師平台合作伙伴管理頁面",
}

export default function PartnersPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">合作伙伴管理</h2>
        <div className="flex items-center space-x-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="搜尋合作伙伴..." className="pl-8" />
          </div>
          <AddPartnerForm />
        </div>
      </div>
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">全部合作伙伴</TabsTrigger>
          <TabsTrigger value="active">已審核</TabsTrigger>
          <TabsTrigger value="pending">待審核</TabsTrigger>
          <TabsTrigger value="suspended">已停用</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>合作伙伴列表</CardTitle>
              <CardDescription>平台上的所有搬運公司合作伙伴</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">公司ID</TableHead>
                    <TableHead>公司名稱</TableHead>
                    <TableHead>聯絡人</TableHead>
                    <TableHead>電話</TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        加入日期
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        完成訂單
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        評分
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>狀態</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partners.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell className="font-medium">{partner.id}</TableCell>
                      <TableCell>{partner.name}</TableCell>
                      <TableCell>{partner.contactPerson}</TableCell>
                      <TableCell>{partner.phone}</TableCell>
                      <TableCell>{partner.joinDate}</TableCell>
                      <TableCell>{partner.completedOrders}</TableCell>
                      <TableCell>{partner.rating}</TableCell>
                      <TableCell>
                        <PartnerStatusBadge status={partner.status} />
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
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/partners/${partner.id}`}>查看詳情</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/partners/${partner.id}/edit`}>編輯資料</Link>
                            </DropdownMenuItem>
                            {partner.status === "pending" && <DropdownMenuItem>審核申請</DropdownMenuItem>}
                            {partner.status === "active" && (
                              <DropdownMenuItem className="text-destructive">停用帳戶</DropdownMenuItem>
                            )}
                            {partner.status === "suspended" && <DropdownMenuItem>重新啟用</DropdownMenuItem>}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
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

const partners = [
  {
    id: "P001",
    name: "安心搬屋公司",
    contactPerson: "王經理",
    phone: "9876 5432",
    joinDate: "2022-10-01",
    completedOrders: 42,
    rating: "4.8",
    status: "active",
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
  },
]
