import type { AdminOrderItem } from "@/types/admin"
import { cn } from "@/lib/utils"

function formatTHB(value: number) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
  }).format(value)
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const statusStyles: Record<string, string> = {
  delivered: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  received: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  processing: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
}

const statusLabels: Record<string, string> = {
  delivered: "สำเร็จ",
  received: "ได้รับแล้ว",
  processing: "กำลังดำเนินการ",
}

export function RecentOrdersTable({
  orders,
}: {
  orders: AdminOrderItem[]
}) {
  if (orders.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl border text-sm text-muted-foreground">
        ไม่มีออเดอร์
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">
              ออเดอร์
            </th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">
              ลูกค้า
            </th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">
              สถานะ
            </th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">
              ยอดรวม
            </th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">
              วันที่
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b last:border-0">
              <td className="px-4 py-3 font-medium">#{order.id}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {order.customerName ?? "-"}
              </td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
                    statusStyles[order.status ?? ""] ??
                      "bg-gray-100 text-gray-800"
                  )}
                >
                  {statusLabels[order.status ?? ""] ?? order.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right font-medium">
                {formatTHB(order.totalAmount)}
              </td>
              <td className="px-4 py-3 text-right text-muted-foreground">
                {formatDate(order.date)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
