"use client"

import type React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Activity, Bell, Box, Calendar, HeartPulse, Home, LogOut, Settings, Shield, User, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, isAdmin } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await logout()
      // Redirection forcée vers la page de connexion
      window.location.href = "/auth/login"
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const routes = [
    {
      name: "Accueil",
      path: "/",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "Tableau de bord",
      path: "/dashboard",
      icon: <Activity className="h-5 w-5" />,
    },
    {
      name: "Inventaire",
      path: "/inventory",
      icon: <Box className="h-5 w-5" />,
    },
    {
      name: "Clients",
      path: "/clients",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Calendrier",
      path: "/calendar",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      name: "Alertes",
      path: "/alerts",
      icon: <Bell className="h-5 w-5" />,
      badge: 8,
    },
  ]

  // Routes d'administration (uniquement pour les administrateurs)
  const adminRoutes = [
    {
      name: "Administration",
      path: "/admin/users",
      icon: <Shield className="h-5 w-5" />,
    },
  ]

  // Combiner les routes en fonction du rôle
  const allRoutes = isAdmin() ? [...routes, ...adminRoutes] : routes

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl pharma-text-gradient">
            <div className="relative">
              <HeartPulse className="h-8 w-8 text-pharma-primary animate-pulse-slow" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-pharma-secondary rounded-full animate-pulse"></div>
            </div>
            <span>MZM</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 mx-6">
            {allRoutes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === route.path
                    ? "bg-pharma-light text-pharma-primary"
                    : "text-gray-600 hover:bg-gray-100 hover:text-pharma-primary",
                )}
              >
                <span className={pathname === route.path ? "text-pharma-primary" : "text-gray-500"}>{route.icon}</span>
                {route.name}
                {route.badge && (
                  <Badge
                    variant="destructive"
                    className="ml-1 h-5 w-5 p-0 flex items-center justify-center animate-pulse"
                  >
                    {route.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </nav>

          {/* Navigation mobile */}
          <div className="md:hidden flex-1 flex justify-end">
            <div className="flex overflow-auto py-2 px-4 space-x-2">
              {allRoutes.map((route) => (
                <Link
                  key={route.path}
                  href={route.path}
                  className={cn(
                    "flex flex-col items-center justify-center w-12 h-12 rounded-full",
                    pathname === route.path ? "bg-pharma-light text-pharma-primary" : "text-gray-600",
                  )}
                >
                  <span className="relative">
                    {route.icon}
                    {route.badge && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                      >
                        {route.badge}
                      </Badge>
                    )}
                  </span>
                  <span className="text-[10px] mt-1">{route.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8 ring-2 ring-pharma-light">
                    <AvatarImage src="/placeholder-user.jpg" alt={user?.name || "Utilisateur"} />
                    <AvatarFallback className="bg-pharma-primary text-white">
                      {user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "MZ"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name || "Utilisateur"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email || "utilisateur@mzm.ma"}</p>
                    {user?.role && (
                      <Badge variant="outline" className="mt-1 w-fit">
                        {user.role === "admin"
                          ? "Administrateur"
                          : user.role === "manager"
                            ? "Gestionnaire"
                            : user.role === "pharmacist"
                              ? "Pharmacien"
                              : "Assistant"}
                      </Badge>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Paramètres</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{isLoggingOut ? "Déconnexion..." : "Déconnexion"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="flex-1 bg-gray-50">{children}</main>
    </div>
  )
}
