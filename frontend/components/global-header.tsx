"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { 
  Bell, 
  ChevronDown, 
  Menu, 
  Search, 
  ShoppingCart, 
  Package, 
  Users, 
  Home, 
  X,
  Settings,
  LogOut,
  User,
  BarChart4,
  Database,
  Heart
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion";
import { SearchBox } from "@/components/shared/search-box";

// Animated logo component with heartbeat effect
const AnimatedLogo = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12"
  };
  
  return (
    <div className={cn("relative rounded-full bg-blue-600 flex items-center justify-center", sizeClasses[size])}>
      <div className="absolute inset-0 bg-blue-500 rounded-full animate-pulse opacity-60"></div>
      <div className="relative">
        <Heart 
          className="text-white" 
          fill="white" 
          size={size === "sm" ? 18 : size === "md" ? 24 : 30} 
        />
        <svg 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
          width={size === "sm" ? 12 : size === "md" ? 16 : 20} 
          height={size === "sm" ? 8 : size === "md" ? 10 : 12} 
          viewBox="0 0 16 8" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M0 4H3L4 1L6 7L8 4L9 5L11 2L13 4H16" 
            stroke="blue" 
            strokeWidth="1.5"
            className="heartbeat-line"
          />
        </svg>
      </div>
    </div>
  );
};

export function GlobalHeader() {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  const isActive = (path: string): boolean => {
    return pathname === path
  }

  const isActiveSectionInventory = (): boolean => {
    return pathname.startsWith("/inventory") || pathname.startsWith("/orders")
  }

  const isActiveSectionSales = (): boolean => {
    return pathname.startsWith("/sales") || pathname.startsWith("/clients")
  }

  // Close mobile menu on navigation
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-100 bg-gradient-to-r from-white to-blue-50/30 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm relative overflow-visible">
      <style jsx global>{`
        .heartbeat-line {
          stroke-dasharray: 24;
          animation: heartbeat-pulse 1.5s infinite linear;
        }
        
        @keyframes heartbeat-pulse {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -48; }
        }
      `}</style>
      <div className="absolute inset-0 bg-pharma-pattern opacity-[0.03]"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-blue-50/5 to-white/20 opacity-50"></div>
      <div className="container flex h-16 items-center justify-between px-4 md:px-6 relative z-10" style={{ overflow: 'visible' }}>
        {/* Logo & Brand */}
        <div className="flex items-center gap-4">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden relative overflow-hidden transition-all hover:text-blue-600 group" 
                aria-label="Open menu"
              >
                <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 bg-blue-50 transition-opacity duration-300"></span>
                <Menu className="h-5 w-5 relative z-10" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0 border-r border-blue-100">
              <div className="flex h-20 items-center border-b border-blue-100 bg-gradient-to-r from-blue-50 to-white relative overflow-hidden">
                <div className="absolute inset-0 bg-pharma-pattern opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent"></div>
                <Link href="/dashboard" className="flex items-center gap-3 font-bold text-xl relative ml-6">
                  <AnimatedLogo size="lg" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 font-bold">PharmaFlow</span>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-4 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex flex-col p-6 gap-6">
                <Link 
                  href="/dashboard" 
                  className={cn(
                    "flex items-center gap-3 text-sm font-medium rounded-md px-3 py-2.5 transition-all",
                    isActive("/dashboard") 
                      ? "bg-gradient-to-r from-blue-50 to-blue-100/80 text-blue-700 font-semibold shadow-sm" 
                      : "hover:bg-blue-50 hover:translate-x-1 hover:text-blue-700"
                  )}
                >
                  <BarChart4 className="h-4 w-4" />
                  Tableau de bord
                </Link>
                
                <div className="space-y-1.5">
                  <h4 className="text-xs uppercase text-slate-400 font-semibold tracking-wider px-3 mb-2">
                    Inventaire & Stock
                  </h4>
                  <Link 
                    href="/inventory" 
                    className={cn(
                      "flex items-center gap-3 text-sm font-medium rounded-md px-3 py-2.5 transition-all",
                      isActive("/inventory") 
                        ? "bg-gradient-to-r from-blue-50 to-blue-100/80 text-blue-700 font-semibold shadow-sm" 
                        : "hover:bg-blue-50 hover:translate-x-1 hover:text-blue-700"
                    )}
                  >
                    <Package className="h-4 w-4" />
                    Inventaire
                  </Link>
                  <Link 
                    href="/orders" 
                    className={cn(
                      "flex items-center gap-3 text-sm font-medium rounded-md px-3 py-2.5 transition-all",
                      isActive("/orders") 
                        ? "bg-gradient-to-r from-blue-50 to-blue-100/80 text-blue-700 font-semibold shadow-sm" 
                        : "hover:bg-blue-50 hover:translate-x-1 hover:text-blue-700"
                    )}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Commandes
                  </Link>
                </div>
                
                <div className="space-y-1.5">
                  <h4 className="text-xs uppercase text-slate-400 font-semibold tracking-wider px-3 mb-2">
                    Ventes & Clients
                  </h4>
                  <Link 
                    href="/sales" 
                    className={cn(
                      "flex items-center gap-3 text-sm font-medium rounded-md px-3 py-2.5 transition-all",
                      isActive("/sales") 
                        ? "bg-gradient-to-r from-blue-50 to-blue-100/80 text-blue-700 font-semibold shadow-sm" 
                        : "hover:bg-blue-50 hover:translate-x-1 hover:text-blue-700"
                    )}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Ventes
                  </Link>
                  <Link 
                    href="/clients" 
                    className={cn(
                      "flex items-center gap-3 text-sm font-medium rounded-md px-3 py-2.5 transition-all",
                      isActive("/clients") 
                        ? "bg-gradient-to-r from-blue-50 to-blue-100/80 text-blue-700 font-semibold shadow-sm" 
                        : "hover:bg-blue-50 hover:translate-x-1 hover:text-blue-700"
                    )}
                  >
                    <Users className="h-4 w-4" />
                    Clients
                  </Link>
                </div>

                <div className="mt-auto pt-6 border-t border-blue-100">
                  <div className="flex items-center gap-3 mb-6 p-3 rounded-lg bg-gradient-to-br from-blue-50 to-white border border-blue-100/80 shadow-sm">
                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                      <AvatarImage 
                        src={user?.avatar || "/avatars/male-avatar.png"} 
                        alt={user?.name || "User"}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/avatars/male-avatar.png";
                        }}
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {getInitials(user?.name || "User")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-800">{user?.name}</span>
                      <span className="text-xs text-slate-500">{user?.role}</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2 border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-colors" 
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          <Link 
            href="/dashboard" 
            className="hidden md:flex items-center gap-3 transition-all group"
          >
            <AnimatedLogo />
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
              PharmaFlow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link 
              href="/dashboard" 
              className={cn(
                "px-3 py-2 text-sm font-medium transition-all rounded-md relative group overflow-hidden",
                isActive("/dashboard") 
                  ? "text-blue-700 font-semibold" 
                  : "text-slate-600 hover:text-blue-600"
              )}
            >
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-blue-50 rounded-md -z-10 transition-opacity duration-300"></span>
              <span className="relative z-10 flex items-center gap-1.5">
                <BarChart4 className="h-4 w-4" />
                Tableau de bord
              </span>
              {isActive("/dashboard") && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-teal-400" />
              )}
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className={cn(
                    "px-3 py-2 text-sm font-medium h-auto rounded-md relative group overflow-hidden",
                    isActiveSectionInventory()
                      ? "text-blue-700 font-semibold" 
                      : "text-slate-600 hover:text-blue-600"
                  )}
                >
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-blue-50 rounded-md -z-10 transition-opacity duration-300"></span>
                  <span className="relative z-10 flex items-center">
                    <Package className="h-4 w-4 mr-1.5" />
                    Inventaire & Stock
                    <ChevronDown className={cn(
                      "ml-1 h-4 w-4 transition-transform duration-300",
                      isActiveSectionInventory() ? "rotate-180" : ""
                    )} />
                  </span>
                  {isActiveSectionInventory() && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-teal-400" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start" 
                className="w-56 p-1 border border-blue-100 shadow-lg rounded-lg bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-white/95" 
                sideOffset={15}
              >
                <DropdownMenuItem asChild>
                  <Link href="/inventory" className="flex items-center gap-2 py-2 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors">
                    <Package className="h-4 w-4" />
                    Inventaire
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders" className="flex items-center gap-2 py-2 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors">
                    <ShoppingCart className="h-4 w-4" />
                    Commandes
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className={cn(
                    "px-3 py-2 text-sm font-medium h-auto rounded-md relative group overflow-hidden",
                    isActiveSectionSales()
                      ? "text-blue-700 font-semibold" 
                      : "text-slate-600 hover:text-blue-600"
                  )}
                >
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-blue-50 rounded-md -z-10 transition-opacity duration-300"></span>
                  <span className="relative z-10 flex items-center">
                    <Users className="h-4 w-4 mr-1.5" />
                    Ventes & Clients
                    <ChevronDown className={cn(
                      "ml-1 h-4 w-4 transition-transform duration-300",
                      isActiveSectionSales() ? "rotate-180" : ""
                    )} />
                  </span>
                  {isActiveSectionSales() && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-teal-400" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start" 
                className="w-56 p-1 border border-blue-100 shadow-lg rounded-lg bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-white/95" 
                sideOffset={15}
              >
                <DropdownMenuItem asChild>
                  <Link href="/sales" className="flex items-center gap-2 py-2 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors">
                    <ShoppingCart className="h-4 w-4" />
                    Ventes
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/clients" className="flex items-center gap-2 py-2 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors">
                    <Users className="h-4 w-4" />
                    Clients
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        {/* Search and User Controls */}
        <div className="flex items-center gap-3" style={{ overflow: 'visible' }}>
          {/* Use the SearchBox component for desktop */}
          <div className={cn(
            "hidden md:flex relative transition-all duration-300",
            isSearchFocused ? "w-[350px]" : "w-[280px]"
          )} style={{ overflow: 'visible', zIndex: 50 }}>
            <SearchBox 
              placeholder="Rechercher médicaments, clients..." 
              size="md"
              maxWidth="w-full"
              showTabs={true}
              positionMode="fixed"
              onResultClick={(result) => {
                // Navigate to result page
                router.push(result.link);
              }}
            />
          </div>
          
          {/* Mobile Search Trigger */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden relative overflow-hidden group" 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Search"
          >
            <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 bg-blue-50 transition-opacity duration-300"></span>
            <Search className="h-5 w-5 relative z-10 group-hover:text-blue-600" />
          </Button>
          
          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative overflow-hidden group" 
            aria-label="Notifications"
          >
            <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 bg-blue-50 transition-opacity duration-300"></span>
            <Bell className="h-5 w-5 relative z-10 group-hover:text-blue-600" />
            <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5">
              <Badge 
                variant="destructive" 
                className="h-5 w-5 p-0 flex items-center justify-center rounded-full border-2 border-white shadow-md bg-gradient-to-r from-rose-500 to-red-500"
              >
                <span className="text-[10px] font-semibold">3</span>
              </Badge>
              <span className="animate-ping absolute h-full w-full rounded-full bg-red-400 opacity-30"></span>
            </span>
          </Button>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-9 w-9 rounded-full p-0 overflow-hidden border-2 border-transparent hover:border-blue-200 transition-all hover:shadow-md"
              >
                <Avatar className="h-full w-full">
                  <AvatarImage 
                    src={user?.avatar || "/avatars/male-avatar.png"} 
                    alt={user?.name || "User"}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/avatars/male-avatar.png";
                    }}
                  />
                  <AvatarFallback className="bg-gradient-to-r from-blue-100 to-teal-100 text-blue-600 font-medium">
                    {getInitials(user?.name || "User")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-72 p-2 border border-blue-100 shadow-lg rounded-lg" 
              sideOffset={15}
            >
              <div className="flex items-center gap-3 p-3 mb-2 bg-gradient-to-br from-blue-50 to-white border border-blue-100/80 rounded-lg shadow-sm">
                <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-100 to-teal-100 text-blue-600">
                    {getInitials(user?.name || "User")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-800">{user?.name}</span>
                  <span className="text-xs text-slate-500">{user?.role}</span>
                </div>
              </div>
              
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer flex items-center gap-2 py-2.5 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors">
                    <User className="h-4 w-4" />
                    Mon profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer flex items-center gap-2 py-2.5 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors">
                    <Settings className="h-4 w-4" />
                    Paramètres
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator className="my-1.5 bg-blue-100/50" />
              
              <DropdownMenuItem 
                onClick={logout} 
                className="cursor-pointer flex items-center gap-2 py-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md font-medium"
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Mobile Search Expand */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-blue-100 overflow-hidden md:hidden bg-white"
          >
            <div className="p-3">
              <SearchBox 
                placeholder="Rechercher médicaments, clients..." 
                size="md"
                maxWidth="w-full"
                showTabs={true}
                onResultClick={(result) => {
                  // Navigate to result page
                  router.push(result.link);
                  setIsSearchOpen(false);
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
} 