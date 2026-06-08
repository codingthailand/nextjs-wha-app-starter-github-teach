"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { productSchema, type ProductFormValues } from "@/lib/validations/product"
import type { AdminProduct, CategoryOption, ApiResponse } from "@/types/admin"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: AdminProduct | null
  categories: CategoryOption[]
  onSuccess: () => void
}

const defaultValues: ProductFormValues = {
  name: "",
  description: "",
  price: 0,
  categoryId: 0,
}

export default function ProductFormModal({
  open,
  onOpenChange,
  product,
  categories,
  onSuccess,
}: Props) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues,
  })

  const { formState } = form
  const isSubmitting = formState.isSubmitting

  useEffect(() => {
    if (open) {
      if (product) {
        form.reset({
          name: product.name,
          description: product.description ?? "",
          price: product.price,
          categoryId: product.categoryId ?? 0,
        })
      } else {
        form.reset(defaultValues)
      }
    }
  }, [open, product, form])

  async function onSubmit(data: ProductFormValues) {
    const url = product
      ? `/api/admin/products/${product.id}`
      : "/api/admin/products"
    const method = product ? "PUT" : "POST"

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const json: ApiResponse<unknown> = await res.json()

      if (!json.success) {
        toast.error(json.error)
        return
      }

      toast.success(product ? "แก้ไขสินค้าสำเร็จ" : "เพิ่มสินค้าสำเร็จ")
      onSuccess()
    } catch {
      toast.error("เกิดข้อผิดพลาด กรุณาลองอีกครั้ง")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product ? "แก้ไขสินค้า" : "เพิ่มสินค้า"}</DialogTitle>
          <DialogDescription>
            {product
              ? "แก้ไขข้อมูลสินค้าด้านล่าง"
              : "กรอกข้อมูลสินค้าใหม่ด้านล่าง"}
          </DialogDescription>
        </DialogHeader>

        <form id="product-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-name">ชื่อสินค้า</FieldLabel>
                  <Input
                    {...field}
                    id="product-name"
                    placeholder="ชื่อสินค้า"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-description">
                    รายละเอียด
                  </FieldLabel>
                  <Input
                    {...field}
                    id="product-description"
                    placeholder="รายละเอียดสินค้า (ไม่บังคับ)"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="price"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-price">ราคา</FieldLabel>
                  <Input
                    {...field}
                    id="product-price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    aria-invalid={fieldState.invalid}
                    onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="categoryId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-category">หมวดหมู่</FieldLabel>
                  <Select
                    value={String(field.value)}
                    onValueChange={(v) => field.onChange(Number(v))}
                  >
                    <SelectTrigger
                      id="product-category"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="เลือกหมวดหมู่" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            ยกเลิก
          </Button>
          <Button type="submit" form="product-form" disabled={isSubmitting}>
            {isSubmitting && <Spinner className="size-4" />}
            {product ? "บันทึก" : "เพิ่มสินค้า"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
