import api from "@/lib/api"
import type { DashboardStats } from "../types"

// Mock data for fallback when API fails
const mockDashboardStats: DashboardStats = {
  totalProducts: 728,
  lowStockProducts: 12,
  totalClients: 96,
  recentSales: 8459,
  pendingOrders: 5,
  alertsCount: 8
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    try {
      const response = await api.get<DashboardStats>("/dashboard/stats")
      return response.data
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error)
      return mockDashboardStats
    }
  },
}
