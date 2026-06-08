"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import type { AdminProduct, ApiResponse } from "@/types/admin"

type Props = {
  product: AdminProduct | null
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export default function DeleteConfirmDialog({
  product,
  onOpenChange,
  onSuccess,
}: Props) {
  const [deleting, setDeleting] = useState(false)
  const open = !!product

  async function handleDelete() {
    if (!product) return
    setDeleting(true)

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      })
      const json: ApiResponse<null> = await res.json()

      if (!json.success) {
        toast.error(json.error)
        return
      }

      toast.success("ลบสินค้าสำเร็จ")
      onSuccess()
    } catch {
      toast.error("เกิดข้อผิดพลาด กรุณาลองอีกครั้ง")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ยืนยันการลบ</DialogTitle>
          <DialogDescription>
            คุณแน่ใจหรือต้องการลบ <strong>{product?.name}</strong>?
            การดำเนินการนี้ไม่สามารถยกเลิกได้
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleting}
          >
            ยกเลิก
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting && <Spinner className="size-4" />}
            ลบ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
