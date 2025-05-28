"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { PackagingService, AdditionalService } from "@/types/quote-request"

interface PackagingServicesProps {
  packagingServices: PackagingService
  additionalServices: AdditionalService
  onPackagingChange: (services: PackagingService) => void
  onAdditionalChange: (services: AdditionalService) => void
  specialPackaging: string
  onSpecialPackagingChange: (value: string) => void
}

export function PackagingServices({
  packagingServices,
  additionalServices,
  onPackagingChange,
  onAdditionalChange,
  specialPackaging,
  onSpecialPackagingChange,
}: PackagingServicesProps) {
  return (
    <div className="space-y-6">
      {/* 包裝材料 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">包裝材料</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="boxes"
                  checked={packagingServices.boxes.needed}
                  onCheckedChange={(checked) =>
                    onPackagingChange({
                      ...packagingServices,
                      boxes: { ...packagingServices.boxes, needed: !!checked },
                    })
                  }
                />
                <Label htmlFor="boxes" className="font-medium">
                  紙箱
                </Label>
              </div>
              {packagingServices.boxes.needed && (
                <Input
                  type="number"
                  min="1"
                  placeholder="數量"
                  value={packagingServices.boxes.quantity}
                  onChange={(e) =>
                    onPackagingChange({
                      ...packagingServices,
                      boxes: { ...packagingServices.boxes, quantity: Number.parseInt(e.target.value) || 0 },
                    })
                  }
                />
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bubble-wrap"
                  checked={packagingServices.bubbleWrap.needed}
                  onCheckedChange={(checked) =>
                    onPackagingChange({
                      ...packagingServices,
                      bubbleWrap: { ...packagingServices.bubbleWrap, needed: !!checked },
                    })
                  }
                />
                <Label htmlFor="bubble-wrap" className="font-medium">
                  氣泡膠紙
                </Label>
              </div>
              {packagingServices.bubbleWrap.needed && (
                <Input
                  type="number"
                  min="1"
                  placeholder="數量"
                  value={packagingServices.bubbleWrap.quantity}
                  onChange={(e) =>
                    onPackagingChange({
                      ...packagingServices,
                      bubbleWrap: { ...packagingServices.bubbleWrap, quantity: Number.parseInt(e.target.value) || 0 },
                    })
                  }
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="special-packaging">特定包裝需求</Label>
            <Textarea
              id="special-packaging"
              placeholder="請描述任何特殊包裝需求"
              value={specialPackaging}
              onChange={(e) => onSpecialPackagingChange(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* 增值服務 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">增值服務</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="disposal-service"
                checked={additionalServices.disposalService}
                onCheckedChange={(checked) =>
                  onAdditionalChange({
                    ...additionalServices,
                    disposalService: !!checked,
                  })
                }
              />
              <Label htmlFor="disposal-service" className="font-medium">
                封裝箱開箱服務
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="storage-service"
                checked={additionalServices.storageService}
                onCheckedChange={(checked) =>
                  onAdditionalChange({
                    ...additionalServices,
                    storageService: !!checked,
                  })
                }
              />
              <Label htmlFor="storage-service" className="font-medium">
                存倉服務
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="furniture-assembly"
                checked={additionalServices.furnitureAssembly}
                onCheckedChange={(checked) =>
                  onAdditionalChange({
                    ...additionalServices,
                    furnitureAssembly: !!checked,
                  })
                }
              />
              <Label htmlFor="furniture-assembly" className="font-medium">
                家具拆裝服務
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="government-disposal-fee"
                checked={additionalServices.governmentDisposalFee}
                onCheckedChange={(checked) =>
                  onAdditionalChange({
                    ...additionalServices,
                    governmentDisposalFee: !!checked,
                  })
                }
              />
              <Label htmlFor="government-disposal-fee" className="font-medium">
                政府垃圾處置費用
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>$250/噸</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
