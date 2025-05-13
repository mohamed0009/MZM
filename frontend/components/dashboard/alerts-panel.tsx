"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, AlertTriangle } from "lucide-react"

export function AlertsPanel() {
  const [alertsTab, setAlertsTab] = useState("stock")

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Alertes</CardTitle>
          <Button variant="outline" size="sm">
            Marquer tout comme lu
          </Button>
        </div>
        <CardDescription>Gérez les alertes de stock faible et d'expiration des médicaments</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="stock" value={alertsTab} onValueChange={setAlertsTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="stock" className="relative">
              Stock Faible
              <Badge variant="destructive" className="ml-2">
                24
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="expiration" className="relative">
              Expiration
              <Badge variant="destructive" className="ml-2">
                36
              </Badge>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="stock" className="space-y-4">
            <div className="space-y-4">
              {stockAlerts.map((alert, index) => (
                <div key={index} className="flex items-start space-x-4 rounded-md border p-4">
                  <AlertCircle
                    className={`h-6 w-6 ${alert.level === "critical" ? "text-red-500" : "text-amber-500"}`}
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium leading-none">{alert.name}</p>
                      <Badge variant={alert.level === "critical" ? "destructive" : "outline"}>
                        {alert.level === "critical" ? "Critique" : "Attention"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Stock actuel: <span className="font-semibold">{alert.currentStock}</span> | Seuil minimum:{" "}
                      <span className="font-semibold">{alert.threshold}</span>
                    </p>
                    <div className="flex items-center pt-2">
                      <Button variant="outline" size="sm" className="h-8 rounded-md px-3">
                        Commander
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 rounded-md px-3 ml-2">
                        Ignorer
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="expiration" className="space-y-4">
            <div className="space-y-4">
              {expirationAlerts.map((alert, index) => (
                <div key={index} className="flex items-start space-x-4 rounded-md border p-4">
                  <AlertTriangle
                    className={`h-6 w-6 ${getDaysRemaining(alert.expiryDate) <= 7 ? "text-red-500" : "text-amber-500"}`}
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium leading-none">{alert.name}</p>
                      <Badge variant={getDaysRemaining(alert.expiryDate) <= 7 ? "destructive" : "outline"}>
                        {getDaysRemaining(alert.expiryDate) <= 7 ? "Urgent" : "Bientôt"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Expire le: <span className="font-semibold">{formatDate(alert.expiryDate)}</span> | Reste:{" "}
                      <span className="font-semibold">{getDaysRemaining(alert.expiryDate)} jours</span>
                    </p>
                    <div className="flex items-center pt-2">
                      <Button variant="outline" size="sm" className="h-8 rounded-md px-3">
                        Marquer
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 rounded-md px-3 ml-2">
                        Ignorer
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Données fictives pour les alertes de stock
const stockAlerts = [
  { name: "Paracétamol 500mg", currentStock: 5, threshold: 20, level: "critical" },
  { name: "Amoxicilline 1g", currentStock: 8, threshold: 15, level: "critical" },
  { name: "Ibuprofène 400mg", currentStock: 12, threshold: 25, level: "warning" },
  { name: "Oméprazole 20mg", currentStock: 7, threshold: 15, level: "critical" },
  { name: "Doliprane 1000mg", currentStock: 10, threshold: 20, level: "warning" },
]

// Données fictives pour les alertes d'expiration
const expirationAlerts = [
  { name: "Insuline Lantus", expiryDate: new Date(2024, 4, 15) },
  { name: "Vaccin Antigrippal", expiryDate: new Date(2024, 4, 10) },
  { name: "Amoxicilline sirop", expiryDate: new Date(2024, 4, 25) },
  { name: "Ventoline spray", expiryDate: new Date(2024, 5, 5) },
  { name: "Augmentin 1g", expiryDate: new Date(2024, 5, 12) },
]

// Fonction pour formater la date
function formatDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })
}

// Fonction pour calculer le nombre de jours restants
function getDaysRemaining(expiryDate: Date): number {
  const today = new Date()
  const diffTime = expiryDate.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
