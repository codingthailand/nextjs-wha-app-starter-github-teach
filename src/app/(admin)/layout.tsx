import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "../globals.css"
import Link from "next/link"
import { Toaster } from "sonner"
import {
  RiDashboard2Line,
  RiShoppingBag3Line,
  RiGroupLine,
  RiBox3Line,
  RiSettings4Line,
  RiMenuLine,
  RiNotification2Line,
  RiUserSmileLine,
} from "@remixicon/react"
import { cn } from "@/lib/utils"
import LogoutButton from "@/components/logout-button"
import ThemeToggle from "@/components/theme-toggle"

const interSans = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
  variable: "--font-sans",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "ระบบจัดการร้านค้า",
}

const sidebarLinks = [
  { href: "/dashboard", label: "แดชบอร์ด", icon: RiDashboard2Line },
  { href: "/dashboard/orders", label: "ออเดอร์", icon: RiShoppingBag3Line },
  { href: "/dashboard/products", label: "สินค้า", icon: RiBox3Line },
  { href: "/dashboard/customers", label: "ลูกค้า", icon: RiGroupLine },
  { href: "/dashboard/settings", label: "ตั้งค่า", icon: RiSettings4Line },
]

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="th"
      className={cn(interSans.variable, jetbrainsMono.variable, "font-sans")}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem("wattvision-theme");
                  if (theme === "light") {
                    document.documentElement.classList.add("light");
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <Toaster richColors position="top-right" />
        <div className="flex min-h-screen">
          <aside className="group/sidebar flex w-72 flex-col border-r border-border bg-sidebar transition-all hover:w-72 max-md:w-16 max-md:hover:w-72">
            <div className="flex h-14 items-center gap-2 border-b border-border px-4">
              <RiDashboard2Line className="size-6 shrink-0 text-primary" />
              <span className="truncate text-base font-bold text-foreground max-md:hidden group-hover/sidebar:max-md:inline">
                Admin
              </span>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-4">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground aria-[current=page]:bg-sidebar-accent aria-[current=page]:font-semibold aria-[current=page]:text-foreground"
                >
                  <link.icon className="size-5 shrink-0" />
                  <span className="truncate max-md:hidden group-hover/sidebar:max-md:inline">
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>

            <div className="border-t border-border p-3">
              <LogoutButton />
            </div>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col">
            <header className="flex h-14 items-center justify-between border-b border-border bg-sidebar px-4 shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-accent"
                  aria-label="Toggle sidebar"
                >
                  <RiMenuLine className="size-5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  type="button"
                  className="flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-accent"
                  aria-label="Notifications"
                >
                  <RiNotification2Line className="size-5" />
                </button>
                <button
                  type="button"
                  className="flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-accent"
                  aria-label="Profile"
                >
                  <RiUserSmileLine className="size-5" />
                </button>
              </div>
            </header>

            <main className="flex-1 overflow-auto bg-background">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
