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
import { ExportButton } from "@/components/admin/export-button"
import { AddUserForm } from "@/components/admin/add-user-form"

export const metadata: Metadata = {
  title: "用戶管理 | 搬屋師平台",
  description: "搬屋師平台用戶管理頁面",
}

export default function UsersPage() {
  return (
    <div className="space-y-4 py-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">用戶管理</h2>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="搜尋用戶..." className="pl-8" />
          </div>
          <AddUserForm />
          <ExportButton dataType="users" className="w-full sm:w-auto" />
        </div>
      </div>
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
          <TabsTrigger value="all">全部用戶</TabsTrigger>
          <TabsTrigger value="active">活躍用戶</TabsTrigger>
          <TabsTrigger value="inactive">非活躍用戶</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>用戶列表</CardTitle>
              <CardDescription>平台上的所有註冊用戶</CardDescription>
            </CardHeader>
            <CardContent className="px-0 sm:px-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">用戶ID</TableHead>
                      <TableHead>姓名</TableHead>
                      <TableHead>電郵</TableHead>
                      <TableHead>電話</TableHead>
                      <TableHead>
                        <div className="flex items-center">
                          註冊日期
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center">
                          訂單數
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>狀態</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>{user.registeredDate}</TableCell>
                        <TableCell>{user.orderCount}</TableCell>
                        <TableCell>
                          <UserStatusBadge status={user.status} />
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
                                <Link href={`/admin/users/${user.id}`}>查看詳情</Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/users/${user.id}/edit`}>編輯用戶</Link>
                              </DropdownMenuItem>
                              {user.status === "active" && (
                                <DropdownMenuItem className="text-destructive">停用帳戶</DropdownMenuItem>
                              )}
                              {(user.status === "suspended" || user.status === "inactive") && (
                                <DropdownMenuItem>重新啟用</DropdownMenuItem>
                              )}
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

function UserStatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, { label: string; variant: "outline" | "secondary" | "destructive" | "default" }> = {
    active: { label: "活躍", variant: "default" },
    inactive: { label: "非活躍", variant: "outline" },
    suspended: { label: "已停用", variant: "destructive" },
  }

  const { label, variant } = statusMap[status] || { label: status, variant: "outline" }

  return <Badge variant={variant}>{label}</Badge>
}

const users = [
  {
    id: "U001",
    name: "陳大文",
    email: "chan@example.com",
    phone: "9123 4567",
    registeredDate: "2023-01-15",
    orderCount: 3,
    status: "active",
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
