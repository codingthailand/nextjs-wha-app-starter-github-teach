import type { RemixiconComponentType } from "@remixicon/react"
import {
  RiMoneyDollarCircleLine,
  RiShoppingCartLine,
  RiTimeLine,
  RiBox3Line,
} from "@remixicon/react"

const iconMap: Record<string, RemixiconComponentType> = {
  RiMoneyDollarCircleLine,
  RiShoppingCartLine,
  RiTimeLine,
  RiBox3Line,
}

function formatTHB(value: number) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
  }).format(value)
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("th-TH").format(value)
}

export function KpiCard({
  label,
  value,
  formatCurrency = false,
  icon,
  subtitle,
}: {
  label: string
  value: number
  formatCurrency?: boolean
  icon: string
  subtitle?: string
}) {
  const Icon = iconMap[icon]
  return (
    <div className="rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        {Icon && <Icon className="size-5 text-muted-foreground" />}
      </div>
      <p className="mt-2 text-2xl font-bold">
        {formatCurrency ? formatTHB(value) : formatNumber(value)}
      </p>
      {subtitle && (
        <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      )}
    </div>
  )
}

export function KpiCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="size-5 animate-pulse rounded bg-muted" />
      </div>
      <div className="mt-2 h-8 w-28 animate-pulse rounded bg-muted" />
      <div className="mt-1 h-3 w-20 animate-pulse rounded bg-muted" />
    </div>
  )
}
