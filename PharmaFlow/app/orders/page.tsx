"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { 
  CalendarClock, 
  Check, 
  ChevronDown, 
  ClipboardList, 
  Clock, 
  Download, 
  FileText, 
  Filter, 
  Info, 
  PackageCheck,
  Plus,
  Search, 
  Truck, 
  X 
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
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
  SelectValue 
} from "@/components/ui/select"
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// Mock orders data with medical context
const MOCK_ORDERS = [
  {
    id: "ORD-2023-5678",
    supplier: "MedPharm Supplies",
    date: "2023-06-15",
    status: "En attente",
    total: 2580.50,
    paymentStatus: "Payé",
    items: [
      { id: 1, name: "Paracétamol 500mg", quantity: 50, price: 8.50, total: 425 },
      { id: 2, name: "Amoxicilline 1g", quantity: 30, price: 15.20, total: 456 },
      { id: 3, name: "Gants médicaux (boîte)", quantity: 20, price: 12.50, total: 250 }
    ]
  },
  {
    id: "ORD-2023-5679",
    supplier: "PharmaSolutions",
    date: "2023-06-14",
    status: "Expédiée",
    total: 1890.75,
    paymentStatus: "Payé",
    items: [
      { id: 1, name: "Alcool médical 70% 1L", quantity: 30, price: 5.20, total: 156 },
      { id: 2, name: "Seringues 10ml (paquet)", quantity: 50, price: 8.75, total: 437.50 }
    ]
  },
  {
    id: "ORD-2023-5680",
    supplier: "BioMed Distributors",
    date: "2023-06-12",
    status: "Livrée",
    total: 3850.40,
    paymentStatus: "Payé",
    items: [
      { id: 1, name: "Insuline Lantus 100ml", quantity: 15, price: 78.50, total: 1177.50 },
      { id: 2, name: "Test de glycémie (boîte)", quantity: 25, price: 22.80, total: 570 }
    ]
  },
  {
    id: "ORD-2023-5681",
    supplier: "MedPharm Supplies",
    date: "2023-06-10",
    status: "Livrée",
    total: 1250.80,
    paymentStatus: "Payé",
    items: [
      { id: 1, name: "Métoprolol 50mg", quantity: 40, price: 12.80, total: 512 },
      { id: 2, name: "Furosémide 40mg", quantity: 35, price: 10.50, total: 367.50 }
    ]
  },
  {
    id: "ORD-2023-5682",
    supplier: "GlobalMed Inc.",
    date: "2023-06-08",
    status: "Livrée",
    total: 2980.30,
    paymentStatus: "Payé",
    items: [
      { id: 1, name: "Bandages stériles (boîte)", quantity: 40, price: 18.50, total: 740 },
      { id: 2, name: "Antiseptique 500ml", quantity: 25, price: 14.80, total: 370 }
    ]
  },
  {
    id: "ORD-2023-5683",
    supplier: "PharmaTech",
    date: "2023-06-18",
    status: "En préparation",
    total: 4580.90,
    paymentStatus: "En attente",
    items: [
      { id: 1, name: "Oméprazole 20mg", quantity: 60, price: 18.50, total: 1110 },
      { id: 2, name: "Loratadine 10mg", quantity: 45, price: 12.80, total: 576 }
    ]
  }
];

function getStatusColor(status: string) {
  switch (status) {
    case "En attente":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "En préparation":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Expédiée":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case "Livrée":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Annulée":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "En attente":
      return <Clock className="h-3.5 w-3.5" />;
    case "En préparation":
      return <ClipboardList className="h-3.5 w-3.5" />;
    case "Expédiée":
      return <Truck className="h-3.5 w-3.5" />;
    case "Livrée":
      return <PackageCheck className="h-3.5 w-3.5" />;
    case "Annulée":
      return <X className="h-3.5 w-3.5" />;
    default:
      return <Info className="h-3.5 w-3.5" />;
  }
}

export default function OrdersPage() {
  const { hasPermission } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  
  // Filter orders based on search and status
  const filteredOrders = MOCK_ORDERS.filter(order => {
    const matchesSearch = searchQuery === "" || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !statusFilter || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Get unique statuses for the filter dropdown
  const uniqueStatuses = Array.from(new Set(MOCK_ORDERS.map(order => order.status)));

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      <div className="flex flex-col gap-6">
        {/* Header with title and actions */}
        <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Commandes Fournisseurs</h1>
            <p className="text-sm text-slate-500 mt-1">Gérez vos commandes et réapprovisionnements</p>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            {hasPermission("manage_inventory") && (
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle commande
              </Button>
            )}
          </div>
        </div>
        
        {/* Cards for order statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white border-l-4 border-l-emerald-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Commandes totales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{MOCK_ORDERS.length}</div>
              <p className="text-xs text-slate-500 mt-1">Ce mois-ci</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-l-4 border-l-amber-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">En attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {MOCK_ORDERS.filter(order => order.status === "En attente").length}
              </div>
              <p className="text-xs text-slate-500 mt-1">À confirmer</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">En préparation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {MOCK_ORDERS.filter(order => order.status === "En préparation").length}
              </div>
              <p className="text-xs text-slate-500 mt-1">Chez le fournisseur</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-l-4 border-l-indigo-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Expédiées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {MOCK_ORDERS.filter(order => order.status === "Expédiée").length}
              </div>
              <p className="text-xs text-slate-500 mt-1">En transit</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content with tabs for different order views */}
        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col md:flex-row justify-between gap-4 pb-4">
            <TabsList className="bg-slate-100">
              <TabsTrigger value="all" className="data-[state=active]:bg-white">Toutes</TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-white">En attente</TabsTrigger>
              <TabsTrigger value="shipped" className="data-[state=active]:bg-white">Expédiées</TabsTrigger>
              <TabsTrigger value="delivered" className="data-[state=active]:bg-white">Livrées</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Rechercher une commande..."
                  className="pl-8 bg-white border-slate-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-1 bg-white border-slate-200">
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Filtrer</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Statut</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                    <Check className={cn("mr-2 h-4 w-4", !statusFilter ? "opacity-100" : "opacity-0")} />
                    <span>Tous</span>
                  </DropdownMenuItem>
                  {uniqueStatuses.map((status) => (
                    <DropdownMenuItem key={status} onClick={() => setStatusFilter(status)}>
                      <Check className={cn("mr-2 h-4 w-4", statusFilter === status ? "opacity-100" : "opacity-0")} />
                      <span>{status}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button variant="outline" className="gap-1 bg-white border-slate-200">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Exporter</span>
              </Button>
            </div>
          </div>
          
          <TabsContent value="all" className="mt-0">
            <Card className="border-slate-200">
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow className="hover:bg-slate-50">
                      <TableHead className="w-[140px]">Référence</TableHead>
                      <TableHead>Fournisseur</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Montant</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                          Aucune commande trouvée
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id} className="hover:bg-slate-50 border-b">
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.supplier}</TableCell>
                          <TableCell>
                            {new Date(order.date).toLocaleDateString('fr-FR', { 
                              day: '2-digit', month: '2-digit', year: 'numeric' 
                            })}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn("rounded-sm", getStatusColor(order.status))}>
                              <span className="flex items-center gap-1">
                                {getStatusIcon(order.status)}
                                {order.status}
                              </span>
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {order.total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-8 w-8 rounded-full text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                                      onClick={() => setSelectedOrder(order)}
                                    >
                                      <FileText className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Détails</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              {order.status === "En attente" && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 rounded-full text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                      >
                                        <Check className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Confirmer</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                              
                              {(order.status === "En attente" || order.status === "En préparation") && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 rounded-full text-red-600 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Annuler</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pending" className="mt-0">
            <Card className="border-slate-200">
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow className="hover:bg-slate-50">
                      <TableHead className="w-[140px]">Référence</TableHead>
                      <TableHead>Fournisseur</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Montant</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.filter(o => o.status === "En attente").length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                          Aucune commande en attente
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders
                        .filter(o => o.status === "En attente")
                        .map((order) => (
                          <TableRow key={order.id} className="hover:bg-slate-50 border-b">
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{order.supplier}</TableCell>
                            <TableCell>
                              {new Date(order.date).toLocaleDateString('fr-FR', { 
                                day: '2-digit', month: '2-digit', year: 'numeric' 
                              })}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={cn("rounded-sm", getStatusColor(order.status))}>
                                <span className="flex items-center gap-1">
                                  {getStatusIcon(order.status)}
                                  {order.status}
                                </span>
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {order.total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 rounded-full text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                                        onClick={() => setSelectedOrder(order)}
                                      >
                                        <FileText className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Détails</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 rounded-full text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                      >
                                        <Check className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Confirmer</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 rounded-full text-red-600 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Annuler</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="shipped" className="mt-0">
            <Card className="border-slate-200">
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow className="hover:bg-slate-50">
                      <TableHead className="w-[140px]">Référence</TableHead>
                      <TableHead>Fournisseur</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Montant</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.filter(o => o.status === "Expédiée").length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                          Aucune commande expédiée
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders
                        .filter(o => o.status === "Expédiée")
                        .map((order) => (
                          <TableRow key={order.id} className="hover:bg-slate-50 border-b">
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{order.supplier}</TableCell>
                            <TableCell>
                              {new Date(order.date).toLocaleDateString('fr-FR', { 
                                day: '2-digit', month: '2-digit', year: 'numeric' 
                              })}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={cn("rounded-sm", getStatusColor(order.status))}>
                                <span className="flex items-center gap-1">
                                  {getStatusIcon(order.status)}
                                  {order.status}
                                </span>
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {order.total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 rounded-full text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                                        onClick={() => setSelectedOrder(order)}
                                      >
                                        <FileText className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Détails</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 rounded-full text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                      >
                                        <PackageCheck className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Marquer comme reçue</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="delivered" className="mt-0">
            <Card className="border-slate-200">
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow className="hover:bg-slate-50">
                      <TableHead className="w-[140px]">Référence</TableHead>
                      <TableHead>Fournisseur</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Montant</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.filter(o => o.status === "Livrée").length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                          Aucune commande livrée
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders
                        .filter(o => o.status === "Livrée")
                        .map((order) => (
                          <TableRow key={order.id} className="hover:bg-slate-50 border-b">
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{order.supplier}</TableCell>
                            <TableCell>
                              {new Date(order.date).toLocaleDateString('fr-FR', { 
                                day: '2-digit', month: '2-digit', year: 'numeric' 
                              })}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={cn("rounded-sm", getStatusColor(order.status))}>
                                <span className="flex items-center gap-1">
                                  {getStatusIcon(order.status)}
                                  {order.status}
                                </span>
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {order.total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 rounded-full text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                                        onClick={() => setSelectedOrder(order)}
                                      >
                                        <FileText className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Détails</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 rounded-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                                      >
                                        <CalendarClock className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Historique</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Order details dialog would go here */}
      </div>
    </div>
  )
} 