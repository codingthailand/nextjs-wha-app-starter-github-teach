import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import type { AdminOrderItem } from "@/types/admin"

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const limit = Math.min(Number(request.nextUrl.searchParams.get("limit")) || 5, 50)
  const total = await prisma.orders.count()

  const orders = await prisma.orders.findMany({
    take: limit,
    orderBy: { date: "desc" },
    include: {
      customers: { select: { name: true } },
    },
  })

  const items: AdminOrderItem[] = orders.map((o) => ({
    id: o.id,
    customerName: o.customers?.name ?? null,
    status: o.status,
    totalAmount: Number(o.total_amount ?? 0),
    date: o.date?.toISOString() ?? "",
  }))

  return NextResponse.json({ orders: items, total })
}
