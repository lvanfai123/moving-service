'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, RefreshCw, Database, Server, Key } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function TestDatabasePage() {
  const [loading, setLoading] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)
  const [clientTest, setClientTest] = useState<any>(null)

  const runTests = async () => {
    setLoading(true)
    
    // 測試 API 路由（服務端）
    try {
      const response = await fetch('/api/test-db')
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({ status: 'error', message: error instanceof Error ? error.message : 'Unknown error' })
    }

    // 測試客戶端 Supabase 連接
    try {
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1)
      
      setClientTest({
        connected: !error,
        error: error?.message,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      setClientTest({
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      })
    }

    setLoading(false)
  }

  useEffect(() => {
    runTests()
  }, [])

  const StatusIcon = ({ success }: { success: boolean }) => 
    success ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
            <Database className="h-8 w-8" />
            資料庫連接測試
          </h1>
          <p className="text-gray-600">測試 Supabase 資料庫連接狀態</p>
        </div>

        <div className="flex justify-center">
          <Button onClick={runTests} disabled={loading} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            重新測試
          </Button>
        </div>

        {/* 環境變數檢查 */}
        {testResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                環境變數狀態
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(testResult.environment || {}).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="font-mono text-sm">{key}</span>
                    <StatusIcon success={!!value} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 服務端連接測試 */}
        {testResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                服務端連接測試 (Service Role)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>整體連接狀態</span>
                  <StatusIcon success={testResult.database?.connected} />
                </div>
                
                {testResult.database?.tables && (
                  <div className="border-t pt-4 space-y-2">
                    <p className="text-sm font-semibold text-gray-600">資料表狀態：</p>
                    {Object.entries(testResult.database.tables).map(([table, status]: [string, any]) => (
                      <div key={table} className="flex items-center justify-between pl-4">
                        <span className="font-mono text-sm">{table}</span>
                        <div className="flex items-center gap-2">
                          {status.error ? (
                            <>
                              <span className="text-xs text-red-500">{status.error}</span>
                              <XCircle className="h-4 w-4 text-red-500" />
                            </>
                          ) : (
                            <>
                              <span className="text-xs text-green-500">OK</span>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 客戶端連接測試 */}
        {clientTest && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                客戶端連接測試 (Anon Key)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span>連接狀態</span>
                <div className="flex items-center gap-2">
                  {clientTest.error && (
                    <span className="text-xs text-red-500">{clientTest.error}</span>
                  )}
                  <StatusIcon success={clientTest.connected} />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Supabase URL */}
        {testResult?.supabase && (
          <Card>
            <CardHeader>
              <CardTitle>Supabase 配置</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Project URL</span>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">{testResult.supabase.url}</code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">測試時間</span>
                  <span className="text-xs text-gray-600">
                    {new Date(testResult.timestamp).toLocaleString('zh-TW')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 錯誤訊息 */}
        {testResult?.status === 'error' && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-700">錯誤</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600">{testResult.message}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 