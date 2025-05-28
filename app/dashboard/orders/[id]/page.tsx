import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import Link from "next/link"

interface OrderData {
  id: string
  status: "pending" | "processing" | "completed" | "cancelled"
  // Add other order data properties as needed
}

interface Props {
  params: {
    id: string
  }
}

const OrderDetailPage = async ({ params }: Props) => {
  const orderId = params.id

  // Mock order data (replace with actual data fetching)
  const orderData: OrderData = {
    id: orderId,
    status: "completed", // Example status
  }

  return (
    <div>
      <h1>Order Details</h1>
      <p>Order ID: {orderId}</p>
      <p>Status: {orderData.status}</p>

      {/* 在訂單狀態為 "completed" 時顯示評價按鈕 */}
      {orderData.status === "completed" && (
        <div className="mt-4">
          <Link href={`/review/${orderData.id}`}>
            <Button variant="outline" className="w-full">
              <Star className="h-4 w-4 mr-2" />
              評價服務
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default OrderDetailPage
