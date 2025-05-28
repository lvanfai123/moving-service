"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestLoginPage() {
  const { login, logout, isLoggedIn, userName } = useAuth()

  const handleLogin = () => {
    login("12345678", "測試用戶")
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>測試登入功能</CardTitle>
          <CardDescription>用於測試登入/登出功能</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoggedIn ? (
            <div>
              <p className="text-green-600 mb-4">已登入為: {userName}</p>
              <Button onClick={logout} variant="destructive" className="w-full">
                登出
              </Button>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-4">目前未登入</p>
              <Button onClick={handleLogin} className="w-full">
                登入為用戶 12345678
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
