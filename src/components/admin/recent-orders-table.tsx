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
  delivered: "text-secondary",
  received: "text-primary",
  processing: "text-destructive",
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
      <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
        ไม่มีออเดอร์
      </div>
    )
  }

  return (
    <div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              ออเดอร์
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              ลูกค้า
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              สถานะ
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">
              ยอดรวม
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">
              วันที่
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b border-border transition-colors last:border-0 hover:bg-muted"
            >
              <td className="px-4 py-3 font-medium text-foreground">#{order.id}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {order.customerName ?? "-"}
              </td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "text-xs font-medium",
                    statusStyles[order.status ?? ""] ??
                      "text-muted-foreground"
                  )}
                >
                  {statusLabels[order.status ?? ""] ?? order.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right font-medium text-foreground">
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
