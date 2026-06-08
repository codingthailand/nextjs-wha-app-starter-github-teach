export type Period = "7d" | "30d" | "90d"

export type AdminStats = {
  todaySales: number
  todayOrders: number
  pendingOrders: number
  totalProducts: number
  totalUsers: number
}

export type RevenuePoint = {
  date: string
  revenue: number
  orders: number
}

export type AdminOrderItem = {
  id: number
  customerName: string | null
  status: string | null
  totalAmount: number
  date: string
}
