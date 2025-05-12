"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
  X 
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
} from "@/components/ui/dropdown-menu"

export function GlobalHeader() {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()

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

  // Close mobile menu on navigation
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm relative overflow-hidden">
      <div className="absolute inset-0 bg-pharma-pattern opacity-5"></div>
      <div className="container flex h-16 items-center justify-between px-4 md:px-6 relative z-10">
        {/* Logo & Brand */}
        <div className="flex items-center gap-4">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <div className="flex h-16 items-center border-b px-6 bg-gradient-to-r from-pharma-light to-white relative overflow-hidden">
                <div className="absolute inset-0 bg-pharma-pattern opacity-10"></div>
                <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl relative">
                  <div className="relative w-8 h-8">
                    <Image 
                      src="/placeholder-logo.svg" 
                      alt="PharmaFlow" 
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-pharma-primary font-bold">PharmaFlow</span>
                </Link>
                <Button variant="ghost" size="icon" className="absolute right-4" onClick={() => setIsMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex flex-col p-6 gap-6">
                <Link 
                  href="/dashboard" 
                  className={cn(
                    "flex items-center gap-3 text-sm font-medium rounded-md px-3 py-2 transition-colors",
                    isActive("/dashboard") 
                      ? "bg-primary/10 text-primary font-semibold" 
                      : "hover:bg-accent"
                  )}
                >
                  <Home className="h-4 w-4" />
                  Tableau de bord
                </Link>
                
                <div className="space-y-1">
                  <h4 className="text-xs uppercase text-muted-foreground font-semibold tracking-wider px-3 mb-2">
                    Inventaire & Stock
                  </h4>
                  <Link 
                    href="/inventory" 
                    className={cn(
                      "flex items-center gap-3 text-sm font-medium rounded-md px-3 py-2 transition-colors",
                      isActive("/inventory") 
                        ? "bg-primary/10 text-primary font-semibold" 
                        : "hover:bg-accent"
                    )}
                  >
                    <Package className="h-4 w-4" />
                    Inventaire
                  </Link>
                  <Link 
                    href="/orders" 
                    className={cn(
                      "flex items-center gap-3 text-sm font-medium rounded-md px-3 py-2 transition-colors",
                      isActive("/orders") 
                        ? "bg-primary/10 text-primary font-semibold" 
                        : "hover:bg-accent"
                    )}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Commandes
                  </Link>
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-xs uppercase text-muted-foreground font-semibold tracking-wider px-3 mb-2">
                    Ventes & Clients
                  </h4>
                  <Link 
                    href="/sales" 
                    className={cn(
                      "flex items-center gap-3 text-sm font-medium rounded-md px-3 py-2 transition-colors",
                      isActive("/sales") 
                        ? "bg-primary/10 text-primary font-semibold" 
                        : "hover:bg-accent"
                    )}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Ventes
                  </Link>
                  <Link 
                    href="/clients" 
                    className={cn(
                      "flex items-center gap-3 text-sm font-medium rounded-md px-3 py-2 transition-colors",
                      isActive("/clients") 
                        ? "bg-primary/10 text-primary font-semibold" 
                        : "hover:bg-accent"
                    )}
                  >
                    <Users className="h-4 w-4" />
                    Clients
                  </Link>
                </div>

                <div className="mt-auto pt-6 border-t">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={user?.avatar || "/avatars/male-avatar.png"} 
                        alt={user?.name || "User"}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/avatars/male-avatar.png";
                        }}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(user?.name || "User")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user?.name}</span>
                      <span className="text-xs text-muted-foreground">{user?.role}</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={logout}
                  >
                    Déconnexion
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          <Link 
            href="/dashboard" 
            className="hidden md:flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <div className="flex items-center">
              <div className="relative w-10 h-10 mr-2 bg-white rounded-full p-1 shadow-sm">
                <Image 
                  src="/placeholder-logo.svg" 
                  alt="PharmaFlow" 
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-pharma-primary to-pharma-primary/80 bg-clip-text text-transparent">
                PharmaFlow
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 ml-6">
            <Link 
              href="/dashboard" 
              className={cn(
                "px-3 py-2 text-sm font-medium transition-colors relative",
                isActive("/dashboard") 
                  ? "text-primary font-semibold" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Tableau de bord
              {isActive("/dashboard") && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className={cn(
                    "px-3 py-2 text-sm font-medium h-auto",
                    (isActive("/inventory") || isActive("/orders")) 
                      ? "text-primary font-semibold" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Inventaire & Stock
                  <ChevronDown className="ml-1 h-4 w-4" />
                  {(isActive("/inventory") || isActive("/orders")) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/inventory" className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Inventaire
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders" className="flex items-center gap-2">
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
                    "px-3 py-2 text-sm font-medium h-auto",
                    (isActive("/sales") || isActive("/clients")) 
                      ? "text-primary font-semibold" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Ventes & Clients
                  <ChevronDown className="ml-1 h-4 w-4" />
                  {(isActive("/sales") || isActive("/clients")) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/sales" className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Ventes
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/clients" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Clients
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        {/* Search and User Controls */}
        <div className="flex items-center gap-2">
          {/* Expanded Search on Desktop */}
          <div className="hidden md:flex relative">
            <div className="relative w-[280px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher médicaments, clients..."
                className="pl-9 pr-4 w-full bg-accent/50 border-none focus-visible:ring-primary/20"
              />
            </div>
          </div>
          
          {/* Mobile Search Trigger */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>
          
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <Badge 
              variant="destructive" 
              className="absolute -right-1 -top-1 h-5 w-5 p-0 flex items-center justify-center border-2 border-background"
            >
              3
            </Badge>
          </Button>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                <Avatar className="h-8 w-8 border border-muted">
                  <AvatarImage 
                    src={user?.avatar || "/avatars/male-avatar.png"} 
                    alt={user?.name || "User"}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/avatars/male-avatar.png";
                    }}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {getInitials(user?.name || "User")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center gap-2 p-2 border-b">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(user?.name || "User")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user?.name}</span>
                  <span className="text-xs text-muted-foreground">{user?.role}</span>
                </div>
              </div>
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  Profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  Paramètres
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="cursor-pointer">
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Mobile Search Expand */}
      {isSearchOpen && (
        <div className="border-t p-2 md:hidden bg-background">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher médicaments, clients..."
              className="pl-9 pr-4 w-full bg-accent/50 border-none focus-visible:ring-primary/20"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  )
} 