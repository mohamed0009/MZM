"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Clock, Package, ShoppingCart, Users } from "lucide-react"

export function AlertsDashboard() {
  return (
    <Card className="border-0 shadow-md overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-pharma-primary/10 to-pharma-primary/5 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-pharma-primary" />
            <CardTitle>Centre de Notifications</CardTitle>
          </div>
          <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50">
            Tout marquer comme lu
          </Button>
        </div>
        <CardDescription>Toutes vos alertes et notifications importantes en un seul endroit</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-gray-100 p-1">
            <TabsTrigger
              value="all"
              className="relative data-[state=active]:bg-white data-[state=active]:text-pharma-primary"
            >
              Toutes
              <Badge variant="destructive" className="ml-2">
                12
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="stock"
              className="relative data-[state=active]:bg-white data-[state=active]:text-pharma-primary"
            >
              Stock
              <Badge variant="destructive" className="ml-2">
                5
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="expiry"
              className="relative data-[state=active]:bg-white data-[state=active]:text-pharma-primary"
            >
              Expiration
              <Badge variant="destructive" className="ml-2">
                4
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="relative data-[state=active]:bg-white data-[state=active]:text-pharma-primary"
            >
              Commandes
              <Badge className="ml-2 bg-pharma-secondary text-white">2</Badge>
            </TabsTrigger>
            <TabsTrigger
              value="clients"
              className="relative data-[state=active]:bg-white data-[state=active]:text-pharma-primary"
            >
              Clients
              <Badge className="ml-2 bg-pharma-secondary text-white">1</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {allAlerts.map((alert, index) => (
                <AlertCard key={index} alert={alert} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stock" className="space-y-4 mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {allAlerts
                .filter((alert) => alert.category === "stock")
                .map((alert, index) => (
                  <AlertCard key={index} alert={alert} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="expiry" className="space-y-4 mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {allAlerts
                .filter((alert) => alert.category === "expiry")
                .map((alert, index) => (
                  <AlertCard key={index} alert={alert} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4 mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {allAlerts
                .filter((alert) => alert.category === "order")
                .map((alert, index) => (
                  <AlertCard key={index} alert={alert} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="clients" className="space-y-4 mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {allAlerts
                .filter((alert) => alert.category === "client")
                .map((alert, index) => (
                  <AlertCard key={index} alert={alert} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

interface Alert {
  id: number
  title: string
  description: string
  time: string
  category: "stock" | "expiry" | "order" | "client" | "system"
  priority: "high" | "medium" | "low"
  read: boolean
}

function AlertCard({ alert }: { alert: Alert }) {
  const getIcon = () => {
    switch (alert.category) {
      case "stock":
        return <Package className={`h-5 w-5 ${getPriorityColor(alert.priority)}`} />
      case "expiry":
        return <Clock className={`h-5 w-5 ${getPriorityColor(alert.priority)}`} />
      case "order":
        return <ShoppingCart className={`h-5 w-5 ${getPriorityColor(alert.priority)}`} />
      case "client":
        return <Users className={`h-5 w-5 ${getPriorityColor(alert.priority)}`} />
      default:
        return <Bell className={`h-5 w-5 ${getPriorityColor(alert.priority)}`} />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-pharma-danger"
      case "medium":
        return "text-pharma-warning"
      case "low":
        return "text-pharma-info"
      default:
        return "text-gray-500"
    }
  }

  const getBorderColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-pharma-danger"
      case "medium":
        return "border-l-pharma-warning"
      case "low":
        return "border-l-pharma-info"
      default:
        return "border-l-gray-500"
    }
  }

  const getBackgroundColor = (priority: string, read: boolean) => {
    if (read) return "bg-white"

    switch (priority) {
      case "high":
        return "bg-pharma-danger/5"
      case "medium":
        return "bg-pharma-warning/5"
      case "low":
        return "bg-pharma-info/5"
      default:
        return "bg-gray-50"
    }
  }

  return (
    <div
      className={`flex items-start space-x-4 rounded-md border p-4 shadow-sm transition-all duration-200 hover:shadow-md ${!alert.read ? getBackgroundColor(alert.priority, alert.read) : ""} border-l-4 ${getBorderColor(alert.priority)}`}
    >
      <div className="mt-0.5">{getIcon()}</div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium leading-none">{alert.title}</p>
          <Badge
            variant={alert.priority === "high" ? "destructive" : "outline"}
            className={
              alert.priority === "medium"
                ? "bg-pharma-warning/20 text-pharma-warning border-pharma-warning/30"
                : alert.priority === "low"
                  ? "bg-pharma-info/20 text-pharma-info border-pharma-info/30"
                  : ""
            }
          >
            {alert.priority === "high" ? "Urgent" : alert.priority === "medium" ? "Important" : "Info"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{alert.description}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">{alert.time}</span>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" className="h-7 px-3 text-xs hover:bg-gray-100">
              Détails
            </Button>
            <Button variant="ghost" size="sm" className="h-7 px-3 text-xs hover:bg-gray-100">
              Marquer comme lu
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Données fictives pour toutes les alertes
const allAlerts: Alert[] = [
  {
    id: 1,
    title: "Stock critique - Paracétamol 500mg",
    description: "Le stock est descendu à 5 unités (seuil: 20)",
    time: "Il y a 30 minutes",
    category: "stock",
    priority: "high",
    read: false,
  },
  {
    id: 2,
    title: "Stock critique - Amoxicilline 1g",
    description: "Le stock est descendu à 8 unités (seuil: 15)",
    time: "Il y a 1 heure",
    category: "stock",
    priority: "high",
    read: false,
  },
  {
    id: 3,
    title: "Stock faible - Ibuprofène 400mg",
    description: "Le stock est descendu à 12 unités (seuil: 25)",
    time: "Il y a 2 heures",
    category: "stock",
    priority: "medium",
    read: false,
  },
  {
    id: 4,
    title: "Expiration proche - Insuline Lantus",
    description: "Expire dans 7 jours (15/05/2024)",
    time: "Il y a 45 minutes",
    category: "expiry",
    priority: "high",
    read: false,
  },
  {
    id: 5,
    title: "Expiration proche - Vaccin Antigrippal",
    description: "Expire dans 5 jours (10/05/2024)",
    time: "Il y a 1 heure",
    category: "expiry",
    priority: "high",
    read: true,
  },
  {
    id: 6,
    title: "Expiration proche - Amoxicilline sirop",
    description: "Expire dans 20 jours (25/05/2024)",
    time: "Il y a 3 heures",
    category: "expiry",
    priority: "medium",
    read: false,
  },
  {
    id: 7,
    title: "Commande #3452 livrée",
    description: "La commande de MediSupply a été livrée",
    time: "Il y a 15 minutes",
    category: "order",
    priority: "low",
    read: false,
  },
  {
    id: 8,
    title: "Nouvelle commande #3456 passée",
    description: "Commande de médicaments cardiovasculaires envoyée",
    time: "Il y a 2 heures",
    category: "order",
    priority: "medium",
    read: true,
  },
  {
    id: 9,
    title: "Rendez-vous client - Jean Dupont",
    description: "Rendez-vous prévu demain à 9h00",
    time: "Il y a 1 heure",
    category: "client",
    priority: "medium",
    read: false,
  },
  {
    id: 10,
    title: "Stock critique - Oméprazole 20mg",
    description: "Le stock est descendu à 7 unités (seuil: 15)",
    time: "Il y a 4 heures",
    category: "stock",
    priority: "high",
    read: true,
  },
  {
    id: 11,
    title: "Expiration proche - Ventoline spray",
    description: "Expire dans 25 jours (05/06/2024)",
    time: "Il y a 5 heures",
    category: "expiry",
    priority: "low",
    read: true,
  },
  {
    id: 12,
    title: "Sauvegarde système réussie",
    description: "La sauvegarde quotidienne a été effectuée avec succès",
    time: "Il y a 6 heures",
    category: "system",
    priority: "low",
    read: true,
  },
]
