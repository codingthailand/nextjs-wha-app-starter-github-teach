import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import type { CategoryOption, ApiResponse } from "@/types/admin"

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || session.user.role !== "admin") {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    )
  }

  const categories = await prisma.categories.findMany({
    orderBy: { name: "asc" },
  })

  const data: CategoryOption[] = categories.map((c) => ({
    id: c.id,
    name: c.name ?? "",
  }))

  return NextResponse.json<{ success: true; data: CategoryOption[] }>({
    success: true,
    data,
  })
}
