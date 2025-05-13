import type { Metadata } from "next"
import { PermissionGuard } from "@/components/auth/permission-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainNav } from "@/components/dashboard/main-nav"
import { UserNav } from "@/components/dashboard/user-nav"
import { BarChart, LineChart, PieChart } from "lucide-react"

export const metadata: Metadata = {
  title: "Rapports - PharmaSys",
  description: "Rapports et statistiques de la pharmacie",
}

export default function ReportsPage() {
  return (
    <PermissionGuard permission="view_reports">
      <div className="flex min-h-screen flex-col">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <UserNav />
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-pharma-primary">Rapports</h2>
          </div>
          <Tabs defaultValue="sales" className="space-y-4">
            <TabsList className="bg-pharma-primary/5 p-1">
              <TabsTrigger 
                value="sales" 
                className="data-[state=active]:bg-pharma-primary data-[state=active]:text-white"
              >
                <BarChart className="mr-2 h-4 w-4" />
                Ventes
              </TabsTrigger>
              <TabsTrigger 
                value="inventory"
                className="data-[state=active]:bg-pharma-primary data-[state=active]:text-white"
              >
                <LineChart className="mr-2 h-4 w-4" />
                Inventaire
              </TabsTrigger>
              <TabsTrigger 
                value="clients"
                className="data-[state=active]:bg-pharma-primary data-[state=active]:text-white"
              >
                <PieChart className="mr-2 h-4 w-4" />
                Clients
              </TabsTrigger>
            </TabsList>
            <TabsContent value="sales" className="space-y-4">
              <Card className="border-pharma-primary/20 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-pharma-primary">Rapport des ventes</CardTitle>
                  <CardDescription>Analyse des ventes sur les 30 derniers jours</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[300px] w-full bg-pharma-primary/5 rounded-lg flex items-center justify-center border border-pharma-primary/10">
                    <p className="text-pharma-primary/70">Graphique des ventes (visible uniquement pour les administrateurs et pharmaciens)</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="inventory" className="space-y-4">
              <Card className="border-pharma-secondary/20 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-pharma-secondary">Rapport d'inventaire</CardTitle>
                  <CardDescription>Analyse de l'inventaire et des stocks</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[300px] w-full bg-pharma-secondary/5 rounded-lg flex items-center justify-center border border-pharma-secondary/10">
                    <p className="text-pharma-secondary/70">Graphique d'inventaire (visible uniquement pour les administrateurs et pharmaciens)</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="clients" className="space-y-4">
              <Card className="border-pharma-accent/20 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-pharma-accent">Rapport clients</CardTitle>
                  <CardDescription>Analyse de la clientèle</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[300px] w-full bg-pharma-accent/5 rounded-lg flex items-center justify-center border border-pharma-accent/10">
                    <p className="text-pharma-accent/70">Graphique clients (visible uniquement pour les administrateurs et pharmaciens)</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PermissionGuard>
  )
}
