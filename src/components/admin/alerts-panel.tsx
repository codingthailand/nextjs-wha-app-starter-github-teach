import { RiFlashlightLine, RiAlertLine, RiTimeLine } from "@remixicon/react"
import type { AdminOrderItem } from "@/types/admin"

const statusLabels: Record<string, { label: string; icon: typeof RiAlertLine }> = {
  processing: { label: "รอดำเนินการ", icon: RiTimeLine },
}

export function AlertsPanel({ orders }: { orders: AdminOrderItem[] }) {
  const alerts = orders.filter((o) => o.status === "processing")

  if (alerts.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-base font-semibold text-foreground">การแจ้งเตือน</h3>
        <div className="flex items-center gap-3 border-l-4 border-secondary bg-muted/50 p-4 pl-3">
          <RiFlashlightLine className="size-5 shrink-0 text-secondary" />
          <p className="text-sm text-muted-foreground">ไม่มีออเดอร์ที่รอดำเนินการ</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
        <RiAlertLine className="size-5 text-destructive" />
        การแจ้งเตือน
        <span className="ml-auto rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
          {alerts.length}
        </span>
      </h3>
      <div className="space-y-3">
        {alerts.map((order) => {
          const info = statusLabels[order.status ?? ""]
          const Icon = info?.icon ?? RiAlertLine
          return (
            <div
              key={order.id}
              className="border-l-4 border-destructive bg-[#3A1C1C] p-4 pl-3"
            >
              <div className="flex items-start gap-3">
                <Icon className="mt-0.5 size-5 shrink-0 text-destructive" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-destructive">
                    ออเดอร์ #{order.id}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {order.customerName ?? "ไม่ระบุ"} — {new Date(order.date).toLocaleDateString("th-TH")}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
