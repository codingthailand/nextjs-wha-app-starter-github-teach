import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import type { AdminStats } from "@/types/admin"

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const [todayOrdersAgg, pendingOrdersCount, totalProducts, totalUsers] =
    await Promise.all([
      prisma.orders.findMany({
        where: { date: { gte: today, lt: tomorrow } },
        select: { total_amount: true },
      }),
      prisma.orders.count({
        where: { status: "processing" },
      }),
      prisma.products.count(),
      prisma.user.count(),
    ])

  const stats: AdminStats = {
    todaySales: todayOrdersAgg.reduce(
      (sum, o) => sum + Number(o.total_amount ?? 0),
      0
    ),
    todayOrders: todayOrdersAgg.length,
    pendingOrders: pendingOrdersCount,
    totalProducts,
    totalUsers,
  }

  return NextResponse.json(stats)
}
