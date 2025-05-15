"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, Plus, Save, Search, ShoppingBag, Trash2, User } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Product {
  id: string
  name: string
  price: number
  category: string
  stock: number
}

interface Client {
  id: string
  name: string
  phone: string
  email?: string
}

export default function NewSalePage() {
  const router = useRouter()
  
  // Mock products and clients
  const [products, setProducts] = useState<Product[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    client: "",
    items: [{ productId: "", quantity: 1, price: 0 }],
    paymentMethod: "cash",
    note: ""
  })
  
  const [searchTerm, setSearchTerm] = useState("")
  const [total, setTotal] = useState(0)
  
  // Calculate total price whenever items change
  useEffect(() => {
    const calculatedTotal = formData.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity)
    }, 0)
    setTotal(calculatedTotal)
  }, [formData.items])
  
  // Fetch mock data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, you would fetch this from your API
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
        
        setProducts([
          { id: "1", name: "Paracétamol 500mg", price: 5.99, category: "Analgésiques", stock: 120 },
          { id: "2", name: "Amoxicilline 1g", price: 12.50, category: "Antibiotiques", stock: 45 },
          { id: "3", name: "Ibuprofène 400mg", price: 7.25, category: "Anti-inflammatoires", stock: 78 },
          { id: "4", name: "Doliprane 1000mg", price: 4.99, category: "Analgésiques", stock: 200 },
          { id: "5", name: "Oméprazole 20mg", price: 9.75, category: "Antiacides", stock: 60 }
        ])
        
        setClients([
          { id: "1", name: "Mohammed Alami", phone: "0612345678", email: "m.alami@example.com" },
          { id: "2", name: "Fatima Benali", phone: "0623456789", email: "f.benali@example.com" },
          { id: "3", name: "Ahmed Laroussi", phone: "0634567890" }
        ])
        
        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Erreur lors du chargement des données")
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  const handleClientChange = (clientId: string) => {
    setFormData({
      ...formData,
      client: clientId
    })
  }
  
  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: "", quantity: 1, price: 0 }]
    })
  }
  
  const handleRemoveItem = (index: number) => {
    const newItems = [...formData.items]
    newItems.splice(index, 1)
    setFormData({
      ...formData,
      items: newItems.length > 0 ? newItems : [{ productId: "", quantity: 1, price: 0 }]
    })
  }
  
  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items]
    
    if (field === "productId") {
      const selectedProduct = products.find(p => p.id === value)
      if (selectedProduct) {
        newItems[index] = { 
          ...newItems[index], 
          productId: value,
          price: selectedProduct.price
        }
      }
    } else {
      newItems[index] = { ...newItems[index], [field]: value }
    }
    
    setFormData({
      ...formData,
      items: newItems
    })
  }
  
  const handlePaymentMethodChange = (method: string) => {
    setFormData({
      ...formData,
      paymentMethod: method
    })
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    // Validate form
    if (!formData.client) {
      setError("Veuillez sélectionner un client")
      setIsSubmitting(false)
      return
    }
    
    if (formData.items.some(item => !item.productId)) {
      setError("Veuillez sélectionner un produit pour chaque article")
      setIsSubmitting(false)
      return
    }
    
    try {
      // Here would be your API call to create the sale
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
      
      console.log("Sale submitted:", formData)
      
      // Redirect to sales page
      router.push('/sales')
    } catch (err: any) {
      setError(err.message || "Une erreur s'est produite lors de l'enregistrement de la vente")
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Get product details from productId
  const getProductDetails = (productId: string) => {
    return products.find(p => p.id === productId)
  }
  
  // Get client details from clientId
  const getClientDetails = (clientId: string) => {
    return clients.find(c => c.id === clientId)
  }
  
  // Get initials for avatar
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Chargement des données...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto p-4 md:p-6 max-w-6xl">
      <div className="mb-6">
        <Link href="/sales" className="text-slate-600 hover:text-indigo-600 inline-flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux ventes
        </Link>
      </div>
      
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-indigo-100 p-2 rounded-full">
              <ShoppingBag className="h-5 w-5 text-indigo-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800">Nouvelle Vente</CardTitle>
          </div>
          <CardDescription>Enregistrez une nouvelle transaction de vente</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {/* Client Selection */}
            <div className="space-y-4">
              <Label>Client</Label>
              <Select value={formData.client} onValueChange={handleClientChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xs">
                            {getInitials(client.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{client.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {formData.client && (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-indigo-100">
                      <AvatarFallback className="bg-indigo-100 text-indigo-700">
                        {getInitials(getClientDetails(formData.client)?.name || "")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-slate-800">{getClientDetails(formData.client)?.name}</p>
                      <p className="text-sm text-slate-500">{getClientDetails(formData.client)?.phone}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Products Selection */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Articles</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddItem}
                  className="gap-1 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter un article
                </Button>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      placeholder="Rechercher un produit..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                {formData.items.map((item, index) => (
                  <div key={index} className="mb-4 p-4 bg-white rounded-lg border border-slate-200">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium text-slate-700">Article {index + 1}</h4>
                      {formData.items.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(index)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label>Produit</Label>
                        <Select 
                          value={item.productId} 
                          onValueChange={(value) => handleItemChange(index, "productId", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un produit" />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredProducts.map(product => (
                              <SelectItem key={product.id} value={product.id}>
                                <div className="flex items-center justify-between w-full">
                                  <span>{product.name}</span>
                                  <Badge className="ml-2 bg-slate-100 text-slate-700">
                                    {product.price.toFixed(2)} €
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Quantité</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value) || 1)}
                        />
                      </div>
                    </div>
                    
                    {item.productId && (
                      <div className="mt-4 flex justify-between items-center">
                        <div className="text-sm text-slate-500">
                          {getProductDetails(item.productId)?.category}
                        </div>
                        <div className="font-medium text-indigo-700">
                          {(getProductDetails(item.productId)?.price || 0) * item.quantity} €
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="space-y-4">
              <Label>Méthode de paiement</Label>
              <div className="grid grid-cols-3 gap-4">
                <Button
                  type="button"
                  variant={formData.paymentMethod === "cash" ? "default" : "outline"}
                  className={formData.paymentMethod === "cash" ? "bg-indigo-600 hover:bg-indigo-700" : ""}
                  onClick={() => handlePaymentMethodChange("cash")}
                >
                  Espèces
                </Button>
                <Button
                  type="button"
                  variant={formData.paymentMethod === "card" ? "default" : "outline"}
                  className={formData.paymentMethod === "card" ? "bg-indigo-600 hover:bg-indigo-700" : ""}
                  onClick={() => handlePaymentMethodChange("card")}
                >
                  Carte
                </Button>
                <Button
                  type="button"
                  variant={formData.paymentMethod === "transfer" ? "default" : "outline"}
                  className={formData.paymentMethod === "transfer" ? "bg-indigo-600 hover:bg-indigo-700" : ""}
                  onClick={() => handlePaymentMethodChange("transfer")}
                >
                  Virement
                </Button>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="font-semibold mb-3 text-slate-800">Récapitulatif</h3>
              
              <div className="space-y-2">
                {formData.items.map((item, index) => (
                  item.productId ? (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {getProductDetails(item.productId)?.name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        {(getProductDetails(item.productId)?.price || 0) * item.quantity} €
                      </span>
                    </div>
                  ) : null
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-indigo-700">{total.toFixed(2)} €</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="border-t border-slate-100 bg-slate-50 gap-2 flex justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push('/sales')}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Traitement...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Finaliser la vente
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 