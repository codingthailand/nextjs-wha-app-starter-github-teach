import { Mail, Phone, Clock } from "lucide-react"

import { Separator } from "@/components/ui/separator"
import ContactForm from "./contact-form"

export default function ContactPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-bold">ติดต่อเรา</h1>
          <p className="mt-2 text-muted-foreground">
            มีคำถามหรือข้อสงสัย? ทีมของเราพร้อมช่วยเหลือคุณ
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_1.6fr] md:gap-12">
          <div>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 size-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">อีเมล</h3>
                  <p className="text-sm text-muted-foreground">
                    hello@example.com
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 size-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">โทรศัพท์</h3>
                  <p className="text-sm text-muted-foreground">
                    02-123-4567
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 size-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">เวลาทำการ</h3>
                  <p className="text-sm text-muted-foreground">
                    จันทร์ - ศุกร์ 09:00 - 18:00 น.
                  </p>
                </div>
              </div>
            </div>
            <Separator className="my-6" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              ทีมงานของเราพร้อมตอบคำถามและให้ความช่วยเหลือคุณในทุกเรื่อง
              ติดต่อเราได้ทุกช่องทางข้างต้น หรือส่งข้อความผ่านฟอร์มด้านขวา
            </p>
          </div>

          <ContactForm />
        </div>
      </div>
    </main>
  )
}
