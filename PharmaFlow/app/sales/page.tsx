"use client"

import { useState } from "react"
import { 
  CalendarIcon, 
  CreditCard, 
  Download, 
  Filter, 
  ListFilter, 
  Search as SearchIcon, 
  TrendingUp 
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

// Mock sales data
const recentSales = [
  {
    id: "INV001",
    date: "2023-04-21",
    client: "Jean Dupont",
    product: "Paracétamol 500mg",
    amount: 49.99,
    status: "completed",
    paymentMethod: "Carte Bancaire"
  },
  {
    id: "INV002",
    date: "2023-04-20",
    client: "Marie Leroy",
    product: "Aspirine 500mg",
    amount: 142.50,
    status: "completed",
    paymentMethod: "Espèces"
  },
  {
    id: "INV003",
    date: "2023-04-19",
    client: "Thomas Martin",
    product: "Vitamines C",
    amount: 32.25,
    status: "pending",
    paymentMethod: "Carte Bancaire"
  },
  {
    id: "INV004",
    date: "2023-04-18",
    client: "Sophie Bernard",
    product: "Ibuprofène 400mg",
    amount: 56.80,
    status: "completed",
    paymentMethod: "Assurance"
  },
  {
    id: "INV005",
    date: "2023-04-17",
    client: "Pierre Dubois",
    product: "Attelle poignet",
    amount: 129.99,
    status: "refunded",
    paymentMethod: "Carte Bancaire"
  },
  {
    id: "INV006",
    date: "2023-04-16",
    client: "Lucie Lambert",
    product: "Pansements",
    amount: 12.50,
    status: "completed",
    paymentMethod: "Espèces"
  },
  {
    id: "INV007",
    date: "2023-04-15",
    client: "Michel Petit",
    product: "Antibiotique",
    amount: 78.30,
    status: "completed",
    paymentMethod: "Carte Bancaire"
  },
  {
    id: "INV008",
    date: "2023-04-14",
    client: "Nathalie Roux",
    product: "Crème hydratante",
    amount: 24.99,
    status: "completed",
    paymentMethod: "Espèces"
  }
]

const statusStyles = {
  completed: "bg-green-50 text-green-700 border-green-200",
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  refunded: "bg-red-50 text-red-700 border-red-200"
}

export default function SalesPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  
  return (
    <>
      <main className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Ventes</h1>
              <p className="text-muted-foreground">
                Gérez vos transactions et suivez votre chiffre d'affaires
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exporter
              </Button>
              <Button className="bg-pharma-primary hover:bg-pharma-primary/90">
                Nouvelle vente
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">
                  Ventes du jour
                </CardTitle>
                <CardDescription>
                  Total des ventes d'aujourd'hui
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">349,50 €</div>
                  <div className="flex items-center text-green-600 text-sm font-medium">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +12.5%
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">
                  Ce mois-ci
                </CardTitle>
                <CardDescription>
                  Comparaison avec le mois précédent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">8 426,75 €</div>
                  <div className="flex items-center text-green-600 text-sm font-medium">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +8.2%
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">
                  Nombre de ventes
                </CardTitle>
                <CardDescription>
                  Transactions du mois
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">142</div>
                  <div className="flex items-center text-green-600 text-sm font-medium">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +5.4%
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="all">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
              <TabsList>
                <TabsTrigger value="all">Toutes les ventes</TabsTrigger>
                <TabsTrigger value="recent">Récentes</TabsTrigger>
                <TabsTrigger value="pending">En attente</TabsTrigger>
              </TabsList>
              
              <div className="flex flex-col md:flex-row items-center gap-2">
                <div className="w-full md:w-auto relative">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Rechercher..."
                    className="pl-8 w-full md:w-[250px]"
                  />
                </div>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      {date ? format(date, "PPP", { locale: fr }) : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                <Button variant="outline" className="flex items-center gap-2">
                  <ListFilter className="h-4 w-4" />
                  Filtres
                </Button>
              </div>
            </div>

            <TabsContent value="all" className="space-y-4">
              <Card>
                <CardContent className="p-0">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Référence</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead>Produit</TableHead>
                          <TableHead>Montant</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Paiement</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentSales.map((sale) => (
                          <TableRow key={sale.id}>
                            <TableCell className="font-medium">{sale.id}</TableCell>
                            <TableCell>{sale.date}</TableCell>
                            <TableCell>{sale.client}</TableCell>
                            <TableCell>{sale.product}</TableCell>
                            <TableCell>{sale.amount.toFixed(2)} €</TableCell>
                            <TableCell>
                              <Badge 
                                className={statusStyles[sale.status as keyof typeof statusStyles]}
                                variant="outline"
                              >
                                {sale.status === "completed" && "Terminé"}
                                {sale.status === "pending" && "En attente"}
                                {sale.status === "refunded" && "Remboursé"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                                <span>{sale.paymentMethod}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                Détails
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex items-center justify-end gap-2">
                <Button variant="outline" size="sm" disabled>
                  Précédent
                </Button>
                <Button variant="outline" size="sm">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  Suivant
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="recent" className="space-y-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p>Affichage des ventes des 7 derniers jours.</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="pending" className="space-y-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p>Affichage des ventes en attente uniquement.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  )
} 