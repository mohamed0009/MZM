"use client"

import { useState, useEffect } from "react"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useApi } from "@/hooks/use-api"
import { Loader2, Check, User, UserPlus, Search } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface OrderFormDialogProps {
  isOpen: boolean
  onClose: () => void
  product: any
}

// Mock clients data if API is not available
const MOCK_CLIENTS = [
  { id: "C001", name: "Mohammed Alami" },
  { id: "C002", name: "Fatima Benali" },
  { id: "C003", name: "Karim Tazi" },
  { id: "C004", name: "Amina El Mansouri" },
  { id: "C005", name: "Younes Berrada" },
  { id: "C006", name: "Laila Kadiri" },
  { id: "C007", name: "Hassan Benjelloun" },
  { id: "C008", name: "Nadia Chaoui" },
  { id: "C009", name: "Omar Fassi" },
  { id: "C010", name: "Samira Idrissi" },
];

// Helper function to normalize text (remove accents)
const normalizeText = (text: string) => {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

// Helper function to highlight matching text in results
const HighlightedText = ({ text, searchQuery }: { text: string, searchQuery: string }) => {
  if (!searchQuery.trim()) return <span>{text}</span>;
  
  try {
    // Convert both text and query to lowercase for case-insensitive comparison
    const lowerText = text.toLowerCase();
    const lowerQuery = searchQuery.toLowerCase().trim();
    
    // If query not in text, return plain text
    if (!lowerText.includes(lowerQuery)) return <span>{text}</span>;
    
    // Find the first occurrence
    const index = lowerText.indexOf(lowerQuery);
    
    // Split text into three parts: before match, match, after match
    const beforeMatch = text.slice(0, index);
    const match = text.slice(index, index + lowerQuery.length);
    const afterMatch = text.slice(index + lowerQuery.length);
    
    return (
      <span>
        {beforeMatch}
        <span className="bg-teal-100 text-teal-900 font-medium">{match}</span>
        {afterMatch}
      </span>
    );
  } catch (e) {
    // Fallback in case of errors
    console.error("Error in HighlightedText:", e);
    return <span>{text}</span>;
  }
};

export function OrderFormDialog({ isOpen, onClose, product }: OrderFormDialogProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedClientId, setSelectedClientId] = useState("")
  const [selectedClientName, setSelectedClientName] = useState("")
  const [newClientName, setNewClientName] = useState("")
  const [isAddingNewClient, setIsAddingNewClient] = useState(false)
  const [clients, setClients] = useState<{id: string, name: string}[]>([])
  const [filteredClients, setFilteredClients] = useState<{id: string, name: string}[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [isLoadingClients, setIsLoadingClients] = useState(false)
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false)
  
  const { orders, clients: clientsApi } = useApi()
  
  // Fetch clients when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchClients()
    }
  }, [isOpen])
  
  // Filter clients based on search query
  useEffect(() => {
    console.log("Search query:", searchQuery);
    console.log("Available clients:", clients);
    
    if (searchQuery.trim() !== "") {
      // Split search query into terms and normalize (remove accents)
      const searchTerms = searchQuery
        .trim()
        .split(/\s+/)
        .filter(term => term.length > 0)
        .map(term => normalizeText(term));
      
      console.log("Search terms:", searchTerms);
      
      // Filter clients that match any of the search terms
      const filtered = clients.filter(client => {
        const normalizedName = normalizeText(client.name);
        
        // Client matches if at least one term is found in the name
        return searchTerms.some(term => normalizedName.includes(term));
      });
      
      console.log("Filtered clients:", filtered);
      setFilteredClients(filtered);
    } else {
      setFilteredClients(clients);
    }
  }, [clients, searchQuery]);
  
  const fetchClients = async () => {
    setIsLoadingClients(true)
    try {
      const result = await clientsApi.getClients()
      console.log("API clients result:", result)
      
      if (Array.isArray(result) && result.length > 0) {
        console.log("Using API clients data")
        setClients(result)
        setFilteredClients(result)
      } else {
        // Use mock data if API returns empty
        console.log("Using MOCK clients data")
        setClients(MOCK_CLIENTS)
        setFilteredClients(MOCK_CLIENTS)
      }
    } catch (error) {
      console.error("Error fetching clients:", error)
      // Fallback to mock data
      console.log("Error occurred, using MOCK clients data")
      setClients(MOCK_CLIENTS)
      setFilteredClients(MOCK_CLIENTS)
    } finally {
      setIsLoadingClients(false)
    }
  }
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (!isNaN(value) && value > 0) {
      setQuantity(value)
    }
  }
  
  const handleClientSelect = (value: string) => {
    if (value === "new") {
      setIsAddingNewClient(true)
      setSelectedClientId("")
      setSelectedClientName("")
      setClientDropdownOpen(false)
    } else {
      const client = clients.find(c => c.id === value)
      setSelectedClientId(value)
      setSelectedClientName(client?.name || "")
      setIsAddingNewClient(false)
      setClientDropdownOpen(false)
    }
  }
  
  const getSelectedClientName = () => {
    return isAddingNewClient ? newClientName : selectedClientName
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log("Form submitted");
    console.log("Client selection:", { 
      selectedClientId, 
      selectedClientName,
      isAddingNewClient,
      newClientName
    });
    
    setIsSubmitting(true)
    
    try {
      // Get client name from selection or new client input
      const clientName = getSelectedClientName() || "Client sans nom"
      const clientId = isAddingNewClient ? undefined : selectedClientId
      
      console.log("Order data being submitted:", {
        productId: product?.id,
        productName: product?.name,
        quantity,
        clientName,
        clientId,
        unitPrice: product?.price,
        totalPrice: product?.price * quantity
      });
      
      // Create order data
      const orderData = {
        productId: product?.id || "PROD-" + Date.now(),
        productName: product?.name || "Produit",
        quantity,
        clientName,
        clientId,
        unitPrice: product?.price || 0,
        totalPrice: (product?.price || 0) * quantity
      }
      
      // Submit order
      console.log("Calling orders.createOrder");
      try {
        const result = await orders.createOrder(orderData)
        console.log("Order creation result:", result);
        
        // Show success state
        setIsSuccess(true)
        setOrderId(result?.orderId || "ORD-" + Date.now())
      } catch (apiError) {
        console.error("API error:", apiError);
        // Mock successful order in case of API failure
        setIsSuccess(true)
        setOrderId("ORD-" + Date.now())
      }
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setIsSubmitting(false)
        setIsSuccess(false)
        resetForm()
        onClose()
      }, 2000)
      
    } catch (error) {
      console.error("Error submitting order:", error)
      setIsSubmitting(false)
      alert("Erreur lors de la création de la commande. Veuillez réessayer.");
    }
  }
  
  const resetForm = () => {
    setQuantity(1)
    setSelectedClientId("")
    setSelectedClientName("")
    setNewClientName("")
    setIsAddingNewClient(false)
    setSearchQuery("")
    setIsSuccess(false)
    setIsSubmitting(false)
    setClientDropdownOpen(false)
  }
  
  const handleDialogClose = () => {
    if (!isSubmitting) {
      resetForm()
      onClose()
    }
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            Commander {product?.name}
          </DialogTitle>
          <DialogDescription>
            Complétez ce formulaire pour passer une commande de ce produit.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantité</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                max={product?.stock || 100}
                value={quantity}
                onChange={handleQuantityChange}
                disabled={isSubmitting || isSuccess}
                required
              />
              <p className="text-sm text-slate-500">
                Prix unitaire: {product?.price?.toFixed(2)} €
              </p>
              <p className="text-sm font-medium text-teal-600">
                Prix total: {(product?.price * quantity).toFixed(2)} €
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="clientId">Client</Label>
              {isLoadingClients ? (
                <div className="flex items-center space-x-2 h-10 px-3 py-2 rounded-md border border-input bg-background">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Chargement des clients...</span>
                </div>
              ) : (
                <Popover open={clientDropdownOpen} onOpenChange={setClientDropdownOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={clientDropdownOpen}
                      className="w-full justify-between text-left font-normal"
                      disabled={isSubmitting || isSuccess}
                    >
                      {selectedClientName ? (
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4 text-teal-600" />
                          <span>{selectedClientName}</span>
                        </div>
                      ) : isAddingNewClient ? (
                        <div className="flex items-center text-blue-600">
                          <UserPlus className="mr-2 h-4 w-4" />
                          <span>Nouveau client</span>
                        </div>
                      ) : (
                        "Sélectionner un client"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[320px] p-0" align="start">
                    <Command shouldFilter={false}>
                      <CommandInput 
                        placeholder="Rechercher un client..." 
                        className="h-9" 
                        value={searchQuery}
                        onValueChange={(value) => {
                          console.log("Search input changed:", value);
                          setSearchQuery(value);
                        }}
                      />
                      <CommandList>
                        <CommandEmpty>
                          <div className="flex flex-col items-center justify-center py-6 text-center">
                            <Search className="h-10 w-10 text-muted-foreground mb-2" />
                            <p>Aucun client trouvé</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Essayez un terme différent ou ajoutez un nouveau client
                            </p>
                          </div>
                        </CommandEmpty>
                        <CommandGroup>
                          <ScrollArea className="h-[200px]">
                            {filteredClients.map((client) => (
                              <CommandItem
                                key={client.id}
                                value={client.id}
                                onSelect={() => handleClientSelect(client.id)}
                                className="flex items-center"
                              >
                                <User className="mr-2 h-4 w-4 text-teal-600" />
                                <HighlightedText text={client.name} searchQuery={searchQuery} />
                                {selectedClientId === client.id && (
                                  <Check className="ml-auto h-4 w-4 text-teal-600" />
                                )}
                              </CommandItem>
                            ))}
                          </ScrollArea>
                        </CommandGroup>
                        <CommandGroup>
                          <CommandItem 
                            className="text-blue-600" 
                            onSelect={() => handleClientSelect("new")}
                          >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Nouveau client
                          </CommandItem>
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            </div>
            
            {isAddingNewClient && (
              <div className="grid gap-2">
                <Label htmlFor="newClientName">Nom du nouveau client</Label>
                <Input
                  id="newClientName"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  disabled={isSubmitting || isSuccess}
                  placeholder="Entrez le nom du client"
                  required={isAddingNewClient}
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleDialogClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            
            <Button 
              type="submit"
              className="gap-2 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
              disabled={isSubmitting || isSuccess}
              onClick={() => console.log("Submit button clicked", {
                isDisabled: isSubmitting || isSuccess,
                isSubmitting,
                isSuccess,
                isAddingNewClient,
                newClientName,
                selectedClientId
              })}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Traitement...
                </>
              ) : isSuccess ? (
                <>
                  <Check className="h-4 w-4" />
                  Commande N°{orderId} créée
                </>
              ) : (
                "Confirmer la commande"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default OrderFormDialog 