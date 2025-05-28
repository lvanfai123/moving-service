import Image from "next/image"

interface PartnerLogoProps {
  src: string
  alt: string
  size?: "sm" | "md" | "lg"
}

export function PartnerLogo({ src, alt, size = "md" }: PartnerLogoProps) {
  const sizeMap = {
    sm: 80,
    md: 100,
    lg: 120,
  }

  const diameter = sizeMap[size]

  return (
    <div
      className="relative bg-white rounded-full overflow-hidden border border-gray-200 flex items-center justify-center"
      style={{ width: diameter, height: diameter }}
    >
      <div className="relative w-[80%] h-[80%]">
        <Image src={src || "/placeholder.svg"} alt={alt} fill className="object-contain" sizes={`${diameter}px`} />
      </div>
    </div>
  )
}
