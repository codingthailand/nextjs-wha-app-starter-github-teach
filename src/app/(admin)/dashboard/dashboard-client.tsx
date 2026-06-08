"use client"

import { useEffect, useState } from "react"
import type { AdminStats, RevenuePoint, AdminOrderItem, Period } from "@/types/admin"
import { KpiCard, KpiCardSkeleton } from "@/components/admin/kpi-card"
import { PeriodSelector } from "@/components/admin/period-selector"
import { RecentOrdersTable } from "@/components/admin/recent-orders-table"
import dynamic from "next/dynamic"

const RevenueChart = dynamic(
  () => import("@/components/admin/revenue-chart").then((m) => m.RevenueChart),
  { ssr: false, loading: () => <div className="h-80 animate-pulse rounded-xl bg-muted" /> }
)

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export default function DashboardClient() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [statsError, setStatsError] = useState<string | null>(null)

  const [revenue, setRevenue] = useState<RevenuePoint[]>([])
  const [revenueLoading, setRevenueLoading] = useState(false)

  const [period, setPeriod] = useState<Period>("30d")

  const [orders, setOrders] = useState<AdminOrderItem[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setStatsLoading(true)
      setOrdersLoading(true)
      try {
        const [s, o] = await Promise.all([
          fetchJson<AdminStats>("/api/admin/stats"),
          fetchJson<{ orders: AdminOrderItem[] }>("/api/admin/orders?limit=5"),
        ])
        if (cancelled) return
        setStats(s)
        setStatsError(null)
        setOrders(o.orders)
      } catch (err) {
        if (cancelled) return
        setStatsError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด")
      } finally {
        if (!cancelled) {
          setStatsLoading(false)
          setOrdersLoading(false)
        }
      }
    }

    load()

    const interval = setInterval(load, 30000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadRevenue() {
      setRevenueLoading(true)
      try {
        const data = await fetchJson<RevenuePoint[]>(`/api/admin/revenue?period=${period}`)
        if (!cancelled) setRevenue(data)
      } finally {
        if (!cancelled) setRevenueLoading(false)
      }
    }

    loadRevenue()
    return () => { cancelled = true }
  }, [period])

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">แดชบอร์ด</h1>
        <p className="text-sm text-muted-foreground">ภาพรวมร้านค้าของคุณ</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsLoading ? (
          <>
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
          </>
        ) : statsError ? (
          <div className="col-span-full flex items-center justify-between rounded-xl border p-4">
            <p className="text-sm text-destructive">{statsError}</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
            >
              ลองใหม่
            </button>
          </div>
        ) : stats ? (
          <>
            <KpiCard
              label="ยอดขายวันนี้"
              value={stats.todaySales}
              formatCurrency
              icon="RiMoneyDollarCircleLine"
            />
            <KpiCard
              label="ออเดอร์วันนี้"
              value={stats.todayOrders}
              icon="RiShoppingCartLine"
            />
            <KpiCard
              label="ออเดอร์รอดำเนินการ"
              value={stats.pendingOrders}
              icon="RiTimeLine"
            />
            <KpiCard
              label="สินค้าทั้งหมด"
              value={stats.totalProducts}
              icon="RiBox3Line"
              subtitle={`ผู้ใช้ ${stats.totalUsers} คน`}
            />
          </>
        ) : null}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">รายได้</h2>
          <PeriodSelector value={period} onChange={setPeriod} />
        </div>
        {revenueLoading ? (
          <div className="h-80 animate-pulse rounded-xl bg-muted" />
        ) : (
          <RevenueChart data={revenue} />
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">ออเดอร์ล่าสุด</h2>
        {ordersLoading ? (
          <div className="h-48 animate-pulse rounded-xl bg-muted" />
        ) : (
          <RecentOrdersTable orders={orders} />
        )}
      </div>
    </div>
  )
}
