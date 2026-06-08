"use client"

import {
  AreaChart,
  Area,
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
      <div className="flex h-80 items-center justify-center text-sm text-muted-foreground">
        ไม่มีข้อมูลรายได้ในช่วงเวลานี้
      </div>
    )
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#30D158" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#2C2C2E" strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "#98989D" }}
            interval="preserveStartEnd"
            axisLine={{ stroke: "#2C2C2E" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#98989D" }}
            tickFormatter={(v: number) => formatter.format(v)}
            axisLine={{ stroke: "#2C2C2E" }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1E1E1E",
              border: "1px solid #2C2C2E",
              borderRadius: "8px",
              color: "#FFFFFF",
            }}
            formatter={(value, name) => {
              if (name === "revenue") return [formatter.format(Number(value)), "รายได้"]
              return [Number(value), "ออเดอร์"]
            }}
            labelFormatter={(label) => `วันที่ ${label}`}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#00E5FF"
            strokeWidth={2}
            fill="url(#revenueGradient)"
            dot={false}
            activeDot={{ r: 4, fill: "#00E5FF" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
