"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { BUILDING_TYPES } from "@/lib/items-config"
import type { AddressDetails } from "@/types/quote-request"

interface AddressDetailsProps {
  label: string
  address: AddressDetails
  onAddressChange: (address: AddressDetails) => void
}

export function AddressDetailsComponent({ label, address, onAddressChange }: AddressDetailsProps) {
  const updateAddress = (updates: Partial<AddressDetails>) => {
    onAddressChange({ ...address, ...updates })
  }

  const needsElevatorWidth = address.buildingType === "elevator_size_limit"
  const needsEntranceWidth = address.buildingType === "narrow_entrance"
  const needsSpecialNotes = address.buildingType === "other"

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`address-${label}`}>{label}</Label>
        <Input
          id={`address-${label}`}
          placeholder={`請輸入${label}`}
          value={address.address}
          onChange={(e) => updateAddress({ address: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>建築物類型</Label>
        <Select
          value={address.buildingType}
          onValueChange={(value) =>
            updateAddress({
              buildingType: value as AddressDetails["buildingType"],
              elevatorWidth: undefined,
              entranceWidth: undefined,
              specialNotes: undefined,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="請選擇建築物類型" />
          </SelectTrigger>
          <SelectContent>
            {BUILDING_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {needsElevatorWidth && (
        <div className="space-y-2">
          <Label>升降機出口寬度 (呎)</Label>
          <Input
            type="number"
            placeholder="請輸入升降機出口寬度"
            value={address.elevatorWidth || ""}
            onChange={(e) => updateAddress({ elevatorWidth: Number.parseFloat(e.target.value) || undefined })}
          />
        </div>
      )}

      {needsEntranceWidth && (
        <div className="space-y-2">
          <Label>入口寬度 (呎)</Label>
          <Input
            type="number"
            placeholder="請輸入入口寬度"
            value={address.entranceWidth || ""}
            onChange={(e) => updateAddress({ entranceWidth: Number.parseFloat(e.target.value) || undefined })}
          />
        </div>
      )}

      {needsSpecialNotes && (
        <div className="space-y-2">
          <Label>特殊情況說明</Label>
          <Textarea
            placeholder="請詳細描述特殊情況"
            value={address.specialNotes || ""}
            onChange={(e) => updateAddress({ specialNotes: e.target.value })}
            rows={3}
          />
        </div>
      )}
    </div>
  )
}
