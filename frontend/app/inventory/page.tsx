"use client"

import { useEffect, useState } from "react"
import { useApi } from "@/hooks/use-api"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { 
  AlertCircle, 
  Loader2, 
  Plus, 
  RefreshCw, 
  Search, 
  SlidersHorizontal, 
  Download, 
  Filter, 
  Eye, 
  Pencil, 
  ArrowUpDown,
  Pill,
  CheckCircle2,
  AlertTriangle,
  Package2
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

// Mock data to use when API fails
const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Paracétamol 500mg",
    description: "Analgésique et antipyrétique",
    price: 8.50,
    stock: 250,
    category: "Analgésiques",
    expiry: "2025-12-31"
  },
  {
    id: "2",
    name: "Ibuprofène 200mg",
    description: "Anti-inflammatoire non stéroïdien",
    price: 10.20,
    stock: 180,
    category: "Anti-inflammatoires",
    expiry: "2025-10-15"
  },
  {
    id: "3",
    name: "Amoxicilline 500mg",
    description: "Antibiotique de la famille des bêta-lactamines",
    price: 15.75,
    stock: 120,
    category: "Antibiotiques",
    expiry: "2024-08-20"
  },
  {
    id: "4",
    name: "Oméprazole 20mg",
    description: "Inhibiteur de la pompe à protons",
    price: 12.40,
    stock: 95,
    category: "Antiacides",
    expiry: "2025-06-10"
  },
  {
    id: "5",
    name: "Loratadine 10mg",
    description: "Antihistaminique",
    price: 9.30,
    stock: 75,
    category: "Antiallergiques",
    expiry: "2025-09-15"
  }
];

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUsingMockData, setIsUsingMockData] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5) // Number of products per page
  const { inventory } = useApi()
  const { hasPermission } = useAuth()
  
  // Function to handle exporting data to CSV
  const handleExportData = () => {
    try {
      // Create CSV content
      const headers = ["Nom", "Description", "Prix", "Stock", "Catégorie", "Date d'expiration"]
      const csvContent = [
        headers.join(","),
        ...filteredProducts.map(product => [
          `"${product.name}"`,
          `"${product.description}"`,
          formatPrice(product.price).replace(" €", ""),
          product.stock || 0,
          `"${product.category || 'Non catégorisé'}"`,
          product.expiry || 'N/A'
        ].join(","))
      ].join("\n")
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      
      // Set up download attributes
      const date = new Date().toISOString().split('T')[0]
      link.setAttribute('href', url)
      link.setAttribute('download', `inventaire-produits-${date}.csv`)
      
      // Trigger download and cleanup
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Erreur lors de l'export:", error)
      alert("Erreur lors de l'export. Veuillez réessayer.")
    }
  }
  
  // Handle filter by category
  const handleFilterByCategory = (category: string | null) => {
    setSelectedCategory(category)
    setCurrentPage(1) // Reset to first page when filter changes
  }

  // Function to fetch products that can be reused for refresh
  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const productsData = await inventory.getProducts()
      
      // Check if the returned data is an array, if not create an empty array
      if (Array.isArray(productsData) && productsData.length > 0) {
        setProducts(productsData)
        setIsUsingMockData(false)
      } else {
        console.log("No products returned from API, using mock data")
        setProducts(MOCK_PRODUCTS)
        setIsUsingMockData(true)
      }
    } catch (err: any) {
      console.error("Error fetching products:", err)
      // Use mock data on error
      setProducts(MOCK_PRODUCTS)
      setIsUsingMockData(true)
      
      // Save the original error message, but don't display it when using mock data
      setError(err.response?.data?.message || "Impossible de charger les produits depuis le serveur")
    } finally {
      setLoading(false)
    }
  }

  // Fetch products on component mount
  useEffect(() => {
    // Add a short timeout to ensure the component mounts properly
    const timer = setTimeout(() => {
      fetchProducts();
    }, 100);

    // Add a fallback timer to use mock data if loading takes too long
    const fallbackTimer = setTimeout(() => {
      if (loading) {
        console.log("Loading timeout - using mock data");
        setProducts(MOCK_PRODUCTS);
        setIsUsingMockData(true);
        setLoading(false);
      }
    }, 1500);

    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Function to handle retrying connection to the server
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchProducts();
  };

  // Handle product price safely
  const formatPrice = (price: any) => {
    if (typeof price === 'number') {
      return price.toFixed(2) + ' €'
    }
    return '0.00 €'
  }

  // Categories for filtering
  const categories = Array.from(new Set(products.map(product => product.category).filter(Boolean)))

  // Filter and sort products
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Sort products
  const sortedProducts = sortColumn 
    ? [...filteredProducts].sort((a, b) => {
        const valueA = a[sortColumn] ?? '';
        const valueB = b[sortColumn] ?? '';
        
        const comparison = typeof valueA === 'number' 
          ? valueA - valueB
          : String(valueA).localeCompare(String(valueB));
          
        return sortDirection === 'asc' ? comparison : -comparison;
      })
    : filteredProducts;

  // Handle sort change
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Get total number of products by stock status
  const totalProducts = products.length;
  const lowStockProducts = products.filter(product => product.stock < 100).length;
  const mediumStockProducts = products.filter(product => product.stock >= 100 && product.stock < 200).length;
  const goodStockProducts = products.filter(product => product.stock >= 200).length;

  // Get stock status indicator
  const getStockStatus = (stock: number) => {
    if (stock < 100) {
      return (
        <Badge className="bg-red-50 text-red-700 border border-red-200 hover:bg-red-100">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Bas
        </Badge>
      );
    } else if (stock < 200) {
      return (
        <Badge className="bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100">
          <AlertCircle className="h-3 w-3 mr-1" />
          Moyen
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-green-50 text-green-700 border border-green-200 hover:bg-green-100">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Bon
        </Badge>
      );
    }
  };

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
                <Pill className="h-7 w-7 text-white/90" />
                Inventaire des produits
                {isUsingMockData && (
                  <Badge variant="outline" className="ml-2 text-amber-200 border-amber-300/50 text-xs bg-amber-500/20 backdrop-blur-sm">
                    Mode démo
                  </Badge>
                )}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-sm text-cyan-100 mt-1 flex items-center"
              >
                Gérez votre stock de médicaments et produits pharmaceutiques
              </motion.p>
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              {isUsingMockData && (
                <Button 
                  variant="outline" 
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm"
                  onClick={handleRetry}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Réessayer
                </Button>
              )}
              {hasPermission("manage_inventory") && (
                <Link href="/inventory/add">
                  <Button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30 shadow-sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un produit
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </motion.div>

        {isUsingMockData && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-2 text-amber-800 flex items-center shadow-sm"
          >
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 text-amber-600" />
            <div>
              <p className="font-medium">Données de démonstration</p>
              <p className="text-sm">Les données affichées sont fictives car la connexion au serveur a échoué.</p>
            </div>
          </motion.div>
        )}

        {/* Summary Cards */}
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
                <CardTitle className="text-sm font-medium text-slate-500 mb-1">Total produits</CardTitle>
                <div className="text-2xl font-bold text-blue-700">{totalProducts}</div>
                <p className="text-xs text-slate-500 mt-1">En stock</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="group"
          >
            <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 rounded-xl border-none overflow-hidden h-full border-l-4 border-l-green-500">
              <CardContent className="p-5 pt-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-full w-12 h-12 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300 border border-green-200/50">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-sm font-medium text-slate-500 mb-1">Stock élevé</CardTitle>
                <div className="text-2xl font-bold text-green-700">{goodStockProducts}</div>
                <p className="text-xs text-slate-500 mt-1">≥ 200 unités</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="group"
          >
            <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 rounded-xl border-none overflow-hidden h-full border-l-4 border-l-amber-500">
              <CardContent className="p-5 pt-4">
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-full w-12 h-12 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300 border border-amber-200/50">
                  <AlertCircle className="h-6 w-6 text-amber-600" />
                </div>
                <CardTitle className="text-sm font-medium text-slate-500 mb-1">Stock moyen</CardTitle>
                <div className="text-2xl font-bold text-amber-700">{mediumStockProducts}</div>
                <p className="text-xs text-slate-500 mt-1">100-199 unités</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="group"
          >
            <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 rounded-xl border-none overflow-hidden h-full border-l-4 border-l-red-500">
              <CardContent className="p-5 pt-4">
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-full w-12 h-12 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300 border border-red-200/50">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="text-sm font-medium text-slate-500 mb-1">Stock bas</CardTitle>
                <div className="text-2xl font-bold text-red-700">{lowStockProducts}</div>
                <p className="text-xs text-slate-500 mt-1">&lt; 100 unités</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main content with tabs and search filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col md:flex-row justify-between gap-4 pb-4">
              <TabsList className="bg-slate-100">
                <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">Tous les produits</TabsTrigger>
                <TabsTrigger value="low-stock" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">Stock bas</TabsTrigger>
                <TabsTrigger value="expiring" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">Expiration proche</TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Rechercher un produit..."
                    className="pl-8 bg-white border-slate-200 focus:border-blue-300 focus:ring-blue-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Button 
                  variant="outline" 
                  className="gap-1 bg-white border-slate-200 hover:bg-slate-50 hover:text-blue-700 hover:border-blue-200 transition-colors"
                  onClick={() => setSelectedCategory(selectedCategory ? null : (categories.length > 0 ? categories[0] : null))}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {selectedCategory ? `Filtré: ${selectedCategory}` : "Filtres"}
                  </span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="gap-1 bg-white border-slate-200 hover:bg-slate-50 hover:text-blue-700 hover:border-blue-200 transition-colors"
                  onClick={handleExportData}
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Exporter</span>
                </Button>
              </div>
            </div>
            
            <TabsContent value="all" className="mt-0">
              <Card className="border-slate-200 shadow-md rounded-xl border-none overflow-hidden">
                <CardContent className="p-0">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg">
                      <div className="relative w-16 h-16 mx-auto mb-4">
                        <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-blue-500 animate-spin"></div>
                        <div className="absolute inset-1 rounded-full border-t-2 border-teal-400 animate-spin animate-delay-150"></div>
                        <div className="absolute inset-2 rounded-full border-t-2 border-indigo-600 animate-spin animate-delay-300"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Pill className="h-6 w-6 text-teal-500" />
                        </div>
                      </div>
                      <span className="text-slate-600 font-medium">Chargement des produits...</span>
                      <p className="text-xs text-slate-400 mt-2">Si le chargement persiste, les données d'exemple seront affichées</p>
                    </div>
                  ) : error && !isUsingMockData ? (
                    <div className="bg-red-50 p-6 rounded-md text-red-700 flex items-start">
                      <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">Erreur de chargement</h3>
                        <p>{error}</p>
                      </div>
                    </div>
                  ) : sortedProducts.length === 0 ? (
                    <div className="text-center p-12 text-slate-500">
                      <div className="max-w-md mx-auto">
                        <p className="text-lg font-medium mb-2">Aucun produit trouvé</p>
                        <p className="text-sm">Aucun produit ne correspond à vos critères de recherche. Veuillez modifier vos filtres ou ajouter de nouveaux produits.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50">
                          <TableRow className="hover:bg-blue-50/70 border-b border-blue-200/50">
                            <TableHead 
                              className="cursor-pointer hover:text-blue-700 transition-colors"
                              onClick={() => handleSort('name')}
                            >
                              <div className="flex items-center">
                                Nom
                                {sortColumn === 'name' && (
                                  <ArrowUpDown className={cn(
                                    "ml-1 h-4 w-4 text-blue-600", 
                                    sortDirection === 'asc' ? "rotate-0" : "rotate-180"
                                  )} />
                                )}
                              </div>
                            </TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead 
                              className="cursor-pointer hover:text-blue-700 transition-colors"
                              onClick={() => handleSort('price')}
                            >
                              <div className="flex items-center">
                                Prix
                                {sortColumn === 'price' && (
                                  <ArrowUpDown className={cn(
                                    "ml-1 h-4 w-4 text-blue-600", 
                                    sortDirection === 'asc' ? "rotate-0" : "rotate-180"
                                  )} />
                                )}
                              </div>
                            </TableHead>
                            <TableHead 
                              className="cursor-pointer hover:text-blue-700 transition-colors"
                              onClick={() => handleSort('stock')}
                            >
                              <div className="flex items-center">
                                Stock
                                {sortColumn === 'stock' && (
                                  <ArrowUpDown className={cn(
                                    "ml-1 h-4 w-4 text-blue-600", 
                                    sortDirection === 'asc' ? "rotate-0" : "rotate-180"
                                  )} />
                                )}
                              </div>
                            </TableHead>
                            <TableHead 
                              className="cursor-pointer hover:text-blue-700 transition-colors"
                              onClick={() => handleSort('category')}
                            >
                              <div className="flex items-center">
                                Catégorie
                                {sortColumn === 'category' && (
                                  <ArrowUpDown className={cn(
                                    "ml-1 h-4 w-4 text-blue-600", 
                                    sortDirection === 'asc' ? "rotate-0" : "rotate-180"
                                  )} />
                                )}
                              </div>
                            </TableHead>
                            <TableHead 
                              className="cursor-pointer hover:text-blue-700 transition-colors"
                              onClick={() => handleSort('expiry')}
                            >
                              <div className="flex items-center">
                                Date d'expiration
                                {sortColumn === 'expiry' && (
                                  <ArrowUpDown className={cn(
                                    "ml-1 h-4 w-4 text-blue-600", 
                                    sortDirection === 'asc' ? "rotate-0" : "rotate-180"
                                  )} />
                                )}
                              </div>
                            </TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Array.isArray(sortedProducts) && sortedProducts
                            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                            .map((product, index) => (
                            <TableRow key={product.id} className="hover:bg-blue-50/40 border-b border-slate-200 transition-colors">
                              <TableCell className="font-medium text-blue-700">{product.name}</TableCell>
                              <TableCell className="max-w-xs truncate">{product.description}</TableCell>
                              <TableCell className="font-medium">{formatPrice(product.price)}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <span className="mr-2">{product.stock || 0}</span>
                                  {getStockStatus(product.stock || 0)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
                                  {product.category || 'Non catégorisé'}
                                </Badge>
                              </TableCell>
                              <TableCell>{product.expiry || 'N/A'}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Link href={`/inventory/${product.id}`}>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors rounded-full">
                                      <Eye className="h-4 w-4" />
                                      <span className="sr-only">Détails</span>
                                    </Button>
                                  </Link>
                                  {hasPermission("manage_inventory") && (
                                    <Link href={`/inventory/edit/${product.id}`}>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors rounded-full">
                                        <Pencil className="h-4 w-4" />
                                        <span className="sr-only">Modifier</span>
                                      </Button>
                                    </Link>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
                {!loading && !error && sortedProducts.length > 0 && (
                  <CardFooter className="flex justify-between items-center py-4 bg-gradient-to-r from-slate-50 to-blue-50/30 border-t border-blue-100/50">
                    <div className="text-sm text-slate-500">
                      Page <span className="font-medium text-blue-700">{currentPage}</span> sur <span className="font-medium text-blue-700">{Math.ceil(sortedProducts.length / itemsPerPage)}</span> · 
                      Total: <span className="font-medium text-blue-700">{sortedProducts.length}</span> produits
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        Précédent
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors"
                        onClick={() => setCurrentPage(Math.min(Math.ceil(sortedProducts.length / itemsPerPage), currentPage + 1))}
                        disabled={currentPage >= Math.ceil(sortedProducts.length / itemsPerPage)}
                      >
                        Suivant
                      </Button>
                    </div>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>
            
            <TabsContent value="low-stock" className="mt-0">
              <Card className="border-none rounded-xl shadow-md overflow-hidden">
                <CardContent className="p-6 text-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2 text-blue-700">Filtre en développement</h3>
                  <p className="text-slate-500">Cette fonctionnalité sera disponible prochainement.</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="expiring" className="mt-0">
              <Card className="border-none rounded-xl shadow-md overflow-hidden">
                <CardContent className="p-6 text-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2 text-blue-700">Filtre en développement</h3>
                  <p className="text-slate-500">Cette fonctionnalité sera disponible prochainement.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
