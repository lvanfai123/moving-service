// 簡化的數據服務，避免使用可能導致問題的操作

// 訂單數據
const ordersData = [
  {
    id: "J-20230510-001",
    customer: "陳大文",
    company: "安心搬屋公司",
    amount: "2800",
    date: "2023-05-10",
    status: "completed",
  },
  {
    id: "J-20230512-002",
    customer: "李小明",
    company: "專業搬運有限公司",
    amount: "3200",
    date: "2023-05-12",
    status: "confirmed",
  },
  // 其他數據保持不變
]

// 用戶數據
const usersData = [
  {
    id: "U001",
    name: "陳大文",
    email: "chan@example.com",
    phone: "9123 4567",
    registeredDate: "2023-01-15",
    orderCount: 3,
    status: "active",
  },
  // 其他數據保持不變
]

// 合作伙伴數據
const partnersData = [
  {
    id: "P001",
    name: "安心搬屋公司",
    contactPerson: "王經理",
    email: "ongshing@example.com",
    phone: "2123 4567",
    registeredDate: "2022-12-01",
    rating: 4.8,
    orderCount: 25,
    status: "active",
  },
  {
    id: "P002",
    name: "專業搬運有限公司",
    contactPerson: "張經理",
    email: "promoving@example.com",
    phone: "2234 5678",
    registeredDate: "2022-11-15",
    rating: 4.6,
    orderCount: 18,
    status: "active",
  },
  {
    id: "P003",
    name: "快捷搬屋服務",
    contactPerson: "劉小姐",
    email: "fastmove@example.com",
    phone: "2345 6789",
    registeredDate: "2023-01-10",
    rating: 4.3,
    orderCount: 12,
    status: "active",
  },
  {
    id: "P004",
    name: "城市搬運公司",
    contactPerson: "黃先生",
    email: "citymove@example.com",
    phone: "2456 7890",
    registeredDate: "2023-02-05",
    rating: 4.7,
    orderCount: 8,
    status: "inactive",
  },
  // 其他數據保持不變
]

// 付款數據
const paymentsData = [
  {
    id: "T001",
    orderId: "J-20230510-001",
    customer: "陳大文",
    company: "安心搬屋公司",
    amount: "840",
    date: "2023-05-10",
    type: "deposit",
    status: "completed",
  },
  // 其他數據保持不變
]

// 簡化的數據獲取函數
export async function getOrders(filters: Record<string, any> = {}) {
  return Promise.resolve(ordersData)
}

export async function getUsers(filters: Record<string, any> = {}) {
  return Promise.resolve(usersData)
}

export async function getPartners(filters: Record<string, any> = {}) {
  return Promise.resolve(partnersData)
}

export async function getPayments(filters: Record<string, any> = {}) {
  return Promise.resolve(paymentsData)
}

// 添加獲取活躍合作伙伴的函數
export async function getActivePartners() {
  // 過濾狀態為 "active" 的合作伙伴
  const activePartners = partnersData.filter((partner) => partner.status === "active")

  // 返回活躍合作伙伴列表
  return Promise.resolve(
    activePartners.map((partner) => ({
      id: partner.id,
      name: partner.name,
      email: partner.email,
      phone: partner.phone,
      contactPerson: partner.contactPerson,
    })),
  )
}
