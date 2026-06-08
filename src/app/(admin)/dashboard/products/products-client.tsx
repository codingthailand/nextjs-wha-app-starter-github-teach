"use client"

import { useEffect, useState, useRef } from "react"
import { toast } from "sonner"
import {
  RiAddLine,
  RiPencilLine,
  RiDeleteBinLine,
  RiSearchLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
} from "@remixicon/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Spinner } from "@/components/ui/spinner"
import type { AdminProduct, CategoryOption } from "@/types/admin"
import ProductFormModal from "./product-form-modal"
import DeleteConfirmDialog from "./delete-confirm-dialog"

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export default function ProductsClient() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [inputVal, setInputVal] = useState("")
  const [search, setSearch] = useState("")
  const limit = 10

  const [formOpen, setFormOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<AdminProduct | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null)

  const fetchId = useRef(0)
  const [trigger, setTrigger] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(inputVal)
      setPage(1)
    }, 300)
    return () => clearTimeout(t)
  }, [inputVal])

  useEffect(() => {
    let cancelled = false
    const id = ++fetchId.current

    async function load() {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (search) params.set("search", search)
        params.set("page", String(page))
        params.set("limit", String(limit))
        const res = await fetchJson<{
          success: true
          data: AdminProduct[]
          total: number
        }>(`/api/admin/products?${params}`)
        if (cancelled || fetchId.current !== id) return
        setProducts(res.data)
        setTotal(res.total)
      } catch {
        if (cancelled) return
        toast.error("โหลดข้อมูลสินค้าไม่สำเร็จ")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [search, page, trigger])

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetchJson<{ success: true; data: CategoryOption[] }>(
          "/api/admin/categories"
        )
        setCategories(res.data)
      } catch {
        toast.error("โหลดหมวดหมู่ไม่สำเร็จ")
      }
    }
    loadCategories()
  }, [])

  const totalPages = Math.ceil(total / limit)

  function handleCreate() {
    setEditProduct(null)
    setFormOpen(true)
  }

  function handleEdit(product: AdminProduct) {
    setEditProduct(product)
    setFormOpen(true)
  }

  function handleDelete(product: AdminProduct) {
    setDeleteTarget(product)
  }

  function refetch() {
    setTrigger((n) => n + 1)
  }

  async function handleSave() {
    setFormOpen(false)
    setEditProduct(null)
    refetch()
  }

  async function handleDeleted() {
    setDeleteTarget(null)
    refetch()
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">สินค้า</h1>
          <p className="text-sm text-muted-foreground">จัดการสินค้าทั้งหมด</p>
        </div>
        <Button onClick={handleCreate}>
          <RiAddLine className="size-4" />
          เพิ่มสินค้า
        </Button>
      </div>

      <div className="relative max-w-sm">
        <RiSearchLine className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="ค้นหาสินค้า..."
          className="pl-9"
        />
      </div>

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ชื่อสินค้า</TableHead>
              <TableHead>ราคา</TableHead>
              <TableHead>หมวดหมู่</TableHead>
              <TableHead className="w-24 text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="py-12 text-center">
                  <Spinner className="mx-auto size-6" />
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-12 text-center text-muted-foreground">
                  ไม่พบสินค้า
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("th-TH", {
                      style: "currency",
                      currency: "THB",
                    }).format(product.price)}
                  </TableCell>
                  <TableCell>{product.categoryName ?? "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleEdit(product)}
                      >
                        <RiPencilLine className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(product)}
                      >
                        <RiDeleteBinLine className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <RiArrowLeftSLine className="size-4" />
            ก่อนหน้า
          </Button>
          <span className="text-sm text-muted-foreground">
            หน้า {page} จาก {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            ถัดไป
            <RiArrowRightSLine className="size-4" />
          </Button>
        </div>
      )}

      <ProductFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editProduct}
        categories={categories}
        onSuccess={handleSave}
      />

      <DeleteConfirmDialog
        product={deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        onSuccess={handleDeleted}
      />
    </div>
  )
}
