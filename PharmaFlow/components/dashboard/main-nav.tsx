"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"
import { 
  LayoutDashboard, 
  Pill, 
  Users, 
  Bell, 
  Calendar, 
  Settings, 
  UserCircle, 
  ShieldCheck, 
  FileText,
  ShoppingCart
} from "lucide-react"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  const { user } = useAuth()

  const userRole = user?.role?.toUpperCase() || "";
  
  // Définir les routes sans vérification de permissions spécifiques
  const routes = [
    {
      href: "/dashboard",
      label: "Tableau de bord",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
      active: pathname === "/dashboard",
      roles: ["ADMIN", "PHARMACIST", "TECHNICIAN"]
    },
    {
      href: "/inventory",
      label: "Inventaire",
      icon: <Pill className="mr-2 h-4 w-4" />,
      active: pathname === "/inventory" || pathname.startsWith("/inventory/"),
      roles: ["ADMIN", "PHARMACIST", "TECHNICIAN"]
    },
    {
      href: "/clients",
      label: "Clients",
      icon: <Users className="mr-2 h-4 w-4" />,
      active: pathname === "/clients" || pathname.startsWith("/clients/"),
      roles: ["ADMIN", "PHARMACIST", "TECHNICIAN"]
    },
    {
      href: "/sales",
      label: "Ventes",
      icon: <ShoppingCart className="mr-2 h-4 w-4" />,
      active: pathname === "/sales" || pathname.startsWith("/sales/"),
      roles: ["ADMIN", "PHARMACIST"]
    },
    {
      href: "/alerts",
      label: "Alertes",
      icon: <Bell className="mr-2 h-4 w-4" />,
      active: pathname === "/alerts",
      roles: ["ADMIN", "PHARMACIST"]
    },
    {
      href: "/calendar",
      label: "Calendrier",
      icon: <Calendar className="mr-2 h-4 w-4" />,
      active: pathname === "/calendar",
      roles: ["ADMIN", "PHARMACIST", "TECHNICIAN"]
    },
    {
      href: "/reports",
      label: "Rapports",
      icon: <FileText className="mr-2 h-4 w-4" />,
      active: pathname === "/reports" || pathname.startsWith("/reports/"),
      roles: ["ADMIN", "PHARMACIST"]
    },
    {
      href: "/profile",
      label: "Profil",
      icon: <UserCircle className="mr-2 h-4 w-4" />,
      active: pathname === "/profile",
      roles: ["ADMIN", "PHARMACIST", "TECHNICIAN"]
    },
    {
      href: "/settings",
      label: "Paramètres",
      icon: <Settings className="mr-2 h-4 w-4" />,
      active: pathname === "/settings",
      roles: ["ADMIN"]
    },
    {
      href: "/admin",
      label: "Administration",
      icon: <ShieldCheck className="mr-2 h-4 w-4" />,
      active: pathname.startsWith("/admin"),
      roles: ["ADMIN"]
    },
  ]

  // Filtrer les routes en fonction du rôle de l'utilisateur
  const authorizedRoutes = routes.filter((route) => 
    route.roles.includes(userRole)
  );

  return (
    <nav className={cn("flex items-center space-x-2 lg:space-x-4", className)} {...props}>
      {authorizedRoutes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "flex items-center px-2 py-1.5 text-sm font-medium transition-colors hover:text-primary rounded-md hover:bg-muted",
            route.active 
              ? "text-primary bg-muted" 
              : "text-muted-foreground",
          )}
        >
          {route.icon}
          {route.label}
        </Link>
      ))}
    </nav>
  )
}
