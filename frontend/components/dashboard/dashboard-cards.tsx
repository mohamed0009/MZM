"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, Users, AlertCircle, TrendingUp, TrendingDown } from "lucide-react"

interface DashboardCardsProps {
  data?: {
    totalProducts?: number
    lowStockProducts?: number
    totalClients?: number
    recentSales?: number
    pendingOrders?: number
    alerts?: number
  }
}

export function DashboardCards({ data }: DashboardCardsProps) {
  // Handle undefined data with default values
  const stats = {
    totalProducts: data?.totalProducts || 0,
    lowStockProducts: data?.lowStockProducts || 0,
    totalClients: data?.totalClients || 0,
    recentSales: data?.recentSales || 0,
    pendingOrders: data?.pendingOrders || 0,
    alerts: data?.alerts || 0
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="relative overflow-hidden border-l-4 border-l-emerald-500 hover:shadow-md transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Stock Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
              {stats.totalProducts > 0 && (
                <p className="text-xs text-emerald-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" /> 
                  <span>+8% depuis dernier mois</span>
                </p>
              )}
              {stats.totalProducts === 0 && (
                <p className="text-xs text-gray-500">Aucune donnée disponible</p>
              )}
            </div>
            <div className="bg-emerald-50 p-2 rounded-full">
              <Package className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </CardContent>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-300"></div>
      </Card>

      <Card className="relative overflow-hidden border-l-4 border-l-amber-500 hover:shadow-md transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Produits Critiques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold">{stats.lowStockProducts}</p>
              {stats.lowStockProducts > 0 && (
                <p className="text-xs text-amber-600 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" /> 
                  <span>À commander rapidement</span>
                </p>
              )}
              {stats.lowStockProducts === 0 && (
                <p className="text-xs text-emerald-600">Stock suffisant</p>
              )}
            </div>
            <div className="bg-amber-50 p-2 rounded-full">
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </CardContent>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-300"></div>
      </Card>

      <Card className="relative overflow-hidden border-l-4 border-l-blue-500 hover:shadow-md transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold">{stats.totalClients}</p>
              {stats.totalClients > 0 && (
                <p className="text-xs text-blue-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" /> 
                  <span>+3 nouveaux cette semaine</span>
                </p>
              )}
              {stats.totalClients === 0 && (
                <p className="text-xs text-gray-500">Aucun client enregistré</p>
              )}
            </div>
            <div className="bg-blue-50 p-2 rounded-full">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </CardContent>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-300"></div>
      </Card>

      <Card className="relative overflow-hidden border-l-4 border-l-violet-500 hover:shadow-md transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Ventes Récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold">{stats.recentSales} MAD</p>
              {stats.recentSales > 0 && (
                <p className="text-xs text-violet-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" /> 
                  <span>+12% vs. hier</span>
                </p>
              )}
              {stats.recentSales === 0 && (
                <p className="text-xs text-gray-500">Aucune vente aujourd'hui</p>
              )}
            </div>
            <div className="bg-violet-50 p-2 rounded-full">
              <ShoppingCart className="h-5 w-5 text-violet-600" />
            </div>
          </div>
        </CardContent>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-violet-300"></div>
      </Card>
    </div>
  )
}
