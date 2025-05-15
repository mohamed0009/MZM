"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, Save, Trash2, XCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"

// Mock product data
const PRODUCTS = [
  { id: "1", name: "Paracétamol 500mg", price: 8.50, stock: 320 },
  { id: "2", name: "Ibuprofène 400mg", price: 10.20, stock: 150 },
  { id: "3", name: "Amoxicilline 1g", price: 15.75, stock: 80 },
  { id: "4", name: "Oméprazole 20mg", price: 12.40, stock: 110 },
  { id: "5", name: "Loratadine 10mg", price: 9.30, stock: 95 },
];

// Mock suppliers
const SUPPLIERS = [
  { id: "1", name: "MedPharm Supplies", address: "12 Rue de la Santé, 75001 Paris" },
  { id: "2", name: "PharmaSolutions", address: "25 Avenue des Médicaments, 69002 Lyon" },
  { id: "3", name: "BioMed Distributors", address: "8 Boulevard des Sciences, 33000 Bordeaux" },
  { id: "4", name: "GlobalMed Inc.", address: "18 Rue Internationale, 31000 Toulouse" },
  { id: "5", name: "PharmaTech", address: "42 Rue de l'Innovation, 59000 Lille" },
];

export default function AddOrderPage() {
  const router = useRouter();
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [orderItems, setOrderItems] = useState<Array<{
    productId: string,
    name: string,
    quantity: number,
    price: number,
    total: number
  }>>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  
  // Calculate order total
  const orderTotal = orderItems.reduce((sum, item) => sum + item.total, 0);
  
  // Handle adding product to order
  const addProductToOrder = () => {
    if (!selectedProduct || quantity <= 0) return;
    
    const product = PRODUCTS.find(p => p.id === selectedProduct);
    if (!product) return;
    
    const newItem = {
      productId: product.id,
      name: product.name,
      quantity: quantity,
      price: product.price,
      total: product.price * quantity
    };
    
    setOrderItems(prev => [...prev, newItem]);
    setSelectedProduct("");
    setQuantity(1);
  };
  
  // Handle removing product from order
  const removeItem = (index: number) => {
    setOrderItems(prev => prev.filter((_, i) => i !== index));
  };
  
  // Handle order submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSupplier || orderItems.length === 0) {
      alert("Veuillez sélectionner un fournisseur et ajouter au moins un produit.");
      return;
    }
    
    // In a real app, this would send data to the API
    console.log("Submitting order:", {
      supplier: selectedSupplier,
      items: orderItems,
      total: orderTotal
    });
    
    // Show success message and navigate back
    alert("Commande créée avec succès !");
    router.push("/orders");
  };
  
  return (
    <div className="container mx-auto p-4 md:p-6 max-w-5xl">
      <div className="mb-6">
        <Link href="/orders" className="text-slate-600 hover:text-teal-600 inline-flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux commandes
        </Link>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Nouvelle commande</CardTitle>
                <CardDescription>Créez une nouvelle commande en sélectionnant un fournisseur et des produits.</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier">Fournisseur *</Label>
                  <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                    <SelectTrigger id="supplier">
                      <SelectValue placeholder="Sélectionner un fournisseur" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPLIERS.map(supplier => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {selectedSupplier && (
                    <p className="text-xs text-slate-500 italic mt-1">
                      {SUPPLIERS.find(s => s.id === selectedSupplier)?.address}
                    </p>
                  )}
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Produits</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="sm:col-span-2">
                      <Label htmlFor="product">Produit</Label>
                      <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                        <SelectTrigger id="product">
                          <SelectValue placeholder="Sélectionner un produit" />
                        </SelectTrigger>
                        <SelectContent>
                          {PRODUCTS.map(product => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} - {product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="quantity">Quantité</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    
                    <div className="flex items-end">
                      <Button
                        type="button"
                        onClick={addProductToOrder}
                        className="w-full"
                        variant="outline"
                        disabled={!selectedProduct || quantity <= 0}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter
                      </Button>
                    </div>
                  </div>
                  
                  {orderItems.length > 0 ? (
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader className="bg-slate-50">
                          <TableRow>
                            <TableHead>Produit</TableHead>
                            <TableHead className="text-right">Prix unitaire</TableHead>
                            <TableHead className="text-right">Quantité</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orderItems.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell className="text-right">
                                {item.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                              </TableCell>
                              <TableCell className="text-right">{item.quantity}</TableCell>
                              <TableCell className="text-right font-medium">
                                {item.total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                              </TableCell>
                              <TableCell>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => removeItem(index)}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="border rounded-md p-8 text-center text-slate-500 bg-slate-50/50">
                      <p>Aucun produit ajouté à la commande</p>
                      <p className="text-xs mt-1">Utilisez le formulaire ci-dessus pour sélectionner des produits</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Résumé</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500">Fournisseur</p>
                  <p className="font-medium">
                    {selectedSupplier 
                      ? SUPPLIERS.find(s => s.id === selectedSupplier)?.name 
                      : "Non sélectionné"}
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm text-slate-500">Produits</p>
                  <p className="font-medium">{orderItems.length}</p>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm text-slate-500">Total</p>
                  <p className="text-xl font-bold text-slate-900">
                    {orderTotal.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </p>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between border-t bg-slate-50">
                <Button
                  type="button"
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  onClick={() => router.push('/orders')}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
                
                <Button 
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                  disabled={!selectedSupplier || orderItems.length === 0}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
} 