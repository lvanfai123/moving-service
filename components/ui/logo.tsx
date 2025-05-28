import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export function Logo({ size = "md", showText = true }: LogoProps) {
  const sizeMap = {
    sm: 50,
    md: 70,
    lg: 90,
  }

  const height = sizeMap[size]

  return (
    <Link href="/" className="flex items-center space-x-3">
      <div className="relative" style={{ height, width: height }}>
        <Image src="/logo.png" alt="搬屋師" fill style={{ objectFit: "contain" }} priority unoptimized />
      </div>
      {showText && (
        <div className="font-medium text-sm md:text-base text-gray-700">
          <span className="text-primary font-bold">搬屋師</span>
          <div className="text-xs text-gray-500">#一小時內至少三份報價</div>
        </div>
      )}
    </Link>
  )
}
