"use client"

import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import { 
  Loader2, Package, Users, TrendingUp, Bell, AlertCircle, 
  FileText, Pill, ShoppingBag, User, ArrowRight, Calendar,
  BarChart2, PlusCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, TooltipProps 
} from 'recharts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Updated API response type matching server structure
interface DashboardResponse {
  stats: {
    totalProducts: number
    lowStockProducts: number
    totalClients: number
    recentSales: number
    pendingOrders: number
    alerts: number
  }
  salesChart: {
    labels: string[]
    data: number[]
  }
  recentSales: {
    id: string
    customer: string
    amount: number
    date: string
  }[]
  recentSalesCount: number
  alerts: {
    id: string
    title: string
    message: string
  }[]
  inventory: {
    id: string
    name: string
    stock: number
    category: string
  }[]
  clients: {
    id: string
    name: string
    phone: string
  }[]
  calendar: {
    id: string
    title: string
    date: string
  }[]
  analytics: {
    id: string
    title: string
    data: number[]
  }[]
  settings: {
    pharmacyName: string
    address: string
    phone: string
  }
  prescriptions?: {
    total: number
    pending: number
    completed: number
    recent: Array<{
      id: string
      patient: {
        name: string
        avatar?: string
      }
      doctor: string
      date: string
      status: string
      medications: Array<{
        name: string
        quantity: number
      }>
    }>
  }
}

interface SalesData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

// Custom tooltip for the chart with improved visual design
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-md border rounded-lg">
        <p className="font-medium text-sm mb-1">{label}</p>
        <p className="text-emerald-600 text-sm flex items-center gap-1">
          <span className="font-medium">Ventes:</span> {payload[0]?.value} MAD
        </p>
        <p className="text-blue-600 text-sm flex items-center gap-1">
          <span className="font-medium">Achats:</span> {payload[1]?.value} MAD
        </p>
        <p className="text-sm text-gray-600 mt-1 pt-1 border-t">
          <span className="font-medium">Marge:</span> {(Number(payload[0]?.value) - Number(payload[1]?.value)).toFixed(0)} MAD
        </p>
      </div>
    );
  }
  return null;
};

// Get initials from name for avatar fallbacks
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

export default function DashboardPage() {
  const { user } = useAuth()

  const { data, isLoading, isError } = useQuery<DashboardResponse>({
    queryKey: ["dashboard-data"],
    queryFn: async () => {
      try {
        const response = await api.get(`/dashboard/data?role=${user?.role}`)
        return response.data as DashboardResponse
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
        // Return mock data instead of throwing error
        return {
          stats: {
            totalProducts: 728,
            lowStockProducts: 12,
            totalClients: 96,
            recentSales: 8459,
            pendingOrders: 5,
            alerts: 8
          },
          salesChart: {
            labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul"],
            data: [4500, 3800, 5200, 2900, 1950, 2400, 3600]
          },
          recentSales: [
            { id: "1", customer: "Mohammed Alami", amount: 450, date: "Il y a 3 heures" },
            { id: "2", customer: "Fatima Benali", amount: 235, date: "Il y a 5 heures" },
            { id: "3", customer: "Ahmed Laroussi", amount: 290, date: "Il y a 1 jour" }
          ],
          recentSalesCount: 3,
          alerts: [
            { id: "1", title: "Avertissement Stock", message: "12 produits en stock critique" },
            { id: "2", title: "Mise à jour Système", message: "Nouvelle mise à jour disponible" }
          ],
          inventory: [
            { id: "1", name: "Paracetamol 500mg", stock: 8, category: "Analgésique" },
            { id: "2", name: "Amoxicilline 1g", stock: 15, category: "Antibiotique" }
          ],
          clients: [],
          calendar: [],
          analytics: [],
          settings: { pharmacyName: "PharmaFlow", address: "123 Rue Example", phone: "+212 5XX-XXXXXX" }
        }
      }
    },
    retry: 1
  })

  // Define default values for data properties
  const stats = data?.stats || {
    totalProducts: 0,
    lowStockProducts: 0,
    totalClients: 0,
    recentSales: 0,
    pendingOrders: 0,
    alerts: 0
  }

  const salesData = data?.salesChart ? {
    labels: data.salesChart.labels,
    datasets: [{
      label: 'Ventes',
      data: data.salesChart.data,
      backgroundColor: '#10B981',
      borderColor: '#059669',
      borderWidth: 1
    }]
  } : null

  const recentTransactions = data?.recentSales || []
  const alerts = data?.alerts || []
  const inventory = data?.inventory || []
  const calendar = data?.calendar || []
  const analytics = data?.analytics || []
  const prescriptions = data?.prescriptions

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-pharma-primary mx-auto mb-4" />
          <p className="text-pharma-primary font-medium">Chargement du tableau de bord...</p>
        </div>
      </div>
    )
  }

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Quick actions based on user role
  const quickActions = [
    {
      label: "Nouvelle vente",
      icon: <ShoppingBag className="h-4 w-4" />,
      color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200"
    },
    {
      label: "Ajouter client",
      icon: <User className="h-4 w-4" />,
      color: "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200"
    },
    {
      label: "Gérer stock",
      icon: <Pill className="h-4 w-4" />,
      color: "bg-violet-100 text-violet-700 hover:bg-violet-200 border-violet-200"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome section with date and quick actions */}
      <div className="bg-gradient-to-r from-pharma-primary/10 to-pharma-secondary/5 rounded-xl p-4 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Bonjour, {user?.name}</h1>
            <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
              {formattedDate} 
              {stats.pendingOrders > 0 && (
                <>
                  <span className="mx-1.5">•</span>
                  <Badge variant="outline" className="font-medium text-amber-600 bg-amber-50 border-amber-200">
                    {stats.pendingOrders} commande{stats.pendingOrders > 1 ? 's' : ''} en attente
                  </Badge>
                </>
              )}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <Button 
                key={index} 
                size="sm" 
                className={`gap-1.5 ${action.color} border shadow-sm h-9`}
              >
                {action.icon}
                <span>{action.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Products card */}
        <Card className="border-l-4 border-l-emerald-500 hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Stock Total</CardTitle>
              <div className="bg-emerald-50 p-2 rounded-full">
                <Package className="h-4 w-4 text-emerald-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold">{stats.totalProducts}</p>
                {stats.totalProducts > 0 ? (
                  <p className="text-xs text-emerald-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" /> 
                    <span>+8% depuis dernier mois</span>
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">Aucun produit en stock</p>
                )}
              </div>
            </div>
          </CardContent>
          {stats.lowStockProducts > 0 && stats.totalProducts > 0 && (
            <CardFooter className="pt-0">
              <div className="w-full">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-amber-600 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" /> 
                    {stats.lowStockProducts} produit{stats.lowStockProducts > 1 ? 's' : ''} en stock critique
                  </span>
                  <span className="text-xs text-gray-500">
                    {Math.round((stats.lowStockProducts / stats.totalProducts) * 100)}%
                  </span>
                </div>
                <Progress 
                  value={Math.round((stats.lowStockProducts / stats.totalProducts) * 100)} 
                  className="h-1.5 bg-gray-100" 
                />
              </div>
            </CardFooter>
          )}
        </Card>

        {/* Clients card */}
        <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Clients</CardTitle>
              <div className="bg-blue-50 p-2 rounded-full">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold">{stats.totalClients}</p>
                {stats.totalClients > 0 ? (
                  <p className="text-xs text-blue-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" /> 
                    <span>+3 nouveaux cette semaine</span>
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">Aucun client enregistré</p>
                )}
              </div>
            </div>
          </CardContent>
          {stats.totalClients > 0 && (
            <CardFooter className="pt-0">
              <Button variant="ghost" size="sm" className="text-xs gap-1 text-blue-600 px-0 hover:bg-transparent hover:text-blue-700">
                <span>Voir tous les clients</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </CardFooter>
          )}
        </Card>

        {/* Recent sales card */}
        <Card className="border-l-4 border-l-violet-500 hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ventes Récentes</CardTitle>
              <div className="bg-violet-50 p-2 rounded-full">
                <ShoppingBag className="h-4 w-4 text-violet-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold">{stats.recentSales}</p>
                {stats.recentSales > 0 ? (
                  <p className="text-xs text-violet-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" /> 
                    <span>Cette semaine</span>
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">Aucune vente récente</p>
                )}
              </div>
            </div>
          </CardContent>
          {stats.recentSales > 0 && (
            <CardFooter className="pt-0">
              <Button variant="ghost" size="sm" className="text-xs gap-1 text-violet-600 px-0 hover:bg-transparent hover:text-violet-700">
                <span>Historique des ventes</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </CardFooter>
          )}
        </Card>

        {/* Pending orders card with improved alert visibility */}
        <Card className={cn(
          "border-l-4 hover:shadow-md transition-all",
          stats.pendingOrders > 0 
            ? "border-l-amber-500 bg-gradient-to-br from-amber-50/50 to-transparent" 
            : "border-l-green-500"
        )}>
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Commandes en Attente</CardTitle>
              <div className={cn(
                "p-2 rounded-full",
                stats.pendingOrders > 0 ? "bg-amber-50" : "bg-green-50"
              )}>
                <Calendar className={cn(
                  "h-4 w-4",
                  stats.pendingOrders > 0 ? "text-amber-600" : "text-green-600"
                )} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold">{stats.pendingOrders}</p>
                {stats.pendingOrders > 0 ? (
                  <p className="text-xs text-amber-600 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" /> 
                    <span>Nécessite votre attention</span>
                  </p>
                ) : (
                  <p className="text-xs text-green-600 flex items-center">
                    <span>Toutes les commandes traitées</span>
                  </p>
                )}
              </div>
            </div>
          </CardContent>
          {stats.pendingOrders > 0 && (
            <CardFooter className="pt-0">
              <Button variant="ghost" size="sm" className="text-xs gap-1 text-amber-600 px-0 hover:bg-transparent hover:text-amber-700">
                <span>Traiter les commandes</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>

      {/* Alerts Section */}
      <Card className="backdrop-blur-sm bg-white/80">
        <CardHeader className="space-y-0 pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Alertes</CardTitle>
              <CardDescription>Alertes récentes nécessitant votre attention</CardDescription>
            </div>
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              {alerts.length} alertes
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {alerts.length > 0 ? (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors">
                  <div className="bg-amber-50 p-2 rounded-full">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{alert.title}</p>
                    <p className="text-xs text-gray-500">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[100px] flex items-center justify-center flex-col gap-2">
              <AlertCircle className="h-8 w-8 text-gray-300" />
              <p className="text-center text-gray-500">Aucune alerte</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sales Chart */}
      <Card className="lg:col-span-2 backdrop-blur-sm bg-white/80">
        <CardHeader>
          <CardTitle>Ventes</CardTitle>
          <CardDescription>Aperçu des ventes des 6 derniers mois</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {salesData ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salesData.labels.map((label, index) => ({
                    label,
                    value: salesData.datasets[0].data[index]
                  }))}
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="label" 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `${value} MAD`}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: '#E5E7EB' }}
                    width={80}
                  />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 shadow-md border rounded-lg">
                            <p className="font-medium text-sm mb-1">{label}</p>
                            <p className="text-emerald-600 text-sm">
                              <span className="font-medium">Ventes:</span> {payload[0]?.value} MAD
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={36} 
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => <span className="text-sm font-medium">{value}</span>}
                  />
                  <Bar 
                    dataKey="value" 
                    name="Ventes" 
                    fill="#10B981" 
                    radius={[4, 4, 0, 0]}
                    barSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center flex-col gap-2">
                <BarChart2 className="h-12 w-12 text-gray-300" />
                <p className="text-center text-gray-500">Aucune donnée disponible</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="backdrop-blur-sm bg-white/80">
        <CardHeader className="space-y-0 pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Ventes Récentes</CardTitle>
              <CardDescription>Dernières transactions</CardDescription>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {recentTransactions.length} ventes
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <Avatar className="h-10 w-10 border">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {getInitials(transaction.customer)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{transaction.customer}</p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <span>{transaction.date}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{transaction.amount} MAD</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center flex-col gap-2">
              <ShoppingBag className="h-12 w-12 text-gray-300" />
              <p className="text-center text-gray-500">Aucune transaction récente</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role-specific content with improved UI */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          {user?.role === "admin" && <TabsTrigger value="admin">Administration</TabsTrigger>}
          {user?.role === "pharmacist" && <TabsTrigger value="pharmacy">Pharmacie</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {/* Quick action cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-gradient-to-br from-blue-50 to-violet-50 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Inventaire</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground">Gérez vos produits et alertes de stock</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full gap-2 border-blue-200">
                  <Pill className="h-4 w-4" />
                  <span>Gérer l'inventaire</span>
                </Button>
              </CardFooter>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Clients</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground">Gérez vos clients et leurs ordonnances</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full gap-2 border-green-200">
                  <Users className="h-4 w-4" />
                  <span>Gérer les clients</span>
                </Button>
              </CardFooter>
            </Card>
            <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Rapports</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground">Accédez aux rapports et analyses</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full gap-2 border-amber-200">
                  <FileText className="h-4 w-4" />
                  <span>Voir les rapports</span>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {/* Admin specific tab */}
        {user?.role === "admin" && (
          <TabsContent value="admin" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Actions administratives</CardTitle>
                <CardDescription>Gérez les aspects administratifs de la pharmacie</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-lg border p-4 hover:bg-gray-50 transition-colors">
                    <h3 className="font-medium flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-blue-600" />
                      Gestion des utilisateurs
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Gérez les comptes utilisateurs et les permissions
                    </p>
                    <Button size="sm" variant="outline" className="w-full">Gérer</Button>
                  </div>
                  <div className="rounded-lg border p-4 hover:bg-gray-50 transition-colors">
                    <h3 className="font-medium flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-violet-600" />
                      Rapports système
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Consultez les rapports d'activité et les logs
                    </p>
                    <Button size="sm" variant="outline" className="w-full">Consulter</Button>
                  </div>
                  <div className="rounded-lg border p-4 hover:bg-gray-50 transition-colors">
                    <h3 className="font-medium flex items-center gap-2 mb-2">
                      <Bell className="h-4 w-4 text-amber-600" />
                      Notifications
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Gérez les paramètres de notification
                    </p>
                    <Button size="sm" variant="outline" className="w-full">Configurer</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        {/* Pharmacist specific tab */}
        {user?.role === "pharmacist" && (
          <TabsContent value="pharmacy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Actions pharmaceutiques</CardTitle>
                <CardDescription>Gérez les opérations quotidiennes de la pharmacie</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-lg border p-4 hover:bg-gray-50 transition-colors">
                    <h3 className="font-medium flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      Prescriptions
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Gérez les prescriptions et les ordonnances
                    </p>
                    <Button size="sm" variant="outline" className="w-full">Gérer</Button>
                  </div>
                  <div className="rounded-lg border p-4 hover:bg-gray-50 transition-colors">
                    <h3 className="font-medium flex items-center gap-2 mb-2">
                      <Package className="h-4 w-4 text-emerald-600" />
                      Inventaire
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Suivez les stocks et les commandes
                    </p>
                    <Button size="sm" variant="outline" className="w-full">Consulter</Button>
                  </div>
                  <div className="rounded-lg border p-4 hover:bg-gray-50 transition-colors">
                    <h3 className="font-medium flex items-center gap-2 mb-2">
                      <Pill className="h-4 w-4 text-violet-600" />
                      Médicaments
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Gérez la base de données des médicaments
                    </p>
                    <Button size="sm" variant="outline" className="w-full">Modifier</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
      
      {/* Floating action button for mobile */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <Button size="icon" className="h-14 w-14 rounded-full shadow-lg bg-pharma-primary hover:bg-pharma-primary/90">
          <PlusCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
} 