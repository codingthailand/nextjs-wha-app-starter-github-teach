"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import type { RevenuePoint } from "@/types/admin"

const formatter = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export function RevenueChart({ data }: { data: RevenuePoint[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-80 items-center justify-center rounded-xl border text-sm text-muted-foreground">
        ไม่มีข้อมูลรายได้ในช่วงเวลานี้
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card p-4">
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(v: number) => formatter.format(v)}
            className="text-muted-foreground"
          />
          <Tooltip
            formatter={(value, name) => {
              if (name === "revenue") return [formatter.format(Number(value)), "รายได้"]
              return [Number(value), "ออเดอร์"]
            }}
            labelFormatter={(label) => `วันที่ ${label}`}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="var(--color-primary, hsl(var(--primary)))"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
