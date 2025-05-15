"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/dashboard/overview"
import { RecentSales } from "@/components/dashboard/recent-sales"
import { MainNav } from "@/components/dashboard/main-nav"
import { Search } from "@/components/dashboard/search"
import { UserNav } from "@/components/dashboard/user-nav"
import { MedicationsList } from "@/components/dashboard/medications-list"
import { ClientsList } from "@/components/dashboard/clients-list"
import { CalendarView } from "@/components/dashboard/calendar-view"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { useMobile } from "@/hooks/use-mobile"
import { AlertsDashboard } from "@/components/dashboard/alerts-dashboard"
import { DashboardCards } from "@/components/dashboard/dashboard-cards"
import { Input } from "@/components/ui/input"
import { 
  SearchIcon, Pill, Download, Plus, ShoppingCart, UserPlus, 
  FileText, BarChart, Bell, Menu, X, ChevronDown, Settings,
  LayoutDashboard, Users, Calendar, AlertTriangle, Package, 
  LineChart, Home, LogOut, Moon, Sun
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw } from "lucide-react"
import { AnalyticsDashboard } from "@/components/dashboard/analytics-dashboard"
import { SettingsDashboard } from "@/components/dashboard/settings-dashboard"
import { PrescriptionsDashboard } from "@/components/dashboard/prescriptions-dashboard"
import api from "@/lib/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { SearchBox } from "@/components/shared/search-box"

interface DashboardData {
  stats: {
    totalSales: number
    totalOrders: number
    totalCustomers: number
    totalRevenue: number
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
  alerts: any[]
  inventory: any[]
  clients: any[]
  calendar: any[]
  analytics: any[]
  settings: any
  prescriptions: {
    total?: number
    pending?: number
    completed?: number
    recent?: Array<{
      id: string
      patient: {
        name: string
        avatar?: string
      }
      doctor: string
      date: string
      status: "pending" | "completed" | "cancelled"
      medications: Array<{
        name: string
        quantity: number
      }>
    }>
  }
}

const iconMap: Record<string, string> = {
  LayoutDashboard: "📊",
  Bell: "🔔",
  Pill: "💊",
  Users: "👥",
  Calendar: "📅",
  BarChart: "📈",
  Settings: "⚙️",
  FileText: "📄"
}

export function DashboardPage() {
  const { user, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const isMobile = useMobile()
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchResults, setSearchResults] = useState<{
    medications: any[];
    clients: any[];
  } | null>(null)
  const [isSearchResultsOpen, setIsSearchResultsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Initialize dark mode from localStorage
  useEffect(() => {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('pharma-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    // Set dark mode based on saved preference or system preference
    const shouldEnableDark = savedTheme === 'dark' || (!savedTheme && prefersDark)
    setIsDarkMode(shouldEnableDark)
    
    // Apply theme to document
    if (shouldEnableDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  // Toggle dark mode and store preference
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode
      
      // Save preference to localStorage
      localStorage.setItem('pharma-theme', newMode ? 'dark' : 'light')
      
      // Apply or remove dark class from html element
      if (newMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      
      return newMode
    })
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get(`/dashboard/data?role=${user?.role}`)
        setDashboardData(response.data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        // Provide fallback mock data when API call fails
        setDashboardData({
          stats: {
            totalSales: 8459,
            totalOrders: 145,
            totalCustomers: 72,
            totalRevenue: 145890,
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
          alerts: [{ id: "1", title: "Stock faible", message: "12 produits en stock critique" }],
          inventory: [
            { id: "1", name: "Paracetamol 500mg", stock: 8, category: "Analgésique" },
            { id: "2", name: "Amoxicilline 1g", stock: 15, category: "Antibiotique" }
          ],
          clients: [],
          calendar: [],
          analytics: [],
          settings: {},
          prescriptions: {
            total: 0,
            pending: 0,
            completed: 0,
            recent: []
          }
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [user?.role])

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchResultsOpen(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search query changes with debounce
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults(null);
      setIsSearchResultsOpen(false);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    if (!query.trim()) return;
    
    try {
      // You can replace this with actual API call
      // const response = await api.get(`/search?query=${encodeURIComponent(query)}`);
      // setSearchResults(response.data);

      // Mock search results for demo
      const mockResults = {
        medications: [
          { id: '1', name: 'Paracetamol 500mg', stock: 120, category: 'Analgésique' },
          { id: '2', name: 'Amoxicilline 1g', stock: 85, category: 'Antibiotique' },
          { id: '3', name: 'Doliprane 1000mg', stock: 65, category: 'Analgésique' },
        ].filter(med => med.name.toLowerCase().includes(query.toLowerCase())),
        clients: [
          { id: '1', name: 'Mohammed Alami', phone: '0612345678', lastVisit: '2023-05-12' },
          { id: '2', name: 'Fatima Benali', phone: '0698765432', lastVisit: '2023-05-18' },
          { id: '3', name: 'Ahmed Laroussi', phone: '0661234567', lastVisit: '2023-05-15' },
        ].filter(client => client.name.toLowerCase().includes(query.toLowerCase()))
      };
      
      setSearchResults(mockResults);
      setIsSearchResultsOpen(true);
    } catch (error) {
      console.error('Error performing search:', error);
      setSearchResults(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      performSearch(searchQuery)
    }
  }

  const handleSearchItemClick = (type: string, id: string) => {
    // Handle navigation to the selected item
    if (type === 'medication') {
      setActiveTab("inventory")
      // Additional logic to focus on the specific medication
    } else if (type === 'client') {
      setActiveTab("clients")
      // Additional logic to focus on the specific client
    }
    
    setIsSearchResultsOpen(false)
  }

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-pharma-primary mx-auto mb-4" />
          <p className="text-pharma-primary font-medium dark:text-pharma-primary/90">Chargement des données...</p>
        </div>
      </div>
    )
  }

  const navigationItems = [
    {
      label: "Tableau de bord",
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
      href: "/dashboard",
      isActive: activeTab === "overview",
      onClick: () => setActiveTab("overview")
    },
    {
      label: "Inventaire",
      icon: <Package className="h-4 w-4 mr-2" />,
      children: [
        { label: "Stock", href: "#", onClick: () => setActiveTab("inventory") },
        { label: "Catégories", href: "#", onClick: () => {} },
        { label: "Fournisseurs", href: "#", onClick: () => {} },
        { label: "Commandes", href: "#", onClick: () => {} }
      ]
    },
    {
      label: "Ventes",
      icon: <ShoppingCart className="h-4 w-4 mr-2" />,
      children: [
        { label: "Nouvelle vente", href: "#", onClick: () => {} },
        { label: "Historique", href: "#", onClick: () => {} },
        { label: "Factures", href: "#", onClick: () => {} }
      ]
    },
    {
      label: "Clients",
      icon: <Users className="h-4 w-4 mr-2" />,
      href: "#",
      onClick: () => setActiveTab("clients")
    },
    {
      label: "Alertes",
      icon: <AlertTriangle className="h-4 w-4 mr-2" />,
      badge: dashboardData?.stats?.alerts || 0,
      href: "#",
      onClick: () => setActiveTab("alerts")
    },
    {
      label: "Calendrier",
      icon: <Calendar className="h-4 w-4 mr-2" />,
      href: "#",
      onClick: () => setActiveTab("calendar")
    }
  ]

  // Add admin-specific items
  if (user?.role === 'admin') {
    navigationItems.push(
      {
        label: "Analytics",
        icon: <LineChart className="h-4 w-4 mr-2" />,
        href: "#",
        onClick: () => setActiveTab("analytics")
      },
      {
        label: "Paramètres",
        icon: <Settings className="h-4 w-4 mr-2" />,
        href: "#",
        onClick: () => setActiveTab("settings")
      }
    )
  }

  // Add pharmacist-specific items
  if (user?.role === 'pharmacist') {
    navigationItems.push(
      {
        label: "Ordonnances",
        icon: <FileText className="h-4 w-4 mr-2" />,
        href: "#",
        onClick: () => setActiveTab("prescriptions")
      }
    )
  }

  // Define the role-based tabs
  const getRoleBasedTabs = () => {
    const baseTabs = [
      { value: "overview", label: "Aperçu", icon: "LayoutDashboard" },
      { value: "alerts", label: "Alertes", icon: "Bell" },
      { value: "inventory", label: "Inventaire", icon: "Pill" },
      { value: "clients", label: "Clients", icon: "Users" },
      { value: "calendar", label: "Calendrier", icon: "Calendar" }
    ];

    if (user?.role === 'admin') {
      return [
        ...baseTabs,
        { value: "analytics", label: "Analytics", icon: "BarChart" },
        { value: "settings", label: "Paramètres", icon: "Settings" }
      ];
    }

    if (user?.role === 'pharmacist') {
      return [
        ...baseTabs,
        { value: "prescriptions", label: "Ordonnances", icon: "FileText" }
      ];
    }

    return baseTabs;
  };

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200" style={{ overflow: 'visible' }}>
        <div className="mx-auto w-full max-w-screen-2xl" style={{ overflow: 'visible' }}>
          <div className="flex h-16 items-center px-4 md:px-6" style={{ overflow: 'visible' }}>
            {/* Mobile menu toggle */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="mr-2 text-gray-600 dark:text-gray-300">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0 dark:bg-gray-800 dark:border-gray-700">
                <SheetHeader className="border-b border-gray-200 dark:border-gray-700 p-4">
                  <SheetTitle className="dark:text-white">
                    <div className="flex items-center gap-2">
                      <div className="bg-gradient-to-r from-[#06b6d4] to-[#0ea5e9] p-2 rounded-full">
                        <Pill className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-bold">PharmaFlow</span>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <div className="py-4 dark:bg-gray-800">
                  <div className="flex flex-col space-y-1 px-2">
                    {navigationItems.map((item, index) => (
                      item.children ? (
                        <div key={index} className="space-y-1">
                          <div className="flex items-center py-2 px-3 text-sm font-medium dark:text-gray-200">
                            {item.icon}
                            {item.label}
                          </div>
                          <div className="pl-6 space-y-1">
                            {item.children.map((child, childIndex) => (
                              <SheetClose asChild key={childIndex}>
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start text-sm hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"
                                  onClick={child.onClick}
                                >
                                  {child.label}
                                </Button>
                              </SheetClose>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <SheetClose asChild key={index}>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start dark:text-gray-300",
                              item.isActive && "bg-[#06b6d4]/10 text-[#06b6d4] font-medium dark:bg-[#06b6d4]/20"
                            )}
                            onClick={item.onClick}
                          >
                            <div className="flex items-center">
                              {item.icon}
                              <span>{item.label}</span>
                              {item.badge ? (
                                <Badge 
                                  className="ml-auto bg-red-500 text-white text-xs" 
                                  variant="secondary"
                                >
                                  {item.badge}
                                </Badge>
                              ) : null}
                            </div>
                          </Button>
                        </SheetClose>
                      )
                    ))}
                  </div>
                  <Separator className="my-4 dark:bg-gray-700" />
                  <div className="px-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={logout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Déconnexion
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2 mr-6">
              <div className="rounded-full bg-[#06b6d4] flex items-center justify-center w-8 h-8">
                <Pill className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#06b6d4] hidden md:block">PharmaFlow</span>
            </Link>

            {/* Main Navigation Links - Simplified */}
            <nav className="hidden md:flex items-center space-x-2 ml-2">
              <Button variant={activeTab === "overview" ? "default" : "ghost"} 
                className={activeTab === "overview" ? "bg-[#06b6d4] text-white" : "text-slate-600 dark:text-slate-200"} 
                onClick={() => setActiveTab("overview")}>
                Tableau de bord
              </Button>
              
              <Button variant={activeTab.includes("inventory") ? "default" : "ghost"}
                className={activeTab.includes("inventory") ? "bg-[#06b6d4] text-white" : "text-slate-600 dark:text-slate-200"} 
                onClick={() => setActiveTab("inventory")}>
                Inventaire & Stock
              </Button>
              
              <Button variant={activeTab.includes("clients") ? "default" : "ghost"} 
                className={activeTab.includes("clients") ? "bg-[#06b6d4] text-white" : "text-slate-600 dark:text-slate-200"} 
                onClick={() => setActiveTab("clients")}>
                Ventes & Clients
                      </Button>
            </nav>

            {/* Search bar using our new SearchBox component */}
            <div className="flex-1 ml-4 max-w-md relative" style={{ 
              zIndex: 2147483647, 
              position: 'relative',
              overflow: 'visible' 
            }}>
              <SearchBox 
                placeholder="Rechercher médicaments, clients..."
                size="md"
                maxWidth="w-full"
                showTabs={true}
                isDashboard={true}
                positionMode="container-relative"
                onResultClick={(result) => {
                  // Switch to appropriate tab based on result type
                  switch (result.type) {
                    case 'medication':
                      setActiveTab("inventory");
                      break;
                    case 'client':
                      setActiveTab("clients");
                      break;
                    case 'prescription':
                      setActiveTab("prescriptions");
                      break;
                    case 'sale':
                      // You might want to add a sales tab
                      break;
                  }
                }}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 ml-4">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative" onClick={() => setActiveTab("alerts")}>
                <Bell className="h-5 w-5 text-slate-600 dark:text-gray-300" />
                {(dashboardData?.stats?.alerts || 0) > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                    {dashboardData?.stats?.alerts || 0}
                  </span>
                )}
                <span className="sr-only">Notifications</span>
              </Button>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 rounded-full flex items-center gap-2 pl-1 pr-2">
                    <Avatar className="h-7 w-7 border border-slate-200 dark:border-slate-600">
                      <AvatarImage 
                        src={user?.avatar || `/avatars/default.png`} 
                        alt={user?.name || 'User'} 
                      />
                      <AvatarFallback className="bg-[#06b6d4] text-white">
                        {user?.name?.split(" ").map(n => n[0]).join("").toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 dark:bg-gray-800 dark:border-gray-700" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal dark:text-gray-200">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none dark:text-white">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground dark:text-gray-400">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="dark:bg-gray-700" />
                  <DropdownMenuItem 
                    onClick={() => setActiveTab("settings")}
                    className="dark:text-gray-300 dark:focus:bg-gray-700 dark:focus:text-white"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Paramètres</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={toggleDarkMode}
                    className="dark:text-gray-300 dark:focus:bg-gray-700 dark:focus:text-white"
                  >
                    {isDarkMode ? (
                      <><Sun className="mr-2 h-4 w-4" /><span>Mode clair</span></>
                    ) : (
                      <><Moon className="mr-2 h-4 w-4" /><span>Mode sombre</span></>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="dark:bg-gray-700" />
                  <DropdownMenuItem 
                    onClick={logout}
                    className="dark:text-gray-300 dark:focus:bg-gray-700 dark:focus:text-white"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex-1 space-y-6 p-4 pt-6 md:p-8 bg-white dark:bg-gray-900 transition-colors duration-200">
        {/* Welcome Banner with Quick Actions */}
        <div className="bg-gradient-to-r from-pharma-primary/10 to-pharma-secondary/5 dark:from-pharma-primary/20 dark:to-pharma-secondary/10 rounded-xl p-4 mb-2">
          <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bonjour, {user?.name || 'Pharmacien'}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {new Date().toLocaleDateString('fr-FR', {weekday: 'long', day: 'numeric', month: 'long'})}
                {dashboardData?.stats?.pendingOrders ? ` • ${dashboardData.stats.pendingOrders} commandes en attente` : ''}
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full md:w-auto">
              <Button variant="outline" className="bg-white dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 shadow-sm h-10">
                <ShoppingCart className="h-4 w-4 mr-1" />
                <span>Vente</span>
              </Button>
              <Button variant="outline" className="bg-white dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 shadow-sm h-10">
                <UserPlus className="h-4 w-4 mr-1" />
                <span>Client</span>
              </Button>
              <Button variant="outline" className="bg-white dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 shadow-sm h-10">
                <Pill className="h-4 w-4 mr-1" />
                <span>Produit</span>
              </Button>
              <Button variant="outline" className="bg-white dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 shadow-sm h-10">
                <BarChart className="h-4 w-4 mr-1" />
                <span>Rapport</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Dashboard Cards */}
        <DashboardCards data={dashboardData?.stats} />
        
        {/* Main Content with Tabs */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList className="bg-white border rounded-lg p-1 shadow-sm">
              {getRoleBasedTabs().map((tab: { value: string, label: string, icon: string }) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-md data-[state=active]:bg-pharma-primary data-[state=active]:text-white"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="mr-1">{iconMap[tab.icon]}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="gap-1">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Exporter</span>
              </Button>
              <Button size="sm" className="gap-1 bg-pharma-primary text-white">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Nouveau produit</span>
              </Button>
            </div>
          </div>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="border-pharma-primary/20 shadow-sm">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-pharma-primary">Aperçu des ventes</CardTitle>
                    <CardDescription>Évolution des ventes et achats sur les 7 derniers mois</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Overview data={dashboardData?.salesChart} />
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="border-pharma-secondary/20 shadow-sm">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-pharma-secondary">Ventes Récentes</CardTitle>
                    <CardDescription>
                      {dashboardData?.recentSalesCount ? 
                        `Vous avez effectué ${dashboardData.recentSalesCount} ventes aujourd'hui.` : 
                        "Aucune vente aujourd'hui"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentSales data={dashboardData?.recentSales} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <AlertsDashboard data={dashboardData?.alerts} />
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <MedicationsList data={dashboardData?.inventory} />
          </TabsContent>

          <TabsContent value="clients" className="space-y-4">
            <ClientsList data={dashboardData?.clients} />
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <CalendarView data={dashboardData?.calendar} />
          </TabsContent>

          {user?.role === 'admin' && (
            <>
              <TabsContent value="analytics" className="space-y-4">
                <AnalyticsDashboard data={dashboardData?.analytics} />
              </TabsContent>
              <TabsContent value="settings" className="space-y-4">
                <SettingsDashboard data={dashboardData?.settings} />
              </TabsContent>
            </>
          )}

          {user?.role === 'pharmacist' && (
            <TabsContent value="prescriptions" className="space-y-4">
              <PrescriptionsDashboard data={dashboardData?.prescriptions} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}

