"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useApi } from "@/hooks/use-api"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  AlertCircle, 
  ArrowLeft, 
  Calendar, 
  CheckCircle2, 
  Edit, 
  Loader2, 
  Package, 
  Pill, 
  ShoppingCart, 
  Tag, 
  AlertTriangle,
  Info,
  Heart 
} from "lucide-react"
import Link from "next/link"
import { MOCK_PRODUCTS } from "@/lib/mock-data"
import OrderFormDialog from "@/components/order-form-dialog"

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  expiry: string
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { inventory } = useApi()
  const { id } = params
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUsingMockData, setIsUsingMockData] = useState(false)
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false)
  
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const fetchProduct = async () => {
      // Reset states at the beginning
      if (isMounted) {
        setLoading(true);
        setError(null);
      }
      
      try {
        console.log(`Attempting to fetch product ${id}...`);
        
        // Immediately get mock data for quick fallback
        const mockProduct = MOCK_PRODUCTS.find((p: any) => p.id === id);
        if (mockProduct && isMounted) {
          console.log('Found matching mock product, using as initial data');
          setProduct(mockProduct);
          setIsUsingMockData(true);
          setLoading(false);
        }
        
        // Still try the API to get real data
        try {
          console.log('Calling API...');
          const productData = await inventory.getProduct(id);
          
          if (productData && isMounted) {
            console.log('API response received, updating product data');
            setProduct(productData);
            setIsUsingMockData(false);
          }
        } catch (apiError) {
          console.error('API request failed:', apiError);
          // We already loaded mock data, so just log the error
          if (!mockProduct && isMounted) {
            setError("Produit introuvable");
          }
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        if (isMounted) {
          setError("Une erreur s'est produite");
        }
      } finally {
        clearTimeout(timeoutId);
        if (isMounted) {
          console.log('Setting loading to false');
          setLoading(false);
        }
      }
    };

    fetchProduct();
    
    // Cleanup function
    return () => {
      console.log('Cleanup: aborting requests and preventing state updates');
      isMounted = false;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [id, inventory]);
  
  // Format price with euro symbol
  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} €`
  }
  
  // Get stock status indicator
  const getStockStatus = (stock: number) => {
    if (stock < 100) {
      return (
        <Badge className="bg-red-50 text-red-700 border border-red-200 hover:bg-red-100">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Stock bas
        </Badge>
      )
    } else if (stock < 200) {
      return (
        <Badge className="bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100">
          <AlertCircle className="h-3 w-3 mr-1" />
          Stock moyen
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-green-50 text-green-700 border border-green-200 hover:bg-green-100">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Stock bon
        </Badge>
      )
    }
  }
  
  if (loading) {
    return (
      <div className="max-w-full">
        <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-4 md:p-6 mb-6 rounded-lg shadow-md">
          <div className="container mx-auto">
            <Link href="/inventory" className="text-white hover:text-slate-100 inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l'inventaire
            </Link>
          </div>
        </div>
        
        <div className="container mx-auto px-4">
          <Card className="border-slate-100 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center min-h-[50vh] py-12">
              <Loader2 className="h-8 w-8 animate-spin text-teal-600 mb-4" />
              <p className="text-slate-600">Chargement du produit...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="max-w-full">
        <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-4 md:p-6 mb-6 rounded-lg shadow-md">
          <div className="container mx-auto">
            <Link href="/inventory" className="text-white hover:text-slate-100 inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l'inventaire
            </Link>
          </div>
        </div>
        
        <div className="container mx-auto px-4">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-red-700 mb-2">Erreur</h2>
                <p className="text-red-600">{error}</p>
                <Button 
                  onClick={() => router.push('/inventory')}
                  className="mt-6"
                  variant="outline"
                >
                  Retourner à l'inventaire
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  
  if (!product) {
    return (
      <div className="max-w-full">
        <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-4 md:p-6 mb-6 rounded-lg shadow-md">
          <div className="container mx-auto">
            <Link href="/inventory" className="text-white hover:text-slate-100 inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l'inventaire
            </Link>
          </div>
        </div>
        
        <div className="container mx-auto px-4">
          <Card className="border-amber-200">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Info className="h-12 w-12 text-amber-500 mb-4" />
                <h2 className="text-xl font-bold text-amber-700 mb-2">Produit introuvable</h2>
                <p className="text-amber-600">Le produit demandé n'existe pas ou a été supprimé.</p>
                <Button 
                  onClick={() => router.push('/inventory')}
                  className="mt-6"
                  variant="outline"
                >
                  Retourner à l'inventaire
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  
  return (
    <div className="max-w-full">
      <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-4 md:p-6 mb-6 rounded-lg shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/inventory" className="text-white hover:text-slate-100 inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l'inventaire
            </Link>
            
            {isUsingMockData && (
              <Badge variant="outline" className="ml-4 text-white border-white/30 text-xs bg-white/10">
                Mode démo
              </Badge>
            )}
          </div>
          
          <Button variant="ghost" className="text-white hover:bg-white/20 hover:text-white p-2 h-9 w-9 rounded-full">
            <Heart className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <Card className="border-slate-100 shadow-sm mb-8">
          <CardHeader className="pb-2 bg-white">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <Pill className="h-5 w-5 text-teal-600" />
                  {product.name}
                </CardTitle>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {product.category || 'Non catégorisé'}
                  </Badge>
                  {getStockStatus(product.stock)}
                </div>
              </div>
              
              <Link href={`/inventory/edit/${product.id}`}>
                <Button variant="outline" className="h-9 gap-1 bg-white border-slate-200 hover:bg-slate-50">
                  <Edit className="h-4 w-4" />
                  <span>Modifier</span>
                </Button>
              </Link>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1 p-4 bg-slate-50 rounded-lg">
                <div className="text-sm font-medium text-slate-500 flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-teal-600" />
                  Prix
                </div>
                <div className="text-xl font-bold text-slate-800">{formatPrice(product.price)}</div>
              </div>
              
              <div className="space-y-1 p-4 bg-slate-50 rounded-lg">
                <div className="text-sm font-medium text-slate-500 flex items-center">
                  <Package className="h-4 w-4 mr-2 text-teal-600" />
                  Stock
                </div>
                <div className="text-xl font-bold text-slate-800">{product.stock} unités</div>
              </div>
              
              <div className="space-y-1 p-4 bg-slate-50 rounded-lg">
                <div className="text-sm font-medium text-slate-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-teal-600" />
                  Date d'expiration
                </div>
                <div className="text-xl font-bold text-slate-800">{product.expiry || 'Non spécifiée'}</div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium text-slate-800 mb-2 flex items-center">
                <Info className="h-4 w-4 mr-2 text-teal-600" />
                Description
              </h3>
              <Separator className="mb-4" />
              <p className="text-slate-600 whitespace-pre-line">
                {product.description || 'Aucune description disponible pour ce produit.'}
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end border-t bg-slate-50 p-6 gap-2">
            <Button 
              variant="outline" 
              onClick={() => router.push('/inventory')}
              className="bg-white"
            >
              Retour
            </Button>
            
            <Button 
              className="gap-1 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white"
              onClick={() => setIsOrderFormOpen(true)}
            >
              <ShoppingCart className="h-4 w-4" />
              Commander
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {product && (
        <OrderFormDialog 
          isOpen={isOrderFormOpen} 
          onClose={() => setIsOrderFormOpen(false)}
          product={product}
        />
      )}
    </div>
  )
} 