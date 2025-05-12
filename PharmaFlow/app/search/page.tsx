"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { MainNav } from "@/components/dashboard/main-nav"
import { UserNav } from "@/components/dashboard/user-nav"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { Search } from "@/components/dashboard/search"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pill, Users, Bell, Calendar } from "lucide-react"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [activeTab, setActiveTab] = useState("all")
  const [results, setResults] = useState({
    medications: [],
    clients: [],
    alerts: [],
    events: [],
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simuler une recherche
    const fetchResults = async () => {
      setIsLoading(true)
      // Simuler un délai de réseau
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Données fictives pour la démonstration
      setResults({
        medications: [
          { id: "1", name: "Paracétamol 500mg", category: "Analgésique", stock: 120 },
          { id: "2", name: "Amoxicilline 1g", category: "Antibiotique", stock: 45 },
        ],
        clients: [
          { id: "1", firstName: "Mohammed", lastName: "Alami", email: "mohammed.alami@gmail.com" },
          { id: "2", firstName: "Fatima", lastName: "Benali", email: "fatima.benali@gmail.com" },
        ],
        alerts: [
          { id: "1", title: "Stock bas - Paracétamol", priority: "HIGH", category: "INVENTORY" },
          { id: "2", title: "Médicament expiré", priority: "MEDIUM", category: "INVENTORY" },
        ],
        events: [
          { id: "1", title: "Livraison de médicaments", startDate: "2023-06-15", type: "DELIVERY" },
          { id: "2", title: "Réunion d'équipe", startDate: "2023-06-20", type: "MEETING" },
        ],
      })
      setIsLoading(false)
    }

    if (query) {
      fetchResults()
    } else {
      setResults({
        medications: [],
        clients: [],
        alerts: [],
        events: [],
      })
      setIsLoading(false)
    }
  }, [query])

  const totalResults =
    results.medications.length + results.clients.length + results.alerts.length + results.events.length

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="hidden md:flex">
            <MainNav />
          </div>
          <MobileNav />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Résultats de recherche pour "{query}"</h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>Chargement des résultats...</p>
          </div>
        ) : totalResults === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p>Aucun résultat trouvé pour "{query}"</p>
          </div>
        ) : (
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">Tous ({totalResults})</TabsTrigger>
              <TabsTrigger value="medications">Médicaments ({results.medications.length})</TabsTrigger>
              <TabsTrigger value="clients">Clients ({results.clients.length})</TabsTrigger>
              <TabsTrigger value="alerts">Alertes ({results.alerts.length})</TabsTrigger>
              <TabsTrigger value="events">Événements ({results.events.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {results.medications.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Pill className="mr-2 h-5 w-5" />
                      Médicaments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {results.medications.map((med) => (
                        <div key={med.id} className="p-2 border rounded hover:bg-muted">
                          <div className="font-medium">{med.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Catégorie: {med.category} | Stock: {med.stock}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {results.clients.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="mr-2 h-5 w-5" />
                      Clients
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {results.clients.map((client) => (
                        <div key={client.id} className="p-2 border rounded hover:bg-muted">
                          <div className="font-medium">
                            {client.firstName} {client.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">{client.email}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {results.alerts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="mr-2 h-5 w-5" />
                      Alertes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {results.alerts.map((alert) => (
                        <div key={alert.id} className="p-2 border rounded hover:bg-muted">
                          <div className="font-medium">{alert.title}</div>
                          <div className="text-sm text-muted-foreground">
                            Priorité: {alert.priority} | Catégorie: {alert.category}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {results.events.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5" />
                      Événements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {results.events.map((event) => (
                        <div key={event.id} className="p-2 border rounded hover:bg-muted">
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-muted-foreground">
                            Date: {event.startDate} | Type: {event.type}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="medications">
              <Card>
                <CardHeader>
                  <CardTitle>Médicaments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {results.medications.length > 0 ? (
                      results.medications.map((med) => (
                        <div key={med.id} className="p-2 border rounded hover:bg-muted">
                          <div className="font-medium">{med.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Catégorie: {med.category} | Stock: {med.stock}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>Aucun médicament trouvé pour "{query}"</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="clients">
              <Card>
                <CardHeader>
                  <CardTitle>Clients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {results.clients.length > 0 ? (
                      results.clients.map((client) => (
                        <div key={client.id} className="p-2 border rounded hover:bg-muted">
                          <div className="font-medium">
                            {client.firstName} {client.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">{client.email}</div>
                        </div>
                      ))
                    ) : (
                      <p>Aucun client trouvé pour "{query}"</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts">
              <Card>
                <CardHeader>
                  <CardTitle>Alertes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {results.alerts.length > 0 ? (
                      results.alerts.map((alert) => (
                        <div key={alert.id} className="p-2 border rounded hover:bg-muted">
                          <div className="font-medium">{alert.title}</div>
                          <div className="text-sm text-muted-foreground">
                            Priorité: {alert.priority} | Catégorie: {alert.category}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>Aucune alerte trouvée pour "{query}"</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events">
              <Card>
                <CardHeader>
                  <CardTitle>Événements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {results.events.length > 0 ? (
                      results.events.map((event) => (
                        <div key={event.id} className="p-2 border rounded hover:bg-muted">
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-muted-foreground">
                            Date: {event.startDate} | Type: {event.type}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>Aucun événement trouvé pour "{query}"</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
