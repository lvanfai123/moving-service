import Link from "next/link"
import { CheckCircle, Star, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface QuoteCardProps {
  id: string
  companyName: string
  companyCode: string
  rating: number
  price: number
  availableDates: string[]
  isSelected?: boolean
  quoteId: string
}

export function QuoteCard({
  id,
  companyName,
  companyCode,
  rating,
  price,
  availableDates,
  isSelected = false,
  quoteId,
}: QuoteCardProps) {
  // 將評分轉換為整數和小數部分
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">搬運公司 {companyCode.split("-")[0]}</h4>
              <div className="flex items-center text-yellow-500">
                {/* 完整星星 */}
                {Array.from({ length: fullStars }).map((_, i) => (
                  <Star key={`full-${i}`} className="h-4 w-4 fill-current" />
                ))}

                {/* 半星 */}
                {hasHalfStar && (
                  <div className="relative">
                    <Star className="h-4 w-4 text-gray-300" />
                    <div className="absolute top-0 left-0 overflow-hidden" style={{ width: "50%" }}>
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    </div>
                  </div>
                )}

                {/* 空星星 */}
                {Array.from({ length: 5 - fullStars - (hasHalfStar ? 1 : 0) }).map((_, i) => (
                  <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
                ))}

                <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">{rating.toFixed(1)}</span>
              </div>
            </div>

            {/* 醒目顯示價格 */}
            <div className="mt-3 mb-2">
              <div className="flex items-baseline">
                <span className="text-sm text-gray-500 mr-2">報價</span>
                <span className="text-3xl font-bold text-primary">HK${price.toLocaleString()}</span>
              </div>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400">可搬運日期: {availableDates.join(", ")}</p>
          </div>
          <div>
            {!isSelected ? (
              <Link href={`/payment/${quoteId}`}>
                <Button size="lg" className="bg-primary hover:bg-primary-600 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  <span>選擇並支付訂金</span>
                </Button>
              </Link>
            ) : (
              <Button size="lg" className="bg-green-600 hover:bg-green-700 flex items-center gap-1">
                <Truck className="h-4 w-4" />
                <span>已選擇</span>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
