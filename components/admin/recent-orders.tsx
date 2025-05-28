import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentOrders() {
  return (
    <div className="space-y-8">
      {recentOrders.map((order) => (
        <div key={order.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={order.avatar || "/placeholder.svg"} alt="Avatar" />
            <AvatarFallback>{order.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1 flex-1 min-w-0">
            <p className="text-sm font-medium leading-none truncate">{order.name}</p>
            <p className="text-sm text-muted-foreground truncate">{order.email}</p>
          </div>
          <div className="ml-auto font-medium whitespace-nowrap">+HK${order.amount}</div>
        </div>
      ))}
    </div>
  )
}

const recentOrders = [
  {
    id: "1",
    name: "陳大文",
    email: "chan@example.com",
    amount: "2800",
    avatar: "",
  },
  {
    id: "2",
    name: "李小明",
    email: "lee@example.com",
    amount: "3200",
    avatar: "",
  },
  {
    id: "3",
    name: "黃麗華",
    email: "wong@example.com",
    amount: "1500",
    avatar: "",
  },
  {
    id: "4",
    name: "張三",
    email: "cheung@example.com",
    amount: "2100",
    avatar: "",
  },
  {
    id: "5",
    name: "劉志強",
    email: "lau@example.com",
    amount: "3500",
    avatar: "",
  },
]
