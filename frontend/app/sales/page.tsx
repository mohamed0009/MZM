"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Search, Plus, FileText, TrendingUp, Calendar, Filter } from "lucide-react"
import { salesAdapter, clientsAdapter, productsAdapter } from "@/lib/adapter"
import { formatMoney, formatDate } from "@/lib/utils"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function SalesPage() {
  const [sales, setSales] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [periodFilter, setPeriodFilter] = useState("all")
  const [statsData, setStatsData] = useState<any>(null)
  const [dialog, setDialog] = useState({ isOpen: false, isSaving: false, mode: "create" })
  const [newSale, setNewSale] = useState<any>({
    clientId: "",
    saleDate: new Date().toISOString().split('T')[0],
    items: [{ productId: "", quantity: 1, price: 0 }],
    paymentMethod: "CASH",
    notes: ""
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Charger les données principales
      const salesResponse = await salesAdapter.getAll()
      const clientsResponse = await clientsAdapter.getAll()
      const productsResponse = await productsAdapter.getAll()
      const statsResponse = await salesAdapter.getStats()
      
      if (salesResponse.success && salesResponse.data) {
        setSales(salesResponse.data)
      }
      
      if (clientsResponse.success && clientsResponse.data) {
        setClients(clientsResponse.data)
      }
      
      if (productsResponse.success && productsResponse.data) {
        setProducts(productsResponse.data)
      }
      
      if (statsResponse.success && statsResponse.data) {
        setStatsData(statsResponse.data)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error)
      // Charger des données fictives pour la démonstration
      setSales(getMockSales())
      setClients(getMockClients())
      setProducts(getMockProducts())
      setStatsData(getMockStats())
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = () => {
    setNewSale({
      ...newSale,
      items: [...newSale.items, { productId: "", quantity: 1, price: 0 }]
    })
  }

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...newSale.items]
    updatedItems.splice(index, 1)
    setNewSale({ ...newSale, items: updatedItems })
  }

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...newSale.items]
    
    // Si le produit change, mettre à jour le prix
    if (field === 'productId') {
      const product = products.find(p => p.id === value)
      if (product) {
        updatedItems[index] = {
          ...updatedItems[index],
          [field]: value,
          price: product.price
        }
      }
    } else {
      updatedItems[index] = { ...updatedItems[index], [field]: value }
    }
    
    setNewSale({ ...newSale, items: updatedItems })
  }

  const calculateTotal = () => {
    return newSale.items.reduce((total: number, item: any) => 
      total + (item.quantity * item.price), 0)
  }

  const handleSaveSale = async () => {
    setDialog({ ...dialog, isSaving: true })
    
    try {
      const result = await salesAdapter.create(newSale)
      
      if (result.success) {
        // Recharger les données
        loadData()
        setDialog({ isOpen: false, isSaving: false, mode: "create" })
        resetForm()
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la vente:", error)
    } finally {
      setDialog({ ...dialog, isSaving: false })
    }
  }

  const resetForm = () => {
    setNewSale({
      clientId: "",
      saleDate: new Date().toISOString().split('T')[0],
      items: [{ productId: "", quantity: 1, price: 0 }],
      paymentMethod: "CASH",
      notes: ""
    })
  }

  const filteredSales = sales
    .filter(sale => {
      // Filtrer par période
      if (periodFilter === "today") {
        const today = new Date().toISOString().split('T')[0]
        return sale.saleDate.startsWith(today)
      } else if (periodFilter === "week") {
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return new Date(sale.saleDate) >= weekAgo
      } else if (periodFilter === "month") {
        const monthAgo = new Date()
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        return new Date(sale.saleDate) >= monthAgo
      }
      return true
    })
    .filter(sale => {
      // Filtrer par recherche
      if (!searchQuery) return true
      
      const query = searchQuery.toLowerCase()
      const client = clients.find(c => c.id === sale.clientId)
      
      return sale.id.toString().includes(query) || 
             (client && client.name.toLowerCase().includes(query)) ||
             sale.paymentMethod.toLowerCase().includes(query)
    })

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Gestion des Ventes</h1>
      
      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total des Ventes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsData?.totalSales ? formatMoney(statsData.totalSales) : "0 DH"}
            </div>
            <p className="text-xs text-muted-foreground">
              {statsData?.salesCount || 0} transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ventes Aujourd'hui
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsData?.todaySales ? formatMoney(statsData.todaySales) : "0 DH"}
            </div>
            <p className="text-xs text-muted-foreground">
              {statsData?.todaySalesCount || 0} transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Vente Moyenne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsData?.averageSale ? formatMoney(statsData.averageSale) : "0 DH"}
            </div>
            <p className="text-xs text-muted-foreground">
              par transaction
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Méthode de Paiement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsData?.mainPaymentMethod || "Espèces"}
            </div>
            <p className="text-xs text-muted-foreground">
              {statsData?.mainPaymentMethodPercentage || 0}% des transactions
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Filtres et Recherche */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="flex gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les périodes</SelectItem>
              <SelectItem value="today">Aujourd'hui</SelectItem>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Dialog 
          open={dialog.isOpen} 
          onOpenChange={(open) => setDialog({ ...dialog, isOpen: open })}
        >
          <DialogTrigger asChild>
            <Button onClick={() => setDialog({ isOpen: true, isSaving: false, mode: "create" })}>
              <Plus className="mr-2 h-4 w-4" /> Nouvelle Vente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Enregistrer une Vente</DialogTitle>
              <DialogDescription>
                Remplissez les informations de la vente ci-dessous.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Client</Label>
                  <Select 
                    value={newSale.clientId} 
                    onValueChange={(value) => setNewSale({ ...newSale, clientId: value })}
                  >
                    <SelectTrigger id="client">
                      <SelectValue placeholder="Sélectionner un client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newSale.saleDate}
                    onChange={(e) => setNewSale({ ...newSale, saleDate: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <Label className="mb-2 block">Produits</Label>
                {newSale.items.map((item: any, index: number) => (
                  <div key={index} className="grid grid-cols-[3fr,1fr,2fr,auto] gap-2 mb-2">
                    <Select 
                      value={item.productId} 
                      onValueChange={(value) => handleItemChange(index, 'productId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Produit" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                      placeholder="Qté"
                    />
                    
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))}
                      placeholder="Prix"
                    />
                    
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleRemoveItem(index)}
                      disabled={newSale.items.length === 1}
                    >
                      &times;
                    </Button>
                  </div>
                ))}
                
                <Button variant="outline" onClick={handleAddItem} className="mt-2 w-full">
                  + Ajouter un produit
                </Button>
                
                <div className="text-right mt-4 font-bold">
                  Total: {formatMoney(calculateTotal())}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Méthode de Paiement</Label>
                  <Select 
                    value={newSale.paymentMethod} 
                    onValueChange={(value) => setNewSale({ ...newSale, paymentMethod: value })}
                  >
                    <SelectTrigger id="paymentMethod">
                      <SelectValue placeholder="Méthode de paiement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CASH">Espèces</SelectItem>
                      <SelectItem value="CARD">Carte Bancaire</SelectItem>
                      <SelectItem value="TRANSFER">Virement</SelectItem>
                      <SelectItem value="MOBILE">Paiement Mobile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={newSale.notes}
                    onChange={(e) => setNewSale({ ...newSale, notes: e.target.value })}
                    placeholder="Notes additionnelles"
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialog({ ...dialog, isOpen: false })}>
                Annuler
              </Button>
              <Button onClick={handleSaveSale} disabled={dialog.isSaving}>
                {dialog.isSaving ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Onglets */}
      <Tabs defaultValue="list">
        <TabsList className="mb-4">
          <TabsTrigger value="list">
            <FileText className="h-4 w-4 mr-2" />
            Liste des Ventes
          </TabsTrigger>
          <TabsTrigger value="stats">
            <TrendingUp className="h-4 w-4 mr-2" />
            Statistiques
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Paiement</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">Chargement des données...</TableCell>
                    </TableRow>
                  ) : filteredSales.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">Aucune vente trouvée</TableCell>
                    </TableRow>
                  ) : (
                    filteredSales.map((sale) => {
                      const client = clients.find(c => c.id === sale.clientId)
                      return (
                        <TableRow key={sale.id}>
                          <TableCell>{sale.id}</TableCell>
                          <TableCell>{client?.name || "Client inconnu"}</TableCell>
                          <TableCell>{formatDate(sale.saleDate)}</TableCell>
                          <TableCell>
                            {formatMoney(sale.items.reduce(
                              (total: number, item: any) => total + (item.quantity * item.price), 0
                            ))}
                          </TableCell>
                          <TableCell>
                            <Badge variant={sale.paymentMethod === "CASH" ? "default" : "outline"}>
                              {sale.paymentMethod === "CASH" ? "Espèces" : 
                               sale.paymentMethod === "CARD" ? "Carte" : 
                               sale.paymentMethod === "TRANSFER" ? "Virement" : "Mobile"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              Détails
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ventes par Période</CardTitle>
                <CardDescription>
                  Analyse des ventes sur les derniers mois
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statsData?.salesByPeriod || getMockStats().salesByPeriod}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} DH`, 'Montant']} />
                    <Bar dataKey="amount" fill="#8884d8" name="Montant" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Répartition des Paiements</CardTitle>
                <CardDescription>
                  Par méthode de paiement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statsData?.paymentMethods || getMockStats().paymentMethods}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {(statsData?.paymentMethods || getMockStats().paymentMethods).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} transactions`, 'Nombre']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Produits les Plus Vendus</CardTitle>
                <CardDescription>
                  Top des produits par nombre de ventes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Produit</TableHead>
                      <TableHead>Quantité Vendue</TableHead>
                      <TableHead>Montant Total</TableHead>
                      <TableHead>% du Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(statsData?.topProducts || getMockStats().topProducts).map((product: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>{formatMoney(product.total)}</TableCell>
                        <TableCell>{product.percentage}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Données fictives pour démonstration
function getMockSales() {
  return [
    {
      id: 1,
      clientId: "1",
      saleDate: "2023-05-01",
      items: [
        { productId: "1", quantity: 2, price: 120 },
        { productId: "2", quantity: 1, price: 85 }
      ],
      paymentMethod: "CASH",
      notes: ""
    },
    {
      id: 2,
      clientId: "2",
      saleDate: "2023-05-02",
      items: [
        { productId: "3", quantity: 1, price: 200 }
      ],
      paymentMethod: "CARD",
      notes: ""
    },
    {
      id: 3,
      clientId: "3",
      saleDate: new Date().toISOString().split('T')[0],
      items: [
        { productId: "1", quantity: 1, price: 120 },
        { productId: "4", quantity: 3, price: 45 }
      ],
      paymentMethod: "CASH",
      notes: ""
    }
  ]
}

function getMockClients() {
  return [
    { id: "1", name: "Mohammed Alami" },
    { id: "2", name: "Fatima Benali" },
    { id: "3", name: "Youssef Mansouri" }
  ]
}

function getMockProducts() {
  return [
    { id: "1", name: "Paracétamol 500mg", price: 120 },
    { id: "2", name: "Amoxicilline 1g", price: 85 },
    { id: "3", name: "Ibuprofène 400mg", price: 200 },
    { id: "4", name: "Oméprazole 20mg", price: 45 }
  ]
}

function getMockStats() {
  return {
    totalSales: 34500,
    salesCount: 152,
    todaySales: 3850,
    todaySalesCount: 12,
    averageSale: 227,
    mainPaymentMethod: "Espèces",
    mainPaymentMethodPercentage: 68,
    salesByPeriod: [
      { period: 'Jan', amount: 4000 },
      { period: 'Fév', amount: 3000 },
      { period: 'Mar', amount: 5000 },
      { period: 'Avr', amount: 2780 },
      { period: 'Mai', amount: 3890 },
      { period: 'Jun', amount: 2390 }
    ],
    paymentMethods: [
      { name: 'Espèces', value: 103 },
      { name: 'Carte', value: 32 },
      { name: 'Virement', value: 12 },
      { name: 'Mobile', value: 5 }
    ],
    topProducts: [
      { name: 'Paracétamol 500mg', quantity: 245, total: 29400, percentage: 22 },
      { name: 'Oméprazole 20mg', quantity: 187, total: 8415, percentage: 16 },
      { name: 'Amoxicilline 1g', quantity: 145, total: 12325, percentage: 14 },
      { name: 'Ibuprofène 400mg', quantity: 98, total: 19600, percentage: 11 },
      { name: 'Doliprane 1000mg', quantity: 76, total: 3990, percentage: 8 }
    ]
  }
} 