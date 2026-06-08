import type { Metadata } from "next"
import "../globals.css"
import Link from "next/link"
import {
  RiDashboard2Line,
  RiShoppingBag3Line,
  RiGroupLine,
  RiSettings4Line,
} from "@remixicon/react"
import LogoutButton from "@/components/logout-button"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "ระบบจัดการร้านค้า",
}

const sidebarLinks = [
  { href: "/dashboard", label: "แดชบอร์ด", icon: RiDashboard2Line },
  { href: "/dashboard/orders", label: "ออเดอร์", icon: RiShoppingBag3Line },
  { href: "/dashboard/customers", label: "ลูกค้า", icon: RiGroupLine },
  { href: "/dashboard/settings", label: "ตั้งค่า", icon: RiSettings4Line },
]

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="th" className="font-sans">
      <body>
        <div className="flex min-h-screen">
          <aside className="flex w-64 flex-col border-r bg-sidebar">
            <div className="flex h-16 items-center gap-2 border-b px-6">
              <RiDashboard2Line className="size-6 text-sidebar-primary" />
              <span className="text-lg font-semibold text-sidebar-foreground">
                Admin
              </span>
            </div>
            <nav className="flex-1 space-y-1 p-4">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
                >
                  <link.icon className="size-5" />
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="border-t p-4">
              <LogoutButton />
            </div>
          </aside>
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </body>
    </html>
  )
}
