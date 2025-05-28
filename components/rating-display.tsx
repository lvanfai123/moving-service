import { Star } from "lucide-react"

interface RatingDisplayProps {
  rating: number
  reviewCount: number
  showCount?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export function RatingDisplay({
  rating,
  reviewCount,
  showCount = true,
  size = "md",
  className = "",
}: RatingDisplayProps) {
  // 將評分轉換為整數和小數部分
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  // 根據尺寸設置星星大小
  const starSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  const starSize = starSizes[size]
  const textSize = size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex">
        {/* 完整星星 */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className={`${starSize} text-yellow-500 fill-yellow-500`} />
        ))}

        {/* 半星 */}
        {hasHalfStar && (
          <div className="relative">
            <Star className={`${starSize} text-gray-300`} />
            <div className="absolute top-0 left-0 overflow-hidden" style={{ width: "50%" }}>
              <Star className={`${starSize} text-yellow-500 fill-yellow-500`} />
            </div>
          </div>
        )}

        {/* 空星星 */}
        {Array.from({ length: 5 - fullStars - (hasHalfStar ? 1 : 0) }).map((_, i) => (
          <Star key={`empty-${i}`} className={`${starSize} text-gray-300`} />
        ))}
      </div>

      {/* 評分數字和評價數量 */}
      {showCount && (
        <span className={`ml-1 ${textSize} text-gray-600 dark:text-gray-400`}>
          {rating.toFixed(1)} ({reviewCount})
        </span>
      )}
    </div>
  )
}
