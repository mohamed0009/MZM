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
  AlertTriangle
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { cn } from "@/lib/utils"

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
  const { inventory } = useApi()
  const { hasPermission } = useAuth()

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
    }, 500);

    // Add a fallback timer to use mock data if loading takes too long
    const fallbackTimer = setTimeout(() => {
      if (loading) {
        console.log("Loading timeout - using mock data");
        setProducts(MOCK_PRODUCTS);
        setIsUsingMockData(true);
        setLoading(false);
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
    };
  }, [inventory, loading]);

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
        {/* Header with title and actions */}
        <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-2">
              <Pill className="h-6 w-6 text-teal-600" />
              Inventaire des produits
            </h1>
            <p className="text-sm text-slate-500 mt-1">Gérez votre stock de médicaments et produits pharmaceutiques</p>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            {isUsingMockData && (
              <Button 
                variant="outline" 
                className="text-amber-600 border-amber-200 hover:bg-amber-50"
                onClick={() => fetchProducts()}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Réessayer
              </Button>
            )}
            {hasPermission("manage_inventory") && (
              <Link href="/inventory/add">
                <Button className="bg-teal-600 hover:bg-teal-700 text-white shadow-sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un produit
                </Button>
              </Link>
            )}
          </div>
        </div>

        {isUsingMockData && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-2 text-amber-800 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Données de démonstration</p>
              <p className="text-sm">Les données affichées sont fictives car la connexion au serveur a échoué.</p>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white border-l-4 border-l-teal-500 hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Total produits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-slate-500 mt-1">En stock</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-l-4 border-l-green-500 hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Stock élevé</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{goodStockProducts}</div>
              <p className="text-xs text-slate-500 mt-1">≥ 200 unités</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-l-4 border-l-amber-500 hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Stock moyen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mediumStockProducts}</div>
              <p className="text-xs text-slate-500 mt-1">100-199 unités</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-l-4 border-l-red-500 hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Stock bas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lowStockProducts}</div>
              <p className="text-xs text-slate-500 mt-1">&lt; 100 unités</p>
            </CardContent>
          </Card>
        </div>

        {/* Main content with tabs and search filters */}
        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col md:flex-row justify-between gap-4 pb-4">
            <TabsList className="bg-slate-100">
              <TabsTrigger value="all" className="data-[state=active]:bg-white">Tous les produits</TabsTrigger>
              <TabsTrigger value="low-stock" className="data-[state=active]:bg-white">Stock bas</TabsTrigger>
              <TabsTrigger value="expiring" className="data-[state=active]:bg-white">Expiration proche</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Rechercher un produit..."
                  className="pl-8 bg-white border-slate-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button variant="outline" className="gap-1 bg-white border-slate-200 hover:bg-slate-50">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filtres</span>
              </Button>
              
              <Button variant="outline" className="gap-1 bg-white border-slate-200 hover:bg-slate-50">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Exporter</span>
              </Button>
            </div>
          </div>
          
          <TabsContent value="all" className="mt-0">
            <Card className="border-slate-200">
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex justify-center items-center p-12">
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-8 w-8 animate-spin text-teal-600 mb-2" />
                      <span className="text-slate-600">Chargement des produits...</span>
                    </div>
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
                      <TableHeader className="bg-slate-50">
                        <TableRow className="hover:bg-slate-50 border-b border-slate-200">
                          <TableHead 
                            className="cursor-pointer"
                            onClick={() => handleSort('name')}
                          >
                            <div className="flex items-center">
                              Nom
                              {sortColumn === 'name' && (
                                <ArrowUpDown className={cn(
                                  "ml-1 h-4 w-4", 
                                  sortDirection === 'asc' ? "rotate-0" : "rotate-180"
                                )} />
                              )}
                            </div>
                          </TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead 
                            className="cursor-pointer"
                            onClick={() => handleSort('price')}
                          >
                            <div className="flex items-center">
                              Prix
                              {sortColumn === 'price' && (
                                <ArrowUpDown className={cn(
                                  "ml-1 h-4 w-4", 
                                  sortDirection === 'asc' ? "rotate-0" : "rotate-180"
                                )} />
                              )}
                            </div>
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer"
                            onClick={() => handleSort('stock')}
                          >
                            <div className="flex items-center">
                              Stock
                              {sortColumn === 'stock' && (
                                <ArrowUpDown className={cn(
                                  "ml-1 h-4 w-4", 
                                  sortDirection === 'asc' ? "rotate-0" : "rotate-180"
                                )} />
                              )}
                            </div>
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer"
                            onClick={() => handleSort('category')}
                          >
                            <div className="flex items-center">
                              Catégorie
                              {sortColumn === 'category' && (
                                <ArrowUpDown className={cn(
                                  "ml-1 h-4 w-4", 
                                  sortDirection === 'asc' ? "rotate-0" : "rotate-180"
                                )} />
                              )}
                            </div>
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer"
                            onClick={() => handleSort('expiry')}
                          >
                            <div className="flex items-center">
                              Date d'expiration
                              {sortColumn === 'expiry' && (
                                <ArrowUpDown className={cn(
                                  "ml-1 h-4 w-4", 
                                  sortDirection === 'asc' ? "rotate-0" : "rotate-180"
                                )} />
                              )}
                            </div>
                          </TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Array.isArray(sortedProducts) && sortedProducts.map((product) => (
                          <TableRow key={product.id} className="hover:bg-slate-50 border-b border-slate-200">
                            <TableCell className="font-medium text-teal-700">{product.name}</TableCell>
                            <TableCell className="max-w-xs truncate">{product.description}</TableCell>
                            <TableCell className="font-medium">{formatPrice(product.price)}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <span className="mr-2">{product.stock || 0}</span>
                                {getStockStatus(product.stock || 0)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {product.category || 'Non catégorisé'}
                              </Badge>
                            </TableCell>
                            <TableCell>{product.expiry || 'N/A'}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Link href={`/inventory/${product.id}`}>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-600 hover:text-teal-700 hover:bg-teal-50">
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">Détails</span>
                                  </Button>
                                </Link>
                                {hasPermission("manage_inventory") && (
                                  <Link href={`/inventory/edit/${product.id}`}>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-600 hover:text-blue-700 hover:bg-blue-50">
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
                <CardFooter className="flex justify-between items-center py-4 bg-slate-50 border-t border-slate-200">
                  <div className="text-sm text-slate-500">
                    Total: <span className="font-medium">{sortedProducts.length}</span> produits
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" className="h-8 bg-white">Précédent</Button>
                    <Button variant="outline" size="sm" className="h-8 bg-white">Suivant</Button>
                  </div>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="low-stock" className="mt-0">
            <Card className="border-slate-200">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-medium mb-2">Filtre en développement</h3>
                <p className="text-slate-500">Cette fonctionnalité sera disponible prochainement.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="expiring" className="mt-0">
            <Card className="border-slate-200">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-medium mb-2">Filtre en développement</h3>
                <p className="text-slate-500">Cette fonctionnalité sera disponible prochainement.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
