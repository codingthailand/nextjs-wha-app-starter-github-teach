import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { productSchema } from "@/lib/validations/product"
import type { AdminProduct, ApiResponse } from "@/types/admin"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || session.user.role !== "admin") {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    )
  }

  const { id } = await params
  const productId = Number(id)

  const existing = await prisma.products.findUnique({ where: { id: productId } })
  if (!existing) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "ไม่พบสินค้า" },
      { status: 404 }
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

  const product = await prisma.products.update({
    where: { id: productId },
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

  return NextResponse.json<{ success: true; data: AdminProduct }>({ success: true, data })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || session.user.role !== "admin") {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    )
  }

  const { id } = await params
  const productId = Number(id)

  const existing = await prisma.products.findUnique({ where: { id: productId } })
  if (!existing) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "ไม่พบสินค้า" },
      { status: 404 }
    )
  }

  const orderCount = await prisma.order_items.count({
    where: { product_id: productId },
  })

  if (orderCount > 0) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: `ไม่สามารถลบได้ สินค้านี้มี ${orderCount} รายการในออเดอร์` },
      { status: 409 }
    )
  }

  await prisma.products.delete({ where: { id: productId } })

  return NextResponse.json<{ success: true }>({ success: true })
}
