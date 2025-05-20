"use client"

import { useState, useCallback, useRef } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { 
  AlertTriangle,
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
  X,
  ShoppingCart,
  Package2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { NoXDialogContent } from "@/components/ui/custom-dialog"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"

// Define interfaces for type safety
interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  id: string;
  supplier: string;
  date: string;
  status: string;
  total: number;
  paymentStatus: string;
  items: OrderItem[];
}

// Mock orders data with medical context
const MOCK_ORDERS: Order[] = [
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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [isExporting, setIsExporting] = useState(false);
  const [newOrderDialogOpen, setNewOrderDialogOpen] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const orderDetailRef = useRef<HTMLDivElement>(null);
  const [clients, setClients] = useState<any[]>([]);
  
  // Function to handle order status changes
  const updateOrderStatus = useCallback((orderId: string, newStatus: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus } 
          : order
      )
    );
  }, []);

  // Function to handle export
  const handleExport = useCallback(() => {
    setIsExporting(true);
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      alert("Export terminé ! Le fichier a été téléchargé.");
    }, 1500);
  }, []);
  
  // Function to handle print
  const handlePrint = useCallback(() => {
    if (!orderDetailRef.current) return;
    
    setIsPrinting(true);
    
    // Store original body overflow
    const originalOverflow = document.body.style.overflow;
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Veuillez autoriser les popups pour imprimer la commande.");
      setIsPrinting(false);
      return;
    }
    
    // Get content to print
    const contentToPrint = orderDetailRef.current.innerHTML;
    
    // Write to the new window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Commande ${selectedOrder?.id || ''}</title>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f5f5f5; }
            .text-right { text-align: right; }
            .total-row td { font-weight: bold; border-top: 2px solid #000; }
            .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; }
            @media print {
              body { padding: 0; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">Commande ${selectedOrder?.id || ''}</div>
            <div>${new Date().toLocaleDateString('fr-FR')}</div>
          </div>
          <p>Fournisseur: <strong>${selectedOrder?.supplier || ''}</strong></p>
          <p>Date: ${selectedOrder ? new Date(selectedOrder.date).toLocaleDateString('fr-FR') : ''}</p>
          <p>Statut: ${selectedOrder?.status || ''}</p>
          ${contentToPrint}
          <script>
            // Auto print when loaded
            window.onload = function() {
              setTimeout(function() {
                window.print();
                setTimeout(function() {
                  window.close();
                }, 500);
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    
    // Cleanup after print
    printWindow.onafterprint = () => {
      printWindow.close();
      document.body.style.overflow = originalOverflow;
      setIsPrinting(false);
    };
    
    // Safety timeout to reset printing state
    setTimeout(() => {
      setIsPrinting(false);
    }, 3000);
  }, [selectedOrder]);
  
  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchQuery === "" || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !statusFilter || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Get unique statuses for the filter dropdown
  const uniqueStatuses = Array.from(new Set(orders.map(order => order.status)));

  // Count orders by status
  const pendingCount = orders.filter(order => order.status === "En attente").length;
  const inProgressCount = orders.filter(order => order.status === "En préparation").length;
  const shippedCount = orders.filter(order => order.status === "Expédiée").length;
  const deliveredCount = orders.filter(order => order.status === "Livrée").length;

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      <div className="flex flex-col gap-6">
        {/* Header with gradient background */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-500 rounded-2xl p-6 shadow-xl text-white mb-2 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-15 bg-center"></div>
          <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-3xl animate-pulse"></div>
          <div className="absolute -top-12 -left-12 w-36 h-36 rounded-full bg-blue-300/10 blur-3xl animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-200 via-white/20 to-cyan-200 opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-gradient-x"></div>
          
          <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center relative z-10">
          <div>
              <motion.h1 
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2"
              >
                <ShoppingCart className="h-7 w-7 text-white/90" />
                Commandes Fournisseurs
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-sm text-cyan-100 mt-1 flex items-center"
              >
                Gérez vos commandes et réapprovisionnements
              </motion.p>
          </div>
          
            <div className="flex items-center gap-2 w-full md:w-auto">
            {hasPermission("orders:create") && (
                <Button 
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30 shadow-sm"
                  onClick={() => setNewOrderDialogOpen(true)}
                >
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle commande
              </Button>
            )}
          </div>
        </div>
        </motion.div>
        
        {/* Cards for order statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="group"
          >
            <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 rounded-xl border-none overflow-hidden h-full border-l-4 border-l-blue-500">
              <CardContent className="p-5 pt-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300 border border-blue-200/50">
                  <Package2 className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-sm font-medium text-slate-500 mb-1">Commandes totales</CardTitle>
                <div className="text-2xl font-bold text-blue-700">{orders.length}</div>
              <p className="text-xs text-slate-500 mt-1">Ce mois-ci</p>
            </CardContent>
          </Card>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="group"
          >
            <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 rounded-xl border-none overflow-hidden h-full border-l-4 border-l-amber-500">
              <CardContent className="p-5 pt-4">
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-full w-12 h-12 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300 border border-amber-200/50">
                  <Clock className="h-6 w-6 text-amber-600" />
              </div>
                <CardTitle className="text-sm font-medium text-slate-500 mb-1">En attente</CardTitle>
                <div className="text-2xl font-bold text-amber-700">{pendingCount}</div>
              <p className="text-xs text-slate-500 mt-1">À confirmer</p>
            </CardContent>
          </Card>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="group"
          >
            <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 rounded-xl border-none overflow-hidden h-full border-l-4 border-l-indigo-500">
              <CardContent className="p-5 pt-4">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300 border border-indigo-200/50">
                  <Truck className="h-6 w-6 text-indigo-600" />
              </div>
                <CardTitle className="text-sm font-medium text-slate-500 mb-1">Expédiées</CardTitle>
                <div className="text-2xl font-bold text-indigo-700">{shippedCount}</div>
                <p className="text-xs text-slate-500 mt-1">En transit</p>
            </CardContent>
          </Card>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="group"
          >
            <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 rounded-xl border-none overflow-hidden h-full border-l-4 border-l-emerald-500">
              <CardContent className="p-5 pt-4">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-full w-12 h-12 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300 border border-emerald-200/50">
                  <PackageCheck className="h-6 w-6 text-emerald-600" />
              </div>
                <CardTitle className="text-sm font-medium text-slate-500 mb-1">Livrées</CardTitle>
                <div className="text-2xl font-bold text-emerald-700">{deliveredCount}</div>
                <p className="text-xs text-slate-500 mt-1">Complétées</p>
            </CardContent>
          </Card>
          </motion.div>
        </div>
        
        {/* Main content with tabs for different order views */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col md:flex-row justify-between gap-4 pb-4">
            <TabsList className="bg-slate-100">
                <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">
                  Toutes
                </TabsTrigger>
                <TabsTrigger value="pending" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">
                  En attente
                </TabsTrigger>
                <TabsTrigger value="shipped" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">
                  Expédiées
                </TabsTrigger>
                <TabsTrigger value="delivered" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">
                  Livrées
                </TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Rechercher une commande..."
                    className="pl-8 bg-white border-slate-200 focus:border-blue-300 focus:ring-blue-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-1 bg-white border-slate-200 hover:bg-slate-50 hover:text-blue-700 hover:border-blue-200 transition-colors">
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Filtrer</span>
                  </Button>
                </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 border-blue-100 shadow-lg rounded-lg">
                  <DropdownMenuLabel>Statut</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-blue-100/50" />
                    <DropdownMenuItem onClick={() => setStatusFilter(null)} className="hover:bg-blue-50 hover:text-blue-700 transition-colors">
                      <Check className={cn("mr-2 h-4 w-4", !statusFilter ? "opacity-100 text-blue-600" : "opacity-0")} />
                    <span>Tous</span>
                  </DropdownMenuItem>
                  {uniqueStatuses.map((status) => (
                      <DropdownMenuItem key={status} onClick={() => setStatusFilter(status)} className="hover:bg-blue-50 hover:text-blue-700 transition-colors">
                        <Check className={cn("mr-2 h-4 w-4", statusFilter === status ? "opacity-100 text-blue-600" : "opacity-0")} />
                      <span>{status}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
                <Button 
                  variant="outline" 
                  className="gap-1 bg-white border-slate-200 hover:bg-slate-50 hover:text-blue-700 hover:border-blue-200 transition-colors"
                  onClick={handleExport}
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-slate-600 mr-2" />
                      <span className="hidden sm:inline">Exporting...</span>
                    </>
                  ) : (
                    <>
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Exporter</span>
                    </>
                  )}
              </Button>
            </div>
          </div>
          
          <TabsContent value="all" className="mt-0">
              <Card className="border-slate-200 shadow-md rounded-xl border-none overflow-hidden">
              <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50">
                      <TableRow className="hover:bg-blue-50/70 border-b border-blue-200/50">
                        <TableHead className="w-[140px] font-medium">Référence</TableHead>
                        <TableHead className="font-medium">Fournisseur</TableHead>
                        <TableHead className="font-medium">Date</TableHead>
                        <TableHead className="font-medium">Statut</TableHead>
                        <TableHead className="text-right font-medium">Montant</TableHead>
                        <TableHead className="text-right font-medium">Actions</TableHead>
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
                          <TableRow key={order.id} className="hover:bg-blue-50/40 border-b border-slate-200 transition-colors">
                            <TableCell className="font-medium text-blue-700">{order.id}</TableCell>
                          <TableCell>{order.supplier}</TableCell>
                          <TableCell>
                            {new Date(order.date).toLocaleDateString('fr-FR', { 
                              day: '2-digit', month: '2-digit', year: 'numeric' 
                            })}
                          </TableCell>
                          <TableCell>
                              <Badge variant="outline" className={cn("rounded-sm font-medium", getStatusColor(order.status))}>
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
                                        onClick={() => {
                                          setSelectedOrder(order);
                                          setIsDialogOpen(true);
                                        }}
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
                                          onClick={() => updateOrderStatus(order.id, "En préparation")}
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
                                          onClick={() => updateOrderStatus(order.id, "Annulée")}
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
                                          onClick={() => {
                                            setSelectedOrder(order);
                                            setIsDialogOpen(true);
                                          }}
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
                                          onClick={() => updateOrderStatus(order.id, "En préparation")}
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
                                          onClick={() => updateOrderStatus(order.id, "Annulée")}
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
                                          onClick={() => {
                                            setSelectedOrder(order);
                                            setIsDialogOpen(true);
                                          }}
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
                                          onClick={() => updateOrderStatus(order.id, "Livrée")}
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
                                          onClick={() => {
                                            setSelectedOrder(order);
                                            setIsDialogOpen(true);
                                          }}
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
        
          {/* Order details dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <NoXDialogContent className="sm:max-w-[800px] w-[95vw] max-h-[85vh] p-0 rounded-xl border-none shadow-xl flex flex-col">
              <div className="bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-500 p-5 rounded-t-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-15 bg-center"></div>
                <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-3xl animate-pulse"></div>
                <div className="absolute -top-12 -left-12 w-36 h-36 rounded-full bg-blue-300/10 blur-3xl animate-pulse"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-200 via-white/20 to-cyan-200 opacity-30"></div>
                
                <DialogHeader className="relative z-10">
                  <DialogTitle className="text-xl text-white">
                    {selectedOrder && (
                      <div className="flex items-center justify-between">
                        <span>Commande {selectedOrder.id}</span>
                        <Badge variant="outline" className={cn("rounded-sm border-white/30 bg-white/20 text-white", getStatusColor(selectedOrder.status).includes("bg-emerald") ? "bg-emerald-500/30 border-emerald-300/50" : 
                        getStatusColor(selectedOrder.status).includes("bg-amber") ? "bg-amber-500/30 border-amber-300/50" : 
                        getStatusColor(selectedOrder.status).includes("bg-indigo") ? "bg-indigo-500/30 border-indigo-300/50" : 
                        getStatusColor(selectedOrder.status).includes("bg-red") ? "bg-red-500/30 border-red-300/50" : 
                        "bg-white/20 border-white/30")}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(selectedOrder.status)}
                            {selectedOrder.status}
                          </span>
                        </Badge>
      </div>
                    )}
                  </DialogTitle>
                  <DialogDescription className="text-cyan-100">
                    {selectedOrder && (
                      <div className="flex justify-between items-center mt-2">
                        <span>Fournisseur: <strong className="text-white">{selectedOrder.supplier}</strong></span>
                        <span>Date: <strong className="text-white">{new Date(selectedOrder.date).toLocaleDateString('fr-FR', { 
                          day: '2-digit', month: '2-digit', year: 'numeric' 
                        })}</strong></span>
                      </div>
                    )}
                  </DialogDescription>
                </DialogHeader>
              </div>
              
              {selectedOrder && (
                <>
                  <div className="p-6 bg-white overflow-y-auto flex-1">
                    <ScrollArea className="pr-4">
                      <div className="space-y-6" ref={orderDetailRef}>
                        <div>
                          <h3 className="text-sm font-medium text-slate-500 mb-2">Détails de la commande</h3>
                          <Card className="overflow-x-auto border-none shadow-sm">
                            <Table className="min-w-full">
                              <TableHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50">
                                <TableRow className="border-blue-200/50">
                                  <TableHead className="whitespace-nowrap font-medium">Produit</TableHead>
                                  <TableHead className="text-right whitespace-nowrap font-medium">Quantité</TableHead>
                                  <TableHead className="text-right whitespace-nowrap font-medium">Prix unitaire</TableHead>
                                  <TableHead className="text-right whitespace-nowrap font-medium">Total</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {selectedOrder.items.map((item: OrderItem) => (
                                  <TableRow key={item.id} className="hover:bg-blue-50/40">
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell className="text-right">{item.quantity}</TableCell>
                                    <TableCell className="text-right">
                                      {item.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                    </TableCell>
                                    <TableCell className="text-right font-semibold">
                                      {item.total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                    </TableCell>
                                  </TableRow>
                                ))}
                                <TableRow className="border-t-2 border-blue-200">
                                  <TableCell colSpan={3} className="text-right font-bold">
                                    Total
                                  </TableCell>
                                  <TableCell className="text-right font-bold text-lg text-blue-700">
                                    {selectedOrder.total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Card>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-slate-500 mb-2">Informations de paiement</h3>
                          <Card className="p-3 border-none shadow-sm bg-gradient-to-r from-slate-50 to-slate-100/70">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm text-slate-500">Statut de paiement</p>
                                <p className="font-medium">
                                  {selectedOrder.paymentStatus === "Payé" ? (
                                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                      <Check className="h-3 w-3 mr-1" />
                                      Payé
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-amber-50 text-amber-700 border-amber-200">
                                      <Clock className="h-3 w-3 mr-1" />
                                      En attente
                                    </Badge>
                                  )}
                                </p>
                              </div>
                              
                              <div className="text-right">
                                <p className="text-sm text-slate-500">Montant total</p>
                                <p className="font-bold text-lg text-blue-700">
                                  {selectedOrder.total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                </p>
                              </div>
                            </div>
                          </Card>
                        </div>
                        
                        <div className="pb-4">
                          <h3 className="text-sm font-medium text-slate-500 mb-2">Actions</h3>
                          <div className="grid grid-cols-3 gap-3">
                            {selectedOrder.status === "En attente" && (
                              <>
                                <Button 
                                  className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm border-2 border-emerald-600 flex items-center justify-center h-10 col-span-1"
                                  onClick={() => {
                                    updateOrderStatus(selectedOrder.id, "En préparation");
                                    setIsDialogOpen(false);
                                  }}
                                >
                                  <Check className="h-5 w-5 mr-2" />
                                  Confirmer
                                </Button>
                                
                                <Button 
                                  variant="outline" 
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 border flex items-center justify-center h-10 col-span-1"
                                  onClick={() => {
                                    updateOrderStatus(selectedOrder.id, "Annulée");
                                    setIsDialogOpen(false);
                                  }}
                                >
                                  <X className="h-5 w-5 mr-2" />
                                  Annuler
                                </Button>
                                
                                <div className="col-span-1"></div>
                              </>
                            )}
                            
                            {selectedOrder.status === "En préparation" && (
                              <>
                                <Button 
                                  variant="outline" 
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 border flex items-center justify-center h-10 col-span-1"
                                  onClick={() => {
                                    updateOrderStatus(selectedOrder.id, "Annulée");
                                    setIsDialogOpen(false);
                                  }}
                                >
                                  <X className="h-5 w-5 mr-2" />
                                  Annuler
                                </Button>
                                <div className="col-span-2"></div>
                              </>
                            )}
                            
                            {selectedOrder.status === "Expédiée" && (
                              <>
                                <Button 
                                  className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm border-2 border-emerald-600 flex items-center justify-center h-10 col-span-1"
                                  onClick={() => {
                                    updateOrderStatus(selectedOrder.id, "Livrée");
                                    setIsDialogOpen(false);
                                  }}
                                >
                                  <PackageCheck className="h-5 w-5 mr-2" />
                                  Marquer reçue
                                </Button>
                                <div className="col-span-2"></div>
                              </>
                            )}
                            
                            <Button 
                              variant="outline" 
                              className="bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 flex items-center justify-center h-10 col-span-1"
                              onClick={() => {
                                handlePrint();
                                // Add a small delay to wait for print dialog
                                setTimeout(() => {
                                  setIsPrinting(false);
                                }, 100);
                              }}
                              disabled={isPrinting}
                            >
                              {isPrinting ? (
                                <>
                                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-slate-600 mr-2" />
                                  Imprimer...
                                </>
                              ) : (
                                <>
                                  <FileText className="h-5 w-5 mr-2" />
                                  Imprimer
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </div>
                  <DialogFooter className="px-6 py-2 border-t border-slate-200 mt-0 bg-slate-50/80">
                    <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50" onClick={() => setIsDialogOpen(false)}>
                      Fermer
                    </Button>
                  </DialogFooter>
                </>
              )}
            </NoXDialogContent>
          </Dialog>
          
          {/* New Order Dialog */}
          <Dialog open={newOrderDialogOpen} onOpenChange={setNewOrderDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Nouvelle commande</DialogTitle>
                <DialogDescription>
                  Créez une nouvelle commande auprès d'un fournisseur
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier">Fournisseur</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un fournisseur" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(clients) ? clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      )) : (
                        <>
                      <SelectItem value="medpharm">MedPharm Supplies</SelectItem>
                      <SelectItem value="pharmasol">PharmaSolutions</SelectItem>
                      <SelectItem value="biomed">BioMed Distributors</SelectItem>
                      <SelectItem value="globalmed">GlobalMed Inc.</SelectItem>
                      <SelectItem value="pharmatech">PharmaTech</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Produits</Label>
                  <Card className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-medium">Liste des produits</h4>
                      <Button variant="outline" size="sm" className="h-8">
                        <Plus className="h-3 w-3 mr-1" />
                        Ajouter
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-center p-8">
                      <div className="text-center text-slate-500">
                        <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-2" />
                        <p>Aucun produit ajouté à la commande</p>
                        <p className="text-xs mt-1">Utilisez le bouton ajouter pour sélectionner des produits</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewOrderDialogOpen(false)}>
                  Annuler
                </Button>
                <Button disabled>
                  Créer la commande
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
      
      <style jsx global>{`
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
      `}</style>
    </div>
  )
} 