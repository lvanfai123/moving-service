"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Gift, DollarSign, TrendingUp, Search, Download } from "lucide-react"

export default function AdminReferralsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // 模擬數據
  const stats = {
    totalReferrals: 156,
    activeReferrers: 89,
    totalRewards: 31200,
    conversionRate: 68.5,
  }

  const referralData = [
    {
      id: "REF001",
      referrerName: "陳大文",
      referrerEmail: "chan@example.com",
      refereeName: "李小明",
      refereeEmail: "li@example.com",
      referralCode: "MOVE2024ABC",
      status: "completed",
      rewardAmount: 200,
      createdAt: "2024-01-15",
      completedAt: "2024-01-20",
    },
    {
      id: "REF002",
      referrerName: "王美麗",
      referrerEmail: "wang@example.com",
      refereeName: "張志明",
      refereeEmail: "zhang@example.com",
      referralCode: "MOVE2024DEF",
      status: "pending",
      rewardAmount: 0,
      createdAt: "2024-01-18",
      completedAt: null,
    },
    // 更多數據...
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">已完成</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">等待中</Badge>
      case "expired":
        return (
          <Badge variant="outline" className="border-red-500 text-red-500">
            已過期
          </Badge>
        )
      default:
        return <Badge variant="outline">未知</Badge>
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">推薦管理</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            導出數據
          </Button>
        </div>
      </div>

      {/* 統計卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">總推薦數</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReferrals}</div>
            <p className="text-xs text-muted-foreground">+12% 較上月</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">活躍推薦者</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeReferrers}</div>
            <p className="text-xs text-muted-foreground">+8% 較上月</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">總獎勵金額</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRewards}</div>
            <p className="text-xs text-muted-foreground">+15% 較上月</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">轉化率</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">+2.1% 較上月</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">全部推薦</TabsTrigger>
          <TabsTrigger value="completed">已完成</TabsTrigger>
          <TabsTrigger value="pending">等待中</TabsTrigger>
          <TabsTrigger value="expired">已過期</TabsTrigger>
        </TabsList>

        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索推薦者或被推薦者..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>推薦記錄</CardTitle>
              <CardDescription>查看所有推薦活動的詳細記錄</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>推薦者</TableHead>
                    <TableHead>被推薦者</TableHead>
                    <TableHead>邀請碼</TableHead>
                    <TableHead>狀態</TableHead>
                    <TableHead>獎勵金額</TableHead>
                    <TableHead>創建時間</TableHead>
                    <TableHead>完成時間</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referralData.map((referral) => (
                    <TableRow key={referral.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{referral.referrerName}</div>
                          <div className="text-sm text-muted-foreground">{referral.referrerEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{referral.refereeName}</div>
                          <div className="text-sm text-muted-foreground">{referral.refereeEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">{referral.referralCode}</code>
                      </TableCell>
                      <TableCell>{getStatusBadge(referral.status)}</TableCell>
                      <TableCell>{referral.rewardAmount > 0 ? `$${referral.rewardAmount}` : "-"}</TableCell>
                      <TableCell>{referral.createdAt}</TableCell>
                      <TableCell>{referral.completedAt || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>已完成推薦</CardTitle>
              <CardDescription>已成功完成並發放獎勵的推薦記錄</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>推薦者</TableHead>
                    <TableHead>被推薦者</TableHead>
                    <TableHead>邀請碼</TableHead>
                    <TableHead>獎勵金額</TableHead>
                    <TableHead>完成時間</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referralData
                    .filter((r) => r.status === "completed")
                    .map((referral) => (
                      <TableRow key={referral.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{referral.referrerName}</div>
                            <div className="text-sm text-muted-foreground">{referral.referrerEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{referral.refereeName}</div>
                            <div className="text-sm text-muted-foreground">{referral.refereeEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">{referral.referralCode}</code>
                        </TableCell>
                        <TableCell className="text-green-600 font-medium">${referral.rewardAmount}</TableCell>
                        <TableCell>{referral.completedAt}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>等待中推薦</CardTitle>
              <CardDescription>等待被推薦者完成首次訂單的推薦記錄</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>推薦者</TableHead>
                    <TableHead>被推薦者</TableHead>
                    <TableHead>邀請碼</TableHead>
                    <TableHead>創建時間</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referralData
                    .filter((r) => r.status === "pending")
                    .map((referral) => (
                      <TableRow key={referral.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{referral.referrerName}</div>
                            <div className="text-sm text-muted-foreground">{referral.referrerEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{referral.refereeName}</div>
                            <div className="text-sm text-muted-foreground">{referral.refereeEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">{referral.referralCode}</code>
                        </TableCell>
                        <TableCell>{referral.createdAt}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            查看詳情
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expired" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>已過期推薦</CardTitle>
              <CardDescription>超過有效期未完成的推薦記錄</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">暫無過期的推薦記錄</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
