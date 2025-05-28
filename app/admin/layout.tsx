import type { ReactNode } from "react"
import { AdminSidebar } from "@/components/admin/sidebar"

export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="mx-auto w-full">{children}</div>
      </div>
    </div>
  )
}
