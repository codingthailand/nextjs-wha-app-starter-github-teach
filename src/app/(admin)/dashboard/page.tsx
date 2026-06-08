import { Suspense } from "react"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import DashboardClient from "./dashboard-client"

async function DashboardGuard() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session || session.user.role !== "admin") {
    redirect("/")
  }

  return <DashboardClient />
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardGuard />
    </Suspense>
  )
}

function DashboardFallback() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="mt-1 h-4 w-64 animate-pulse rounded bg-muted" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-9 w-28 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="h-80 animate-pulse rounded-xl bg-card" />
        </div>
        <div className="lg:col-span-4">
          <div className="h-80 animate-pulse rounded-xl bg-card" />
        </div>
      </div>
      <div className="h-48 animate-pulse rounded-xl bg-card" />
    </div>
  )
}
