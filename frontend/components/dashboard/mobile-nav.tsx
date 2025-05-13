"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/contexts/AuthContext"
import { LayoutDashboard, Pill, Users, Bell, Calendar, Settings, UserCircle, ShieldCheck, FileText } from "lucide-react"

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)
  const { hasPermission } = useAuth()

  // Définir les routes avec leurs permissions requises
  const routes = [
    {
      href: "/dashboard",
      label: "Tableau de bord",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
      active: pathname === "/dashboard",
      permission: "view_dashboard" as const,
    },
    {
      href: "/inventory",
      label: "Inventaire",
      icon: <Pill className="mr-2 h-4 w-4" />,
      active: pathname === "/inventory",
      permission: "manage_inventory" as const,
    },
    {
      href: "/clients",
      label: "Clients",
      icon: <Users className="mr-2 h-4 w-4" />,
      active: pathname === "/clients",
      permission: "manage_clients" as const,
    },
    {
      href: "/alerts",
      label: "Alertes",
      icon: <Bell className="mr-2 h-4 w-4" />,
      active: pathname === "/alerts",
      permission: "view_dashboard" as const,
    },
    {
      href: "/calendar",
      label: "Calendrier",
      icon: <Calendar className="mr-2 h-4 w-4" />,
      active: pathname === "/calendar",
      permission: "view_dashboard" as const,
    },
    {
      href: "/reports",
      label: "Rapports",
      icon: <FileText className="mr-2 h-4 w-4" />,
      active: pathname === "/reports",
      permission: "view_reports" as const,
    },
    {
      href: "/profile",
      label: "Profil",
      icon: <UserCircle className="mr-2 h-4 w-4" />,
      active: pathname === "/profile",
      permission: "view_dashboard" as const,
    },
    {
      href: "/settings",
      label: "Paramètres",
      icon: <Settings className="mr-2 h-4 w-4" />,
      active: pathname === "/settings",
      permission: "view_dashboard" as const,
    },
    {
      href: "/admin/users",
      label: "Administration",
      icon: <ShieldCheck className="mr-2 h-4 w-4" />,
      active: pathname.includes("/admin"),
      permission: "manage_users" as const,
    },
  ]

  // Filtrer les routes en fonction des permissions de l'utilisateur
  const authorizedRoutes = routes.filter((route) => hasPermission(route.permission))

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="px-7">
          <Link href="/" className="flex items-center">
            <span className="font-bold">PharmaSys</span>
          </Link>
        </div>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-3">
            {authorizedRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-primary",
                  route.active ? "text-primary" : "text-muted-foreground",
                )}
              >
                {route.icon}
                {route.label}
              </Link>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
