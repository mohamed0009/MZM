"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import api from "@/lib/api"
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
  ShoppingCart,
  HeartPulse,
  LogOut,
  Loader2,
  Search,
  Menu,
  X,
  ChevronDown,
  BarChart,
  Package,
  Activity,
  Layers
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Route {
  path: string
  name: string
  icon: string
  roles: string[]
  badge?: number
  group?: string
}

// Define the expected API response type
interface RoutesResponse {
  routes: Route[]
}

// Group definitions for the navigation
const navigationGroups = {
  dashboard: {
    label: "Tableau de bord",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  inventory: {
    label: "Inventaire",
    icon: <Package className="h-4 w-4" />,
    items: [
      { name: "Produits", path: "/products", icon: <Pill className="h-4 w-4" /> },
      { name: "Catégories", path: "/categories", icon: <Layers className="h-4 w-4" /> },
      { name: "Fournisseurs", path: "/suppliers", icon: <ShoppingCart className="h-4 w-4" /> },
    ]
  },
  sales: {
    label: "Ventes",
    icon: <BarChart className="h-4 w-4" />,
    items: [
      { name: "Transactions", path: "/sales", icon: <ShoppingCart className="h-4 w-4" /> },
      { name: "Ordonnances", path: "/prescriptions", icon: <FileText className="h-4 w-4" /> },
    ]
  },
  clients: {
    label: "Clients",
    icon: <Users className="h-4 w-4" />,
    path: "/clients"
  },
  alerts: {
    label: "Alertes",
    icon: <Bell className="h-4 w-4" />,
    path: "/alerts"
  }
}

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="h-4 w-4" />,
  Pill: <Pill className="h-4 w-4" />,
  Users: <Users className="h-4 w-4" />,
  Bell: <Bell className="h-4 w-4" />,
  Calendar: <Calendar className="h-4 w-4" />,
  FileText: <FileText className="h-4 w-4" />,
  ShoppingCart: <ShoppingCart className="h-4 w-4" />,
  ShieldCheck: <ShieldCheck className="h-4 w-4" />,
  Package: <Package className="h-4 w-4" />,
  BarChart: <BarChart className="h-4 w-4" />,
  Activity: <Activity className="h-4 w-4" />,
  Layers: <Layers className="h-4 w-4" />
}

// Helper function to group routes by category
function groupRoutesByCategory(routes: Route[]) {
  const groupedRoutes: Record<string, Route[]> = {};
  
  routes.forEach(route => {
    const group = route.group || 'other';
    if (!groupedRoutes[group]) {
      groupedRoutes[group] = [];
    }
    groupedRoutes[group].push(route);
  });
  
  return groupedRoutes;
}

// Function to check if a pathname matches a dropdown item
function isActiveRoute(pathname: string, routePath: string) {
  if (routePath === '/') {
    return pathname === routePath;
  }
  return pathname.startsWith(routePath);
}

function MainHeaderContent() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, loading: authLoading } = useAuth()
  const [notificationCount, setNotificationCount] = React.useState(5)
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const { data, isLoading: routesLoading } = useQuery<RoutesResponse>({
    queryKey: ["routes"],
    queryFn: async () => {
      const response = await api.get("/api/routes")
      return response.data as RoutesResponse
    },
    enabled: !!user // Only fetch routes when user is logged in
  })
  
  // Extract routes from the response
  const routes = data?.routes || []

  // Filter routes based on user role
  const authorizedRoutes = routes.filter((route: Route) => 
    route.roles.includes(user?.role || "")
  )

  // Group routes by category
  const groupedRoutes = groupRoutesByCategory(authorizedRoutes)

  const searchItems = [
    { id: "dashboard", name: "Tableau de bord", group: "Pages", icon: <LayoutDashboard className="h-4 w-4" />, path: "/" },
    { id: "products", name: "Produits", group: "Inventaire", icon: <Pill className="h-4 w-4" />, path: "/products" },
    { id: "clients", name: "Clients", group: "Utilisateurs", icon: <Users className="h-4 w-4" />, path: "/clients" },
    { id: "sales", name: "Ventes", group: "Transactions", icon: <ShoppingCart className="h-4 w-4" />, path: "/sales" },
    { id: "alerts", name: "Alertes", group: "Notifications", icon: <Bell className="h-4 w-4" />, path: "/alerts" },
    { id: "reports", name: "Rapports", group: "Analytics", icon: <FileText className="h-4 w-4" />, path: "/reports" },
  ]

  const filteredSearchItems = searchQuery === "" 
    ? searchItems 
    : searchItems.filter((item) => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )

  if (authLoading || routesLoading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4">
          <Skeleton className="h-8 w-32" />
          <div className="flex-1 flex justify-center">
            <div className="flex space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-8 w-24" />
              ))}
            </div>
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </header>
    )
  }

  if (!user) {
    return null // Don't show header if user is not logged in
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo & Brand */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl z-10">
            <div className="relative w-9 h-9 bg-gradient-to-br from-pharma-primary to-pharma-secondary rounded-lg flex items-center justify-center group overflow-hidden shadow-sm transition-all hover:shadow-md">
              <HeartPulse className="h-5 w-5 text-white transition-all group-hover:scale-110" />
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-white rounded-full shadow-inner"></div>
            </div>
            <span className="hidden sm:inline-block bg-clip-text text-transparent bg-gradient-to-r from-pharma-primary to-pharma-secondary">
              PharmaFlow
            </span>
          </Link>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden ml-4">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Menu className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <Badge variant="destructive" className="absolute -top-1.5 -right-1.5 h-5 w-5 p-0 flex items-center justify-center">
                      {notificationCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:max-w-sm">
                <SheetHeader className="mb-4">
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <Separator className="my-2" />
                <ScrollArea className="h-[calc(100vh-8rem)]">
                  <div className="flex flex-col gap-2 py-2">
                    {Object.keys(navigationGroups).map((groupKey) => {
                      const group = navigationGroups[groupKey as keyof typeof navigationGroups];
                      if ('items' in group) {
                        // This is a group with sub-items
                        return (
                          <div key={groupKey} className="space-y-1">
                            <div className="px-4 py-2 text-sm font-medium text-muted-foreground flex items-center gap-2">
                              {group.icon}
                              {group.label}
                            </div>
                            <div className="pl-4 ml-4 border-l space-y-1">
                              {group.items?.map((item) => (
                                <SheetClose asChild key={item.path}>
                                  <Link
                                    href={item.path}
                                    className={cn(
                                      "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-accent",
                                      isActiveRoute(pathname, item.path) && "bg-primary/10 text-primary"
                                    )}
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    {item.icon}
                                    {item.name}
                                  </Link>
                                </SheetClose>
                              ))}
                            </div>
                          </div>
                        )
                      } else if ('path' in group) {
                        // This is a direct link
                        return (
                          <SheetClose asChild key={groupKey}>
                            <Link
                              href={group.path}
                              className={cn(
                                "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-accent",
                                isActiveRoute(pathname, group.path) && "bg-primary/10 text-primary"
                              )}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {group.icon}
                              {group.label}
                            </Link>
                          </SheetClose>
                        )
                      } else {
                        // This is just a label (like Dashboard)
                        return (
                          <SheetClose asChild key={groupKey}>
                            <Link
                              href="/"
                              className={cn(
                                "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-accent",
                                pathname === "/" && "bg-primary/10 text-primary"
                              )}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {group.icon}
                              {group.label}
                            </Link>
                          </SheetClose>
                        )
                      }
                    })}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Desktop Navigation - Now with grouped items */}
        <NavigationMenu className="hidden md:flex max-w-max flex-1 ml-4">
          <NavigationMenuList className="gap-1">
            {/* Dashboard */}
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "px-3 gap-1.5",
                    pathname === "/" && "bg-primary/10 text-primary font-medium"
                  )}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Tableau de bord
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            {/* Inventory Dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger 
                className={cn(
                  "px-3 gap-1.5",
                  (pathname.startsWith("/products") || 
                   pathname.startsWith("/categories") || 
                   pathname.startsWith("/suppliers")) && 
                  "bg-primary/10 text-primary font-medium"
                )}
              >
                <Package className="h-4 w-4" />
                Inventaire
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-2 p-2">
                  {navigationGroups.inventory.items?.map((item) => (
                    <li key={item.path}>
                      <Link 
                        href={item.path}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent",
                          isActiveRoute(pathname, item.path) && "bg-primary/10 text-primary font-medium"
                        )}
                      >
                        {item.icon}
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Sales Dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger 
                className={cn(
                  "px-3 gap-1.5",
                  (pathname.startsWith("/sales") || 
                   pathname.startsWith("/prescriptions")) && 
                  "bg-primary/10 text-primary font-medium"
                )}
              >
                <BarChart className="h-4 w-4" />
                Ventes
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-2 p-2">
                  {navigationGroups.sales.items?.map((item) => (
                    <li key={item.path}>
                      <Link 
                        href={item.path}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent",
                          isActiveRoute(pathname, item.path) && "bg-primary/10 text-primary font-medium"
                        )}
                      >
                        {item.icon}
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Clients */}
            <NavigationMenuItem>
              <Link href="/clients" legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "px-3 gap-1.5",
                    pathname.startsWith("/clients") && "bg-primary/10 text-primary font-medium"
                  )}
                >
                  <Users className="h-4 w-4" />
                  Clients
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            {/* Alerts with badge */}
            <NavigationMenuItem>
              <Link href="/alerts" legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "px-3 gap-1.5",
                    pathname.startsWith("/alerts") && "bg-primary/10 text-primary font-medium"
                  )}
                >
                  <div className="relative">
                    <Bell className="h-4 w-4" />
                    {notificationCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1.5 -right-1.5 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                      >
                        {notificationCount}
                      </Badge>
                    )}
                  </div>
                  Alertes
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right side with search and user menu */}
        <div className="flex items-center gap-2">
          {/* Global Search */}
          <Popover open={searchOpen} onOpenChange={setSearchOpen}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="hidden sm:flex items-center gap-2 w-[200px] lg:w-[240px] justify-between text-muted-foreground"
                    >
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        <span className="text-sm">Rechercher...</span>
                      </div>
                      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        <span className="text-xs">⌘</span>K
                      </kbd>
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Recherche (⌘+K)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <PopoverContent className="w-[300px] p-0" align="end">
              <Command>
                <CommandInput 
                  placeholder="Rechercher..." 
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
                <CommandList>
                  <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
                  {Object.entries(
                    filteredSearchItems.reduce((groups, item) => {
                      const group = groups[item.group] || [];
                      group.push(item);
                      groups[item.group] = group;
                      return groups;
                    }, {} as Record<string, typeof filteredSearchItems>)
                  ).map(([group, items]) => (
                    <CommandGroup key={group} heading={group}>
                      {items.map((item) => (
                        <CommandItem
                          key={item.id}
                          onSelect={() => {
                            router.push(item.path)
                            setSearchOpen(false)
                          }}
                          className="flex items-center gap-2"
                        >
                          {item.icon}
                          {item.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Mobile Search Button */}
          <Button 
            variant="outline" 
            size="icon" 
            className="sm:hidden"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Alerts button for medium screens */}
          <Button 
            variant="outline" 
            size="icon" 
            className="hidden sm:flex md:hidden relative"
            asChild
          >
            <Link href="/alerts">
              <Bell className="h-4 w-4" />
              {notificationCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1.5 -right-1.5 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                >
                  {notificationCount}
                </Badge>
              )}
            </Link>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8 border">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center">
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Paramètres</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => logout()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

// Handle keyboard shortcut for search
function SearchShortcut() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(open => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return null
}

// Export a wrapper component that provides QueryClient
export function MainHeader() {
  const [queryClient] = React.useState(() => new QueryClient())
  
  return (
    <QueryClientProvider client={queryClient}>
      <MainHeaderContent />
      <SearchShortcut />
    </QueryClientProvider>
  )
} 