export interface QuoteRequestItem {
  id: string
  category: string
  type: string
  quantity: number
  dimensions?: {
    length?: number
    width?: number
    height?: number
  }
  needDisposal: boolean
  notes?: string
}

export interface PackagingService {
  boxes: {
    needed: boolean
    quantity: number
  }
  bubbleWrap: {
    needed: boolean
    quantity: number
  }
  specialPackaging?: string
}

export interface AdditionalService {
  disposalService: boolean // 封裝箱開箱服務
  storageService: boolean
  furnitureAssembly: boolean
  governmentDisposalFee: boolean // $250/噸
}

export interface AddressDetails {
  address: string
  buildingType:
    | "ground_floor"
    | "second_floor_no_elevator"
    | "elevator_no_direct_access"
    | "stairs_only"
    | "elevator_size_limit"
    | "narrow_entrance"
    | "village_house"
    | "other"
  elevatorWidth?: number
  entranceWidth?: number
  specialNotes?: string
}

export interface QuoteRequest {
  id: string
  customerName: string
  customerPhone: string
  customerEmail: string
  fromAddress: AddressDetails
  toAddress: AddressDetails
  movingDate: string
  movingTime: string
  items: QuoteRequestItem[]
  packagingServices: PackagingService
  additionalServices: AdditionalService
  specialRequirements?: string
  createdAt: string
  status: "pending" | "sent" | "quoted" | "accepted" | "completed" | "cancelled"
  notificationStatus?: {
    email: {
      total: number
      sent: number
      failed: number
    }
    sms: {
      total: number
      sent: number
      failed: number
    }
  }
}
