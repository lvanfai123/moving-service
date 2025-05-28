import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface RefundInfoTooltipProps {
  className?: string
}

export function RefundInfoTooltip({ className }: RefundInfoTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className={`h-4 w-4 text-muted-foreground cursor-help ${className || ""}`} />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-2">
            <p className="font-medium">退款政策</p>
            <ul className="text-sm space-y-1">
              <li>• 服務開始前24小時可全額退款</li>
              <li>• 服務開始前12小時退款收取10%手續費</li>
              <li>• 服務開始前6小時退款收取20%手續費</li>
              <li>• 服務開始後不接受退款申請</li>
              <li>• 因天氣等不可抗力因素可協商退款</li>
            </ul>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default RefundInfoTooltip
