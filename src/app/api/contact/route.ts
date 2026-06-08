import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

import { contactSchema } from "@/lib/validations/contact"

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(request: NextRequest) {
  const body = await request.json()
  const parsed = contactSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: parsed.error.issues.map((e) => e.message).join(", "),
      },
      { status: 400 }
    )
  }

  try {
    await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: process.env.CONTACT_RECEIVER_EMAIL || "",
      subject: `ติดต่อจาก: ${parsed.data.name} (${parsed.data.email})`,
      text: parsed.data.message,
    })

    return NextResponse.json({ success: true, data: null }, { status: 200 })
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "ไม่สามารถส่งข้อความได้ กรุณาลองอีกครั้ง",
      },
      { status: 500 }
    )
  }
}
