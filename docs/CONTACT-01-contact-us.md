---

## Goal
สร้างหน้า Contact Us ใน `(front)` route group — **public ไม่ต้อง auth** — form รับข้อมูลแล้วส่ง email ผ่าน Route Handler

---

## File Structure

```
src/app/(front)/contact/
├── page.tsx              ← Server Component shell
└── contact-form.tsx      ← 'use client': react-hook-form + submit

src/app/api/contact/
└── route.ts              ← POST: validate + ส่ง email
```

---

## Zod Schema (ใช้ร่วมกัน client + server)

```ts
// src/lib/validations/contact.ts
import { z } from 'zod/v4'

export const contactSchema = z.object({
  name:    z.string().min(1, 'กรุณากรอกชื่อ').max(100),
  email:   z.string().min(1, 'กรุณากรอก Email').email('รูปแบบ Email ไม่ถูกต้อง'),
  message: z.string().min(10, 'ข้อความต้องมีอย่างน้อย 10 ตัวอักษร').max(2000),
})

export type ContactFormValues = z.infer<typeof contactSchema>
```

---

## Route Handler — `POST /api/contact`

- ไม่ต้อง auth guard (public endpoint)
- Validate ด้วย `contactSchema.safeParse(body)`
- ส่ง email ผ่าน SMTP ด้วย **Resend**
- Rate limit อย่างง่าย: ตรวจ header `x-forwarded-for` หรือ IP — optional ถ้าไม่มี middleware

**Environment variables ที่ต้องเพิ่มใน `.env`:**
```
# หรือ Resend
RESEND_API_KEY=
```

**Response format:**
```ts
type ApiResponse<T> = { success: true; data: T } | { success: false; error: string }
// success → { success: true, data: { message: 'ส่งข้อความสำเร็จ' } }
```

---

## ContactForm Component

```
Fields:
  name    → Input (register)
  email   → Input type="email" (register)
  message → Textarea rows=5 (register)

Submit flow:
  handleSubmit(values) → fetch POST /api/contact → toast.success / toast.error
  ถ้า success → form.reset() + แสดง success state แทน form
```

**Constraints:**
- `useTransition` สำหรับ pending state บน submit button
- ถ้า success ให้ซ่อน form แล้วแสดง success message พร้อมปุ่ม "ส่งข้อความอีกครั้ง"
- shadcn Form + FormField + FormMessage สำหรับ error display
- Toast จาก Sonner สำหรับ network error เท่านั้น (validation error แสดงใต้ field ปกติ)

---

## page.tsx

Server Component ธรรมดา — ไม่ check session เพราะ public
```tsx
export default function ContactPage() {
  return (
    <main>
      {/* heading + contact info */}
      <ContactForm />
    </main>
  )
}
```

---

## Install (ถ้ายังไม่มี)

```bash
ให้ใช้ resend เท่านั้น
npm install resend
```
