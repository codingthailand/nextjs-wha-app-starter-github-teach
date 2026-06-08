import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { productSchema } from "@/lib/validations/product"
import type { AdminProduct, ApiResponse } from "@/types/admin"

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || session.user.role !== "admin") {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    )
  }

  const search = request.nextUrl.searchParams.get("search") || ""
  const page = Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1)
  const limit = Math.min(50, Number(request.nextUrl.searchParams.get("limit")) || 10)
  const skip = (page - 1) * limit

  const where = search
    ? { name: { contains: search } }
    : {}

  const [products, total] = await Promise.all([
    prisma.products.findMany({
      where,
      skip,
      take: limit,
      orderBy: { id: "desc" },
      include: { categories: { select: { name: true } } },
    }),
    prisma.products.count({ where }),
  ])

  const data: AdminProduct[] = products.map((p) => ({
    id: p.id,
    name: p.name ?? "",
    description: p.description,
    price: Number(p.price ?? 0),
    categoryId: p.category_id,
    categoryName: p.categories?.name ?? null,
  }))

  return NextResponse.json<{ success: true; data: AdminProduct[]; total: number }>({
    success: true,
    data,
    total,
  })
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || session.user.role !== "admin") {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    )
  }

  const body = await request.json()
  const parsed = productSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: parsed.error.issues.map((e) => e.message).join(", ") },
      { status: 400 }
    )
  }

  const product = await prisma.products.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description || null,
      price: parsed.data.price,
      category_id: parsed.data.categoryId,
    },
    include: { categories: { select: { name: true } } },
  })

  const data: AdminProduct = {
    id: product.id,
    name: product.name ?? "",
    description: product.description,
    price: Number(product.price ?? 0),
    categoryId: product.category_id,
    categoryName: product.categories?.name ?? null,
  }

  return NextResponse.json<{ success: true; data: AdminProduct }>(
    { success: true, data },
    { status: 201 }
  )
}
