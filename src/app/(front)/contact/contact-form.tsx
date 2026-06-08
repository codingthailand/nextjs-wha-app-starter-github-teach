"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { contactSchema, type ContactFormValues } from "@/lib/validations/contact"

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  const { formState } = form
  const isSubmitting = formState.isSubmitting

  async function onSubmit(data: ContactFormValues) {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const json = await res.json()

      if (!json.success) {
        toast.error(json.error)
        return
      }

      form.reset()
      setSubmitted(true)
    } catch {
      toast.error("เกิดข้อผิดพลาด กรุณาลองอีกครั้ง")
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-8">
        <CheckCircle className="size-12 text-green-500" />
        <h3 className="text-lg font-medium">ส่งข้อความสำเร็จ</h3>
        <p className="text-sm text-muted-foreground">
          เราจะติดต่อกลับโดยเร็วที่สุด
        </p>
        <Button variant="outline" onClick={() => setSubmitted(false)}>
          ส่งข้อความอีกครั้ง
        </Button>
      </div>
    )
  }

  return (
    <form id="contact-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="contact-name">ชื่อ</FieldLabel>
              <Input
                {...field}
                id="contact-name"
                placeholder="กรอกชื่อของคุณ"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="contact-email">อีเมล</FieldLabel>
              <Input
                {...field}
                id="contact-email"
                type="email"
                placeholder="example@email.com"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <Controller
          name="message"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="contact-message">ข้อความ</FieldLabel>
              <Textarea
                {...field}
                id="contact-message"
                rows={5}
                placeholder="พิมพ์ข้อความที่ต้องการ..."
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
      </FieldGroup>
      <Button
        type="submit"
        className="mt-6 w-full"
        disabled={isSubmitting}
      >
        {isSubmitting && <Spinner className="size-4" />}
        ส่งข้อความ
      </Button>
    </form>
  )
}
