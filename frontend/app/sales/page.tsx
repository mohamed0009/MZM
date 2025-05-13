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
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      <div className="flex flex-col gap-6">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-500 rounded-2xl p-6 shadow-xl text-white mb-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-15 bg-center"></div>
          <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-3xl animate-pulse"></div>
          <div className="absolute -top-12 -left-12 w-36 h-36 rounded-full bg-blue-300/10 blur-3xl animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-200 via-white/20 to-cyan-200 opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-gradient-x"></div>
          
          <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center relative z-10">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="h-7 w-7 text-white/90" />
                Gestion des Ventes
              </h1>
              <p className="text-sm text-cyan-100 mt-1 flex items-center">
                Suivez vos transactions et analysez vos performances commerciales
              </p>
            </div>
            </div>
          </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="group">
            <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 rounded-xl border-none overflow-hidden h-full border-l-4 border-l-blue-500">
              <CardContent className="p-5 pt-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300 border border-blue-200/50">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-sm font-medium text-slate-500 mb-1">Total des Ventes</CardTitle>
                <div className="text-2xl font-bold text-blue-700">{statsData?.totalSales ? formatMoney(statsData.totalSales) : "0 DH"}</div>
                <p className="text-xs text-slate-500 mt-1">{statsData?.salesCount || 0} transactions</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="group">
            <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 rounded-xl border-none overflow-hidden h-full border-l-4 border-l-teal-500">
              <CardContent className="p-5 pt-4">
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-full w-12 h-12 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300 border border-teal-200/50">
                  <Calendar className="h-6 w-6 text-teal-600" />
                </div>
                <CardTitle className="text-sm font-medium text-slate-500 mb-1">Ventes Aujourd'hui</CardTitle>
                <div className="text-2xl font-bold text-teal-700">{statsData?.todaySales ? formatMoney(statsData.todaySales) : "0 DH"}</div>
                <p className="text-xs text-slate-500 mt-1">{statsData?.todaySalesCount || 0} transactions</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="group">
            <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 rounded-xl border-none overflow-hidden h-full border-l-4 border-l-indigo-500">
              <CardContent className="p-5 pt-4">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300 border border-indigo-200/50">
                  <FileText className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle className="text-sm font-medium text-slate-500 mb-1">Vente Moyenne</CardTitle>
                <div className="text-2xl font-bold text-indigo-700">{statsData?.averageSale ? formatMoney(statsData.averageSale) : "0 DH"}</div>
                <p className="text-xs text-slate-500 mt-1">par transaction</p>
              </CardContent>
            </Card>
          </div>

          <div className="group">
            <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 rounded-xl border-none overflow-hidden h-full border-l-4 border-l-emerald-500">
              <CardContent className="p-5 pt-4">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-full w-12 h-12 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300 border border-emerald-200/50">
                  <Plus className="h-6 w-6 text-emerald-600" />
                </div>
                <CardTitle className="text-sm font-medium text-slate-500 mb-1">Méthode de Paiement</CardTitle>
                <div className="text-2xl font-bold text-emerald-700">{statsData?.mainPaymentMethod || "Espèces"}</div>
                <p className="text-xs text-slate-500 mt-1">{statsData?.mainPaymentMethodPercentage || 0}% des transactions</p>
              </CardContent>
            </Card>
          </div>
        </div>
      
      {/* Filtres et Recherche */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4 bg-white p-4 rounded-xl shadow-sm">
        <div className="flex gap-4">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Rechercher une vente..."
              className="pl-8 bg-white border-slate-200 focus:border-blue-300 focus:ring-blue-200 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="w-[180px] border-slate-200 bg-white hover:bg-slate-50 rounded-lg pl-3 pr-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-slate-500" />
                  <SelectValue placeholder="Toutes les périodes" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white rounded-lg border-slate-200 shadow-md">
                <SelectItem value="all" className="py-2.5 pl-8 relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2">
                    {periodFilter === "all" && <div className="h-4 w-4 rounded-full text-blue-600 flex items-center justify-center">✓</div>}
                  </span>
                  Toutes les périodes
                </SelectItem>
                <SelectItem value="today" className="py-2.5 pl-8 relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2">
                    {periodFilter === "today" && <div className="h-4 w-4 rounded-full text-blue-600 flex items-center justify-center">✓</div>}
                  </span>
                  Aujourd'hui
                </SelectItem>
                <SelectItem value="week" className="py-2.5 pl-8 relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2">
                    {periodFilter === "week" && <div className="h-4 w-4 rounded-full text-blue-600 flex items-center justify-center">✓</div>}
                  </span>
                  Cette semaine
                </SelectItem>
                <SelectItem value="month" className="py-2.5 pl-8 relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2">
                    {periodFilter === "month" && <div className="h-4 w-4 rounded-full text-blue-600 flex items-center justify-center">✓</div>}
                  </span>
                  Ce mois
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Dialog 
          open={dialog.isOpen} 
          onOpenChange={(open) => setDialog({ ...dialog, isOpen: open })}
        >
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white shadow-sm"
              onClick={() => setDialog({ isOpen: true, isSaving: false, mode: "create" })}
            >
              <Plus className="mr-2 h-4 w-4" /> Nouvelle Vente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader className="bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-500 p-6 rounded-t-xl text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-15 bg-center"></div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-3xl animate-pulse"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-200 via-white/20 to-cyan-200 opacity-30"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-gradient-x"></div>
              
              <DialogTitle className="text-2xl font-bold text-white">Enregistrer une Vente</DialogTitle>
              <DialogDescription className="text-cyan-100 mt-1">
                Remplissez les informations de la vente ci-dessous.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-5 py-5 px-6 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client" className="text-sm font-medium text-slate-700">Client</Label>
                  <Select 
                    value={newSale.clientId} 
                    onValueChange={(value) => setNewSale({ ...newSale, clientId: value })}
                  >
                    <SelectTrigger id="client" className="border-slate-200 hover:border-blue-300 focus:border-blue-400 transition-colors">
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
                  <Label htmlFor="date" className="text-sm font-medium text-slate-700">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newSale.saleDate}
                    onChange={(e) => setNewSale({ ...newSale, saleDate: e.target.value })}
                    className="border-slate-200 hover:border-blue-300 focus:border-blue-400 transition-colors"
                  />
                </div>
              </div>
              
            <div>
                <Label className="mb-3 block text-sm font-medium text-slate-700">Produits</Label>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-4">
                  {newSale.items.map((item: any, index: number) => (
                    <div key={index} className="grid grid-cols-[3fr,1fr,2fr,auto] gap-3 mb-3 last:mb-0">
                      <Select 
                        value={item.productId} 
                        onValueChange={(value) => handleItemChange(index, 'productId', value)}
                      >
                        <SelectTrigger className="border-slate-200 bg-white hover:border-blue-300 focus:border-blue-400 transition-colors">
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
                        className="border-slate-200 bg-white hover:border-blue-300 focus:border-blue-400 transition-colors"
                      />
                      
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))}
                        placeholder="Prix"
                        className="border-slate-200 bg-white hover:border-blue-300 focus:border-blue-400 transition-colors"
                      />
                      
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleRemoveItem(index)}
                        disabled={newSale.items.length === 1}
                        className="border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                      >
                        &times;
                      </Button>
                    </div>
                  ))}
                  
                  <Button variant="outline" onClick={handleAddItem} className="mt-3 w-full bg-white hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors">
                    + Ajouter un produit
                  </Button>
                </div>
                
                <div className="text-right mt-4 font-bold text-blue-700 bg-blue-50 p-3 rounded-lg border border-blue-100">
                  Total: {formatMoney(calculateTotal())}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod" className="text-sm font-medium text-slate-700">Méthode de Paiement</Label>
                  <Select 
                    value={newSale.paymentMethod} 
                    onValueChange={(value) => setNewSale({ ...newSale, paymentMethod: value })}
                  >
                    <SelectTrigger id="paymentMethod" className="border-slate-200 hover:border-blue-300 focus:border-blue-400 transition-colors">
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
                  <Label htmlFor="notes" className="text-sm font-medium text-slate-700">Notes</Label>
                  <Input
                    id="notes"
                    value={newSale.notes}
                    onChange={(e) => setNewSale({ ...newSale, notes: e.target.value })}
                    placeholder="Notes additionnelles"
                    className="border-slate-200 hover:border-blue-300 focus:border-blue-400 transition-colors"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200 rounded-b-xl flex">
              <div className="grid grid-cols-3 gap-3 w-full">
                <Button variant="outline" onClick={() => setDialog({ ...dialog, isOpen: false })} className="border-slate-200 hover:bg-slate-100 transition-colors col-span-1">
                  Annuler
                </Button>
                <Button 
                  onClick={handleSaveSale} 
                  disabled={dialog.isSaving}
                  className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white col-span-2"
                >
                  {dialog.isSaving ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
            </div>

      {/* Onglets */}
      <Tabs defaultValue="list" className="mt-2">
        <TabsList className="mb-4 bg-white rounded-xl overflow-hidden border border-slate-100 p-1 shadow-sm">
          <TabsTrigger 
            value="list" 
            className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm px-6 py-2.5 transition-all"
          >
            <FileText className="h-4 w-4 mr-2" />
            Liste des Ventes
          </TabsTrigger>
          <TabsTrigger 
            value="stats" 
            className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm px-6 py-2.5 transition-all"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Statistiques
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <Card className="border-slate-200 shadow-md rounded-xl border-none overflow-hidden">
                <CardContent className="p-0">
                    <Table>
                <TableHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50">
                  <TableRow className="hover:bg-blue-50/70 border-b border-blue-200/50">
                    <TableHead className="font-medium">ID</TableHead>
                    <TableHead className="font-medium">Client</TableHead>
                    <TableHead className="font-medium">Date</TableHead>
                    <TableHead className="font-medium">Total</TableHead>
                    <TableHead className="font-medium">Paiement</TableHead>
                    <TableHead className="text-right font-medium">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                        <div className="flex items-center justify-center">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600 mr-2" />
                          Chargement des données...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredSales.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                        Aucune vente trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSales.map((sale) => {
                      const client = clients.find(c => c.id === sale.clientId)
                      return (
                        <TableRow key={sale.id} className="hover:bg-blue-50/40 border-b border-slate-200 transition-colors">
                          <TableCell className="font-medium text-blue-700">{sale.id}</TableCell>
                          <TableCell>{client?.name || "Client inconnu"}</TableCell>
                          <TableCell>{formatDate(sale.saleDate)}</TableCell>
                          <TableCell className="font-medium">
                            {formatMoney(sale.items.reduce(
                              (total: number, item: any) => total + (item.quantity * item.price), 0
                            ))}
                            </TableCell>
                            <TableCell>
                            <Badge variant={sale.paymentMethod === "CASH" ? "default" : "outline"} 
                              className={
                                sale.paymentMethod === "CASH" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                sale.paymentMethod === "CARD" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                sale.paymentMethod === "TRANSFER" ? "bg-indigo-50 text-indigo-700 border-indigo-200" :
                                "bg-amber-50 text-amber-700 border-amber-200"
                              }>
                              {sale.paymentMethod === "CASH" ? "Espèces" : 
                               sale.paymentMethod === "CARD" ? "Carte" : 
                               sale.paymentMethod === "TRANSFER" ? "Virement" : "Mobile"}
                            </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 rounded-full text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                            >
                              <FileText className="h-4 w-4" />
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
            <Card className="border-none shadow-md rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-b border-blue-100">
                <CardTitle className="text-blue-800 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Ventes par Période
                </CardTitle>
                <CardDescription className="text-blue-600">
                  Analyse des ventes sur les derniers mois
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-white">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statsData?.salesByPeriod || getMockStats().salesByPeriod}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
                    <XAxis dataKey="period" tick={{fill: '#64748b'}} />
                    <YAxis tick={{fill: '#64748b'}} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value) => [`${value} DH`, 'Montant']}
                    />
                    <Bar dataKey="amount" fill="#3b82f6" name="Montant" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100/50 border-b border-indigo-100">
                <CardTitle className="text-indigo-800 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-600" />
                  Répartition des Paiements
                </CardTitle>
                <CardDescription className="text-indigo-600">
                  Par méthode de paiement
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-white">
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
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value) => [`${value} transactions`, 'Nombre']} 
                    />
                  </PieChart>
                </ResponsiveContainer>
                </CardContent>
              </Card>
            
            <Card className="md:col-span-2 border-none shadow-md rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-teal-50 to-teal-100/50 border-b border-teal-100">
                <CardTitle className="text-teal-800 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-teal-600" />
                  Produits les Plus Vendus
                </CardTitle>
                <CardDescription className="text-teal-600">
                  Top des produits par nombre de ventes
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 bg-white">
                <Table>
                  <TableHeader className="bg-gradient-to-r from-teal-50 to-teal-100/50">
                    <TableRow className="hover:bg-teal-50/70 border-b border-teal-200/50">
                      <TableHead className="font-medium">#</TableHead>
                      <TableHead className="font-medium">Produit</TableHead>
                      <TableHead className="font-medium text-right">Quantité</TableHead>
                      <TableHead className="font-medium text-right">Montant Total</TableHead>
                      <TableHead className="font-medium text-right">% du Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(statsData?.topProducts || getMockStats().topProducts).map((product: any, index: number) => (
                      <TableRow key={index} className="hover:bg-teal-50/40 border-b border-slate-200 transition-colors">
                        <TableCell className="text-slate-500 font-medium">{index + 1}</TableCell>
                        <TableCell className="font-medium text-blue-700">{product.name}</TableCell>
                        <TableCell className="text-right">{product.quantity}</TableCell>
                        <TableCell className="text-right font-medium">{formatMoney(product.total)}</TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-teal-50 text-teal-700 border-teal-200">
                            {product.percentage}%
                          </Badge>
                        </TableCell>
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
      
      <style jsx global>{styles}</style>
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

// Add animation styles
const styles = `
  @keyframes gradient-x {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  .animate-gradient-x {
    background-size: 200% 200%;
    animation: gradient-x 15s ease infinite;
  }
  
  @keyframes animate-delay-150 {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .animate-delay-150 {
    animation-delay: 150ms;
  }
  
  @keyframes animate-delay-300 {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .animate-delay-300 {
    animation-delay: 300ms;
  }
`; 