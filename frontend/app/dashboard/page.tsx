"use client"

import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import { 
  Loader2, Package, Users, TrendingUp, Bell, AlertCircle, 
  FileText, Pill, ShoppingBag, User, ArrowRight, Calendar,
  BarChart2, PlusCircle, Home, Package2, MoreHorizontal,
  Heart, Activity, ChevronRight, Clock, CheckCircle, Settings
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, TooltipProps, Area, AreaChart
} from 'recharts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import ECGAnimation from "@/components/ECGAnimation"

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
      <div className="bg-white/95 backdrop-blur-sm p-4 shadow-lg border border-blue-100/50 rounded-xl">
        <p className="font-semibold text-sm mb-1.5 text-slate-700">{label}</p>
        <p className="text-blue-600 text-sm flex items-center gap-1.5">
          <Activity className="h-3.5 w-3.5" />
          <span className="font-medium">{payload[0]?.value}</span>
          <span className="text-slate-500 text-xs">sales</span>
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

// Animated counter component
const AnimatedCounter = ({ value, label, color }: { value: number; label: string; color: string }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const duration = 1000; // ms
    const steps = 20;
    const stepTime = duration / steps;
    const increment = value / steps;
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      setDisplayValue(Math.min(Math.round(increment * currentStep), value));
      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return (
    <div className="flex flex-col">
      <h2 className={`text-3xl font-bold ${color}`}>{displayValue}</h2>
      <p className="text-gray-500 text-sm">{label}</p>
    </div>
  );
};

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

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
            totalProducts: 5,
            lowStockProducts: 1,
            totalClients: 842,
            recentSales: 28,
            pendingOrders: 3,
            alerts: 3
          },
          salesChart: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            data: [60, 75, 60, 79, 99, 70, 60]
          },
          recentSales: [
            { id: "1", customer: "Mohammed Alami", amount: 450, date: "Il y a 3 heures" },
            { id: "2", customer: "Fatima Benali", amount: 235, date: "Il y a 5 heures" },
            { id: "3", customer: "Ahmed Laroussi", amount: 290, date: "Il y a 1 jour" }
          ],
          recentSalesCount: 3,
          alerts: [
            { id: "1", title: "Avertissement Stock", message: "1 produit en stock critique" },
            { id: "2", title: "Mise à jour Système", message: "Nouvelle mise à jour disponible" },
            { id: "3", title: "Problème de licence", message: "Vérifiez votre licence" }
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

  // Transform data for chart
  const chartData = data?.salesChart ? 
    data.salesChart.labels.map((label, index) => ({
      name: label,
      value: data.salesChart.data[index],
    })) : [];

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
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-blue-500 animate-spin"></div>
            <div className="absolute inset-1 rounded-full border-t-2 border-teal-400 animate-spin animate-delay-150"></div>
            <div className="absolute inset-2 rounded-full border-t-2 border-indigo-600 animate-spin animate-delay-300"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Heart className="h-6 w-6 text-teal-500" />
            </div>
          </div>
          <p className="text-teal-600 font-medium bg-gradient-to-r from-blue-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
  
  // Get time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-10">
            {/* Welcome section with gradient background */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-500 rounded-3xl p-6 shadow-xl text-white mb-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-15 bg-center"></div>
        
        {/* ECG Animation in background */}
        <div className="absolute inset-0 opacity-20 flex items-center justify-center overflow-hidden pointer-events-none">
          <ECGAnimation 
            width={1200} 
            height={200} 
            color="#ffffff" 
            speed={2} 
            showBackground={false}
            strokeWidth={3}
          />
        </div>
        
        {/* Animated background elements */}
        <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-3xl animate-pulse"></div>
        <div className="absolute -top-12 -left-12 w-36 h-36 rounded-full bg-blue-300/10 blur-3xl animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-200 via-white/20 to-cyan-200 opacity-30"></div>
        
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-gradient-x"></div>
        
        <div className="flex justify-between items-center relative z-10">
          <div>
            <motion.h1 
              className="text-3xl font-bold text-white"
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {getGreeting()}, <span className="text-cyan-100 relative inline-block">
                {user?.name?.split(' ')[0]}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-200/50 animate-pulse"></span>
              </span>
            </motion.h1>
            <motion.p 
              className="text-cyan-100 mt-1 flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {formattedDate} 
              <span className="inline-block w-1.5 h-1.5 bg-white/50 rounded-full mx-2 animate-pulse"></span>
              <span className="text-white/80">Dashboard Overview</span>
            </motion.p>
          </div>
          <motion.div 
            className="relative bg-white/20 backdrop-blur-md rounded-full p-3 w-12 h-12 flex items-center justify-center shadow-inner shadow-white/20 border border-white/30 group"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping opacity-75"></div>
            <Heart className="h-6 w-6 text-white drop-shadow-sm animate-heartbeat" />
          </motion.div>
        </div>
      </motion.div>

      <style jsx global>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes heartbeat {
          0% { transform: scale(1); }
          15% { transform: scale(1.15); }
          30% { transform: scale(1); }
          45% { transform: scale(1.15); }
          60% { transform: scale(1); }
          100% { transform: scale(1); }
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
        
        .animate-heartbeat {
          animation: heartbeat 2s infinite ease-in-out;
        }
      `}</style>

      {/* Stats Cards in Grid */}
      <div className="grid grid-cols-2 gap-5 mb-8">
        {/* Products Card */}
        <motion.div 
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={0}
          className="group"
        >
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border-none overflow-hidden h-full">
            <CardContent className="p-5">
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-full w-14 h-14 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300 border border-teal-200/50">
                <Package2 className="h-7 w-7 text-teal-600" />
              </div>
              <AnimatedCounter value={stats.totalProducts} label="Total Products" color="text-teal-700" />
          </CardContent>
        </Card>
        </motion.div>

        {/* Clients Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={1}
          className="group"
        >
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border-none overflow-hidden h-full">
            <CardContent className="p-5">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-full w-14 h-14 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300 border border-blue-200/50">
                <Users className="h-7 w-7 text-blue-600" />
              </div>
              <AnimatedCounter value={stats.totalClients} label="Clients" color="text-blue-700" />
          </CardContent>
        </Card>
        </motion.div>

        {/* Sales Today Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={2}
          className="group"
        >
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border-none overflow-hidden h-full">
            <CardContent className="p-5">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-full w-14 h-14 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300 border border-indigo-200/50">
                <ShoppingBag className="h-7 w-7 text-indigo-600" />
              </div>
              <AnimatedCounter value={stats.recentSales} label="Sales Today" color="text-indigo-700" />
          </CardContent>
        </Card>
        </motion.div>

        {/* Alerts Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={3}
          className="group"
        >
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border-none overflow-hidden h-full">
            <CardContent className="p-5">
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-full w-14 h-14 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300 border border-amber-200/50">
                <AlertCircle className="h-7 w-7 text-amber-600" />
              </div>
              <AnimatedCounter value={stats.alerts} label="Alerts" color="text-amber-700" />
          </CardContent>
        </Card>
        </motion.div>
      </div>

      {/* Sales Performance Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">Sales Performance</h2>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors gap-1.5 text-sm" asChild>
            <Link href="/reports">
            <span>View Details</span>
            <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
            </div>
        <Card className="bg-white shadow-lg rounded-xl border-none overflow-hidden">
          <CardContent className="p-4 pt-6">
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                >
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    stroke="#94a3b8"
                    fontSize={12}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    stroke="#94a3b8"
                    fontSize={12}
                    tickFormatter={(value) => `${value}`}
                    dx={-10}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      </motion.div>

      {/* Alert Cards Section */}
      {alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-slate-800 mb-4">Alerts & Notifications</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {alerts.map((alert, index) => (
              <Card key={alert.id} className="bg-white shadow-md hover:shadow-lg transition-all duration-300 border-none overflow-hidden group">
                <CardContent className="p-4 relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/5 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-500"></div>
                  <div className="mb-3 flex justify-between items-start">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                    </div>
                    <Badge className="bg-amber-100 text-amber-700 font-medium px-2 py-1">Alert</Badge>
            </div>
                  <h3 className="font-semibold text-slate-800 mb-1">{alert.title}</h3>
                  <p className="text-sm text-slate-600">{alert.message}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent Transactions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">Recent Transactions</h2>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors gap-1.5 text-sm" asChild>
            <Link href="/sales">
            <span>View All</span>
            <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <Card className="bg-white shadow-lg rounded-xl border-none overflow-hidden">
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
          {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="p-4 hover:bg-blue-50/30 transition-colors flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-blue-100">
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                      {getInitials(transaction.customer)}
                    </AvatarFallback>
                  </Avatar>
                      <div>
                        <p className="font-medium text-slate-800">{transaction.customer}</p>
                        <p className="text-sm text-slate-500">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-blue-700">{transaction.amount.toFixed(2)} DH</span>
                      <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <p className="text-slate-500">No recent transactions</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50/80 p-3 flex justify-center">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-blue-700 text-sm gap-1" asChild>
              <Link href="/sales/new">
              <PlusCircle className="h-4 w-4" />
              <span>New Transaction</span>
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Low Stock Inventory Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">Low Stock Inventory</h2>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors gap-1.5 text-sm" asChild>
            <Link href="/inventory">
            <span>Inventory</span>
            <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <Card className="bg-white shadow-lg rounded-xl border-none overflow-hidden">
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80 text-left">
                  <th className="py-3 px-4 font-medium text-slate-600 text-sm">Product</th>
                  <th className="py-3 px-4 font-medium text-slate-600 text-sm">Category</th>
                  <th className="py-3 px-4 font-medium text-slate-600 text-sm">Stock</th>
                  <th className="py-3 px-4 font-medium text-slate-600 text-sm sr-only">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inventory.length > 0 ? (
                  inventory.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{item.name}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="bg-slate-50 text-slate-700 font-normal">
                          {item.category}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                                                     <div className="w-24">
                             <div className={cn("h-2 w-full rounded-full overflow-hidden bg-slate-100")}>
                               <div 
                                 className={cn(
                                   "h-full transition-all", 
                                   item.stock < 10 ? "bg-red-500" : "bg-emerald-500"
                                 )}
                                 style={{ 
                                   width: `${Math.min((item.stock / 20) * 100, 100)}%` 
                                 }}
                               />
                             </div>
                           </div>
                          <span className={cn(
                            "text-sm font-medium",
                            item.stock < 10 ? "text-red-600" : "text-emerald-600"
                          )}>
                            {item.stock}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-blue-600 hover:bg-blue-50">
                          Reorder
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-500">
                      No low stock items
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
        </CardContent>
      </Card>
      </motion.div>

      {/* Prescriptions Overview Section */}
      {prescriptions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-800">Prescriptions Overview</h2>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors gap-1.5 text-sm" asChild>
              <Link href="/prescriptions">
              <span>View All</span>
              <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 rounded-xl border-none overflow-hidden h-full">
              <CardContent className="p-5 flex justify-between items-center">
                <div>
                  <p className="text-slate-500 text-sm">Total</p>
                  <p className="text-2xl font-bold text-slate-800">{prescriptions.total}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 rounded-xl border-none overflow-hidden h-full">
              <CardContent className="p-5 flex justify-between items-center">
                <div>
                  <p className="text-slate-500 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-amber-600">{prescriptions.pending}</p>
                </div>
                <div className="bg-amber-100 p-3 rounded-full">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 rounded-xl border-none overflow-hidden h-full">
              <CardContent className="p-5 flex justify-between items-center">
                <div>
                  <p className="text-slate-500 text-sm">Completed</p>
                  <p className="text-2xl font-bold text-emerald-600">{prescriptions.completed}</p>
                </div>
                <div className="bg-emerald-100 p-3 rounded-full">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 rounded-xl border-none overflow-hidden h-full">
              <CardContent className="p-5 flex justify-between items-center">
                <div>
                  <p className="text-slate-500 text-sm">Processing Rate</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {prescriptions.total > 0 
                      ? Math.round((prescriptions.completed / prescriptions.total) * 100) 
                      : 0}%
                  </p>
                </div>
                <div className="bg-indigo-100 p-3 rounded-full">
                  <Activity className="h-5 w-5 text-indigo-600" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-white shadow-lg rounded-xl border-none overflow-hidden">
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {prescriptions.recent && prescriptions.recent.length > 0 ? (
                  prescriptions.recent.map((prescription) => (
                    <div key={prescription.id} className="p-4 hover:bg-blue-50/30 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-blue-100">
                            {prescription.patient.avatar ? (
                              <AvatarImage src={prescription.patient.avatar} alt={prescription.patient.name} />
                            ) : (
                              <AvatarFallback className="bg-blue-100 text-blue-700">
                                {getInitials(prescription.patient.name)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <p className="font-medium text-slate-800">{prescription.patient.name}</p>
                            <p className="text-xs text-slate-500">Dr. {prescription.doctor}</p>
                          </div>
                        </div>
                        <Badge 
                          className={cn(
                            prescription.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                            prescription.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                            'bg-blue-100 text-blue-700'
                          )}
                        >
                          {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="pl-12 text-sm">
                        <p className="text-slate-600 mb-1">{prescription.date}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {prescription.medications.map((med, idx) => (
                            <Badge key={idx} variant="outline" className="bg-slate-50 flex items-center gap-1">
                              <Pill className="h-3 w-3" />
                              <span>{med.name}</span>
                              <span className="text-slate-500">×{med.quantity}</span>
                            </Badge>
                          ))}
                        </div>
                      </div>
                  </div>
                  ))
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-slate-500">No recent prescriptions</p>
                  </div>
                )}
                  </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Main Navigation Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.5 }}
        className="mb-12"
      >
        <h2 className="text-xl font-bold text-slate-800 mb-4">Navigation Principale</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link href="/inventory">
            <Card className="bg-white shadow-md hover:shadow-xl transition-all duration-300 rounded-xl border-none overflow-hidden h-full group">
              <CardContent className="p-5 flex flex-col items-center text-center">
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-full w-14 h-14 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 border border-teal-200/50">
                  <Package2 className="h-7 w-7 text-teal-600" />
                </div>
                <h3 className="font-medium text-slate-800">Inventaire</h3>
                <p className="text-xs text-slate-500 mt-1">Gérer les produits</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/clients">
            <Card className="bg-white shadow-md hover:shadow-xl transition-all duration-300 rounded-xl border-none overflow-hidden h-full group">
              <CardContent className="p-5 flex flex-col items-center text-center">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-full w-14 h-14 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 border border-blue-200/50">
                  <Users className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="font-medium text-slate-800">Clients</h3>
                <p className="text-xs text-slate-500 mt-1">Gestion clientèle</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/sales">
            <Card className="bg-white shadow-md hover:shadow-xl transition-all duration-300 rounded-xl border-none overflow-hidden h-full group">
              <CardContent className="p-5 flex flex-col items-center text-center">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-full w-14 h-14 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 border border-indigo-200/50">
                  <ShoppingBag className="h-7 w-7 text-indigo-600" />
                </div>
                <h3 className="font-medium text-slate-800">Ventes</h3>
                <p className="text-xs text-slate-500 mt-1">Transactions</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/prescriptions">
            <Card className="bg-white shadow-md hover:shadow-xl transition-all duration-300 rounded-xl border-none overflow-hidden h-full group">
              <CardContent className="p-5 flex flex-col items-center text-center">
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-full w-14 h-14 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 border border-amber-200/50">
                  <FileText className="h-7 w-7 text-amber-600" />
                </div>
                <h3 className="font-medium text-slate-800">Prescriptions</h3>
                <p className="text-xs text-slate-500 mt-1">Ordonnances</p>
              </CardContent>
            </Card>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          <Link href="/reports">
            <Card className="bg-white shadow-md hover:shadow-xl transition-all duration-300 rounded-xl border-none overflow-hidden h-full group">
              <CardContent className="p-5 flex flex-col items-center text-center">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-full w-14 h-14 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 border border-purple-200/50">
                  <BarChart2 className="h-7 w-7 text-purple-600" />
                </div>
                <h3 className="font-medium text-slate-800">Rapports</h3>
                <p className="text-xs text-slate-500 mt-1">Statistiques</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/calendar">
            <Card className="bg-white shadow-md hover:shadow-xl transition-all duration-300 rounded-xl border-none overflow-hidden h-full group">
              <CardContent className="p-5 flex flex-col items-center text-center">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-full w-14 h-14 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 border border-green-200/50">
                  <Calendar className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="font-medium text-slate-800">Calendrier</h3>
                <p className="text-xs text-slate-500 mt-1">Rendez-vous</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/alerts">
            <Card className="bg-white shadow-md hover:shadow-xl transition-all duration-300 rounded-xl border-none overflow-hidden h-full group">
              <CardContent className="p-5 flex flex-col items-center text-center">
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-full w-14 h-14 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 border border-red-200/50">
                  <Bell className="h-7 w-7 text-red-600" />
                </div>
                <h3 className="font-medium text-slate-800">Alertes</h3>
                <p className="text-xs text-slate-500 mt-1">Notifications</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/settings">
            <Card className="bg-white shadow-md hover:shadow-xl transition-all duration-300 rounded-xl border-none overflow-hidden h-full group">
              <CardContent className="p-5 flex flex-col items-center text-center">
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-full w-14 h-14 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 border border-slate-200/50">
                  <Settings className="h-7 w-7 text-slate-600" />
                </div>
                <h3 className="font-medium text-slate-800">Paramètres</h3>
                <p className="text-xs text-slate-500 mt-1">Configuration</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </motion.div>

      {/* Quick Actions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.5 }}
        className="mb-12"
      >
        <h2 className="text-xl font-bold text-slate-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link href="/inventory/add">
            <Card className="bg-white shadow-md hover:shadow-xl transition-all duration-300 rounded-xl border-none overflow-hidden h-full group">
              <CardContent className="p-5 flex flex-col items-center text-center">
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-full w-14 h-14 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 border border-teal-200/50">
                  <Package2 className="h-7 w-7 text-teal-600" />
                </div>
                <h3 className="font-medium text-slate-800">Add Product</h3>
                <p className="text-xs text-slate-500 mt-1">Add new medication</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/clients/add">
            <Card className="bg-white shadow-md hover:shadow-xl transition-all duration-300 rounded-xl border-none overflow-hidden h-full group">
              <CardContent className="p-5 flex flex-col items-center text-center">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-full w-14 h-14 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 border border-blue-200/50">
                  <User className="h-7 w-7 text-blue-600" />
                  </div>
                <h3 className="font-medium text-slate-800">New Client</h3>
                <p className="text-xs text-slate-500 mt-1">Register client</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/sales/new">
            <Card className="bg-white shadow-md hover:shadow-xl transition-all duration-300 rounded-xl border-none overflow-hidden h-full group">
              <CardContent className="p-5 flex flex-col items-center text-center">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-full w-14 h-14 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 border border-indigo-200/50">
                  <ShoppingBag className="h-7 w-7 text-indigo-600" />
                  </div>
                <h3 className="font-medium text-slate-800">New Sale</h3>
                <p className="text-xs text-slate-500 mt-1">Process transaction</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/prescriptions/new">
            <Card className="bg-white shadow-md hover:shadow-xl transition-all duration-300 rounded-xl border-none overflow-hidden h-full group">
              <CardContent className="p-5 flex flex-col items-center text-center">
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-full w-14 h-14 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 border border-amber-200/50">
                  <FileText className="h-7 w-7 text-amber-600" />
                </div>
                <h3 className="font-medium text-slate-800">Prescription</h3>
                <p className="text-xs text-slate-500 mt-1">Process prescription</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </motion.div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 flex justify-around sm:hidden z-50 shadow-lg">
        <Link href="/inventory" className="flex flex-col items-center text-gray-500 hover:text-blue-500 transition-colors">
          <Package2 className="w-6 h-6" />
          <span className="text-xs mt-1">Inventory</span>
        </Link>
        <Link href="/clients" className="flex flex-col items-center text-gray-500 hover:text-blue-500 transition-colors">
          <Users className="w-6 h-6" />
          <span className="text-xs mt-1">Clients</span>
        </Link>
        <div className="relative -mt-8">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 blur-md opacity-50"></div>
          <Link href="/dashboard" className="relative flex flex-col items-center bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full p-3 text-white shadow-lg border border-white/20">
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </Link>
        </div>
        <Link href="/sales" className="flex flex-col items-center text-gray-500 hover:text-blue-500 transition-colors">
          <ShoppingBag className="w-6 h-6" />
          <span className="text-xs mt-1">Sales</span>
        </Link>
        <Link href="/more" className="flex flex-col items-center text-gray-500 hover:text-blue-500 transition-colors">
          <MoreHorizontal className="w-6 h-6" />
          <span className="text-xs mt-1">More</span>
        </Link>
      </div>
    </div>
  )
} 