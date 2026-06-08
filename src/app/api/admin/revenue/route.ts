import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import type { RevenuePoint } from "@/types/admin"

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const period = request.nextUrl.searchParams.get("period") ?? "30d"
  const days = period === "7d" ? 7 : period === "90d" ? 90 : 30

  const since = new Date()
  since.setDate(since.getDate() - days)
  since.setHours(0, 0, 0, 0)

  const orders = await prisma.orders.findMany({
    where: { date: { gte: since } },
    orderBy: { date: "asc" },
    select: { date: true, total_amount: true },
  })

  const grouped = new Map<string, { revenue: number; orders: number }>()

  for (const day = new Date(since); day <= new Date(); day.setDate(day.getDate() + 1)) {
    const key = day.toLocaleDateString("th-TH", { day: "2-digit", month: "2-digit" })
    grouped.set(key, { revenue: 0, orders: 0 })
  }

  for (const order of orders) {
    if (!order.date) continue
    const key = order.date.toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
    })
    const entry = grouped.get(key)
    if (entry) {
      entry.revenue += Number(order.total_amount ?? 0)
      entry.orders += 1
    }
  }

  const revenue: RevenuePoint[] = Array.from(grouped, ([date, data]) => ({
    date,
    ...data,
  }))

  return NextResponse.json(revenue)
}
