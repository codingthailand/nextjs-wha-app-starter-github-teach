import { Suspense } from "react"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import ProductsClient from "./products-client"

async function ProductsGuard() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session || session.user.role !== "admin") {
    redirect("/")
  }

  return <ProductsClient />
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 p-6">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="h-10 w-full animate-pulse rounded bg-muted" />
          <div className="h-96 animate-pulse rounded-xl bg-muted" />
        </div>
      }
    >
      <ProductsGuard />
    </Suspense>
  )
}
