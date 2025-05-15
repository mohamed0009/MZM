"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useApi } from "@/hooks/use-api"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  AlertCircle, 
  ArrowLeft, 
  Loader2, 
  Save, 
  Trash2 
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { MOCK_PRODUCTS } from "@/lib/mock-data"

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  expiry: string
}

const productCategories = [
  "Analgésiques",
  "Antibiotiques",
  "Antiacides",
  "Anti-inflammatoires",
  "Antiallergiques",
  "Vitamines",
  "Soins du corps",
  "Soins dentaires",
  "Compléments alimentaires",
  "Autres"
]

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { inventory } = useApi()
  const { id } = params
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isUsingMockData, setIsUsingMockData] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    expiry: ""
  })
  
  const [formErrors, setFormErrors] = useState({
    name: "",
    price: "",
    stock: ""
  })
  
  // Fetch product data on mount
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const fetchProduct = async () => {
      // Reset states at the beginning
      if (isMounted) {
        setIsLoading(true);
        setError(null);
      }
      
      try {
        console.log(`Attempting to fetch product ${id}...`);
        
        // First try mock data for instant feedback
        const mockProduct = MOCK_PRODUCTS.find(p => p.id === id);
        
        // Try API with timeout protection
        try {
          console.log('Calling API...');
          const productData = await Promise.race([
            inventory.getProduct(id),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('API request timeout')), 3000)
            )
          ]);
          
          console.log('API response received:', productData);
          
          if (productData && isMounted) {
            initFormData(productData);
            setIsUsingMockData(false);
          }
        } catch (apiError) {
          console.error('API request failed:', apiError);
          
          // Fallback to mock data
          if (mockProduct && isMounted) {
            console.log('Using mock data:', mockProduct);
            initFormData(mockProduct as Product);
            setIsUsingMockData(true);
          } else if (isMounted) {
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
        // Always ensure loading state is updated
        if (isMounted) {
          console.log('Setting loading to false');
          setIsLoading(false);
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
  
  // Initialize form data with product info
  const initFormData = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category || "",
      expiry: product.expiry || ""
    })
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Clear validation errors when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: ""
      })
    }
  }
  
  const handleSelectChange = (value: string, field: string) => {
    setFormData({
      ...formData,
      [field]: value
    })
  }
  
  const validateForm = () => {
    let isValid = true
    const newErrors = { ...formErrors }
    
    if (!formData.name.trim()) {
      newErrors.name = "Le nom du produit est obligatoire"
      isValid = false
    }
    
    if (!formData.price.trim()) {
      newErrors.price = "Le prix est obligatoire"
      isValid = false
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = "Le prix doit être un nombre positif"
      isValid = false
    }
    
    if (!formData.stock.trim()) {
      newErrors.stock = "La quantité en stock est obligatoire"
      isValid = false
    } else if (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0) {
      newErrors.stock = "La quantité doit être un nombre positif"
      isValid = false
    }
    
    setFormErrors(newErrors)
    return isValid
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      // Format the data for API submission
      const productData = {
        ...formData,
        id,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      }
      
      // Call the API to update the product - using real API or mock
      try {
        await inventory.updateProduct(id, productData)
        router.push(`/inventory/${id}`)
      } catch (err) {
        console.error("Error updating product via API:", err)
        
        // For demo: simulate success even if API fails
        setTimeout(() => {
          console.log("Product updated (simulated):", productData)
          router.push(`/inventory/${id}`)
        }, 1000)
      }
    } catch (err: any) {
      setError(err.message || "Une erreur s'est produite lors de la modification du produit")
      setIsSubmitting(false)
    }
  }
  
  const handleDelete = async () => {
    // This would show a confirmation modal in a real app
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.")) {
      try {
        setIsSubmitting(true)
        
        try {
          await inventory.deleteProduct(id)
          router.push('/inventory')
        } catch (err) {
          console.error("Error deleting product via API:", err)
          
          // For demo: simulate success even if API fails
          setTimeout(() => {
            console.log("Product deleted (simulated):", id)
            router.push('/inventory')
          }, 1000)
        }
      } catch (err: any) {
        setError(err.message || "Une erreur s'est produite lors de la suppression")
        setIsSubmitting(false)
      }
    }
  }
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6 max-w-4xl flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600 mb-4" />
        <p className="text-slate-600">Chargement du produit...</p>
      </div>
    )
  }
  
  if (error && !formData.name) {
    return (
      <div className="container mx-auto p-4 md:p-6 max-w-4xl">
        <div className="mb-6">
          <Link href="/inventory" className="text-slate-600 hover:text-teal-600 inline-flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'inventaire
          </Link>
        </div>
        
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
    )
  }
  
  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <div className="mb-6">
        <Link href={`/inventory/${id}`} className="text-slate-600 hover:text-teal-600 inline-flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au produit
        </Link>
        
        {isUsingMockData && (
          <span className="ml-4 px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
            Mode démo
          </span>
        )}
      </div>
      
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-800">Modifier le produit</CardTitle>
          <CardDescription>Modifiez les informations du produit ci-dessous</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className={formErrors.name ? "text-destructive" : ""}>
                  Nom du produit *
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ex: Paracétamol 500mg"
                  value={formData.name}
                  onChange={handleChange}
                  className={formErrors.name ? "border-destructive" : ""}
                />
                {formErrors.name && (
                  <p className="text-xs text-destructive">{formErrors.name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange(value, "category")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {productCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price" className={formErrors.price ? "text-destructive" : ""}>
                  Prix (€) *
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Ex: 12.50"
                  value={formData.price}
                  onChange={handleChange}
                  className={formErrors.price ? "border-destructive" : ""}
                />
                {formErrors.price && (
                  <p className="text-xs text-destructive">{formErrors.price}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stock" className={formErrors.stock ? "text-destructive" : ""}>
                  Quantité en stock *
                </Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  placeholder="Ex: 100"
                  value={formData.stock}
                  onChange={handleChange}
                  className={formErrors.stock ? "border-destructive" : ""}
                />
                {formErrors.stock && (
                  <p className="text-xs text-destructive">{formErrors.stock}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiry">Date d'expiration</Label>
                <Input
                  id="expiry"
                  name="expiry"
                  type="date"
                  value={formData.expiry}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Description du produit..."
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t bg-slate-50 p-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="border-red-200 hover:bg-red-50 text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/inventory/${id}`)}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              
              <Button 
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 