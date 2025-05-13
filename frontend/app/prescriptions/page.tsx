"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Search, Plus, FileText, ListChecks, Clock } from "lucide-react"
import { prescriptionsAdapter, clientsAdapter, productsAdapter } from "@/lib/adapter"
import { formatDate } from "@/lib/utils"

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dialog, setDialog] = useState({ isOpen: false, isSaving: false, mode: "create" })
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null)
  const [newPrescription, setNewPrescription] = useState({
    clientId: "",
    doctorName: "",
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: "PENDING",
    notes: "",
    medications: [{ productId: "", quantity: 1, instructions: "" }]
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Charger les données principales
      const prescriptionsResponse = await prescriptionsAdapter.getAll()
      const clientsResponse = await clientsAdapter.getAll()
      const productsResponse = await productsAdapter.getAll()
      
      if (prescriptionsResponse.success && prescriptionsResponse.data) {
        setPrescriptions(prescriptionsResponse.data)
      }
      
      if (clientsResponse.success && clientsResponse.data) {
        setClients(clientsResponse.data)
      }
      
      if (productsResponse.success && productsResponse.data) {
        setProducts(productsResponse.data)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error)
      // Charger des données fictives pour la démonstration
      setPrescriptions(getMockPrescriptions())
      setClients(getMockClients())
      setProducts(getMockProducts())
    } finally {
      setLoading(false)
    }
  }

  const handleAddMedication = () => {
    setNewPrescription({
      ...newPrescription,
      medications: [...newPrescription.medications, { productId: "", quantity: 1, instructions: "" }]
    })
  }

  const handleRemoveMedication = (index: number) => {
    const updatedMedications = [...newPrescription.medications]
    updatedMedications.splice(index, 1)
    setNewPrescription({ ...newPrescription, medications: updatedMedications })
  }

  const handleMedicationChange = (index: number, field: string, value: any) => {
    const updatedMedications = [...newPrescription.medications]
    updatedMedications[index] = { ...updatedMedications[index], [field]: value }
    setNewPrescription({ ...newPrescription, medications: updatedMedications })
  }

  const handleSavePrescription = async () => {
    setDialog({ ...dialog, isSaving: true })
    
    try {
      const result = await prescriptionsAdapter.create(newPrescription)
      
      if (result.success) {
        // Recharger les données
        loadData()
        setDialog({ isOpen: false, isSaving: false, mode: "create" })
        resetForm()
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la prescription:", error)
    } finally {
      setDialog({ ...dialog, isSaving: false })
    }
  }

  const handleCompletePrescription = async (id: string | number) => {
    try {
      const result = await prescriptionsAdapter.complete(id)
      if (result.success) {
        loadData()
      }
    } catch (error) {
      console.error("Erreur lors de la complétion de la prescription:", error)
    }
  }

  const handleCancelPrescription = async (id: string | number) => {
    try {
      const result = await prescriptionsAdapter.cancel(id)
      if (result.success) {
        loadData()
      }
    } catch (error) {
      console.error("Erreur lors de l'annulation de la prescription:", error)
    }
  }

  const resetForm = () => {
    setNewPrescription({
      clientId: "",
      doctorName: "",
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: "PENDING",
      notes: "",
      medications: [{ productId: "", quantity: 1, instructions: "" }]
    })
  }

  const openDetailsDialog = (prescription: any) => {
    setSelectedPrescription(prescription)
    setDialog({ isOpen: true, isSaving: false, mode: "view" })
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'default'
      case 'PENDING': return 'outline'
      case 'CANCELLED': return 'destructive'
      default: return 'secondary'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'Complétée'
      case 'PENDING': return 'En attente'
      case 'CANCELLED': return 'Annulée'
      default: return status
    }
  }

  const filteredPrescriptions = prescriptions
    .filter(prescription => {
      // Filtrer par statut
      if (statusFilter !== "all") {
        return prescription.status === statusFilter
      }
      return true
    })
    .filter(prescription => {
      // Filtrer par recherche
      if (!searchQuery) return true
      
      const query = searchQuery.toLowerCase()
      const client = clients.find(c => c.id === prescription.clientId)
      
      return prescription.id.toString().includes(query) || 
             (client && client.name.toLowerCase().includes(query)) ||
             prescription.doctorName.toLowerCase().includes(query)
    })

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Gestion des Prescriptions</h1>
      
      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {prescriptions.length}
            </div>
            <p className="text-xs text-muted-foreground">
              prescriptions enregistrées
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En Attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {prescriptions.filter(p => p.status === 'PENDING').length}
            </div>
            <p className="text-xs text-muted-foreground">
              à traiter
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Complétées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {prescriptions.filter(p => p.status === 'COMPLETED').length}
            </div>
            <p className="text-xs text-muted-foreground">
              traitées avec succès
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Expirées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {prescriptions.filter(p => {
                const today = new Date()
                return new Date(p.expiryDate) < today && p.status === 'PENDING'
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              prescriptions expirées
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Filtres et Recherche */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="flex gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="PENDING">En attente</SelectItem>
              <SelectItem value="COMPLETED">Complétées</SelectItem>
              <SelectItem value="CANCELLED">Annulées</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Dialog 
          open={dialog.isOpen && dialog.mode === "create"} 
          onOpenChange={(open) => setDialog({ ...dialog, isOpen: open })}
        >
          <DialogTrigger asChild>
            <Button onClick={() => setDialog({ isOpen: true, isSaving: false, mode: "create" })}>
              <Plus className="mr-2 h-4 w-4" /> Nouvelle Prescription
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Ajouter une Prescription</DialogTitle>
              <DialogDescription>
                Remplissez les informations de la prescription ci-dessous.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Patient</Label>
                  <Select 
                    value={newPrescription.clientId} 
                    onValueChange={(value) => setNewPrescription({ ...newPrescription, clientId: value })}
                  >
                    <SelectTrigger id="client">
                      <SelectValue placeholder="Sélectionner un patient" />
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
                  <Label htmlFor="doctor">Médecin</Label>
                  <Input
                    id="doctor"
                    value={newPrescription.doctorName}
                    onChange={(e) => setNewPrescription({ ...newPrescription, doctorName: e.target.value })}
                    placeholder="Nom du médecin"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="issueDate">Date d'émission</Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={newPrescription.issueDate}
                    onChange={(e) => setNewPrescription({ ...newPrescription, issueDate: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Date d'expiration</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={newPrescription.expiryDate}
                    onChange={(e) => setNewPrescription({ ...newPrescription, expiryDate: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <Label className="mb-2 block">Médicaments</Label>
                {newPrescription.medications.map((medication, index) => (
                  <div key={index} className="grid grid-cols-[3fr,1fr,3fr,auto] gap-2 mb-2">
                    <Select 
                      value={medication.productId} 
                      onValueChange={(value) => handleMedicationChange(index, 'productId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Médicament" />
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
                      value={medication.quantity}
                      onChange={(e) => handleMedicationChange(index, 'quantity', parseInt(e.target.value))}
                      placeholder="Qté"
                    />
                    
                    <Input
                      value={medication.instructions}
                      onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                      placeholder="Instructions (ex: 1x/jour)"
                    />
                    
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleRemoveMedication(index)}
                      disabled={newPrescription.medications.length === 1}
                    >
                      &times;
                    </Button>
                  </div>
                ))}
                
                <Button variant="outline" onClick={handleAddMedication} className="mt-2 w-full">
                  + Ajouter un médicament
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newPrescription.notes}
                  onChange={(e) => setNewPrescription({ ...newPrescription, notes: e.target.value })}
                  placeholder="Notes additionnelles"
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialog({ ...dialog, isOpen: false })}>
                Annuler
              </Button>
              <Button onClick={handleSavePrescription} disabled={dialog.isSaving}>
                {dialog.isSaving ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Dialogue de détails */}
        <Dialog 
          open={dialog.isOpen && dialog.mode === "view"} 
          onOpenChange={(open) => setDialog({ ...dialog, isOpen: open })}
        >
          {selectedPrescription && (
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Détails de la Prescription</DialogTitle>
                <DialogDescription>
                  Prescription #{selectedPrescription.id}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Patient</h3>
                    <p className="text-base">
                      {clients.find(c => c.id === selectedPrescription.clientId)?.name || "Patient inconnu"}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Médecin</h3>
                    <p className="text-base">{selectedPrescription.doctorName}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Date d'émission</h3>
                    <p className="text-base">{formatDate(selectedPrescription.issueDate)}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Date d'expiration</h3>
                    <p className="text-base">{formatDate(selectedPrescription.expiryDate)}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Statut</h3>
                    <Badge variant={getStatusBadgeVariant(selectedPrescription.status)}>
                      {getStatusLabel(selectedPrescription.status)}
                    </Badge>
                  </div>
                </div>
                
                <div className="mt-2">
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">Médicaments</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Médicament</TableHead>
                        <TableHead>Quantité</TableHead>
                        <TableHead>Instructions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedPrescription.medications.map((medication: any, index: number) => {
                        const product = products.find(p => p.id === medication.productId)
                        return (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{product?.name || "Produit inconnu"}</TableCell>
                            <TableCell>{medication.quantity}</TableCell>
                            <TableCell>{medication.instructions}</TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
                
                {selectedPrescription.notes && (
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Notes</h3>
                    <p className="text-base">{selectedPrescription.notes}</p>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <div className="flex gap-2">
                  {selectedPrescription.status === 'PENDING' && (
                    <>
                      <Button 
                        variant="destructive" 
                        onClick={() => {
                          handleCancelPrescription(selectedPrescription.id)
                          setDialog({ ...dialog, isOpen: false })
                        }}
                      >
                        Annuler
                      </Button>
                      <Button 
                        onClick={() => {
                          handleCompletePrescription(selectedPrescription.id)
                          setDialog({ ...dialog, isOpen: false })
                        }}
                      >
                        Compléter
                      </Button>
                    </>
                  )}
                  {selectedPrescription.status !== 'PENDING' && (
                    <Button 
                      variant="outline" 
                      onClick={() => setDialog({ ...dialog, isOpen: false })}
                    >
                      Fermer
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>
      </div>
      
      {/* Onglets */}
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">
            <FileText className="h-4 w-4 mr-2" />
            Toutes
          </TabsTrigger>
          <TabsTrigger value="pending">
            <Clock className="h-4 w-4 mr-2" />
            En attente
          </TabsTrigger>
          <TabsTrigger value="completed">
            <ListChecks className="h-4 w-4 mr-2" />
            Complétées
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <PrescriptionsList 
            prescriptions={filteredPrescriptions} 
            clients={clients}
            products={products}
            loading={loading}
            onViewDetails={openDetailsDialog}
            onComplete={handleCompletePrescription}
            onCancel={handleCancelPrescription}
          />
        </TabsContent>
        
        <TabsContent value="pending">
          <PrescriptionsList 
            prescriptions={filteredPrescriptions.filter(p => p.status === 'PENDING')} 
            clients={clients}
            products={products}
            loading={loading}
            onViewDetails={openDetailsDialog}
            onComplete={handleCompletePrescription}
            onCancel={handleCancelPrescription}
          />
        </TabsContent>
        
        <TabsContent value="completed">
          <PrescriptionsList 
            prescriptions={filteredPrescriptions.filter(p => p.status === 'COMPLETED')} 
            clients={clients}
            products={products}
            loading={loading}
            onViewDetails={openDetailsDialog}
            onComplete={handleCompletePrescription}
            onCancel={handleCancelPrescription}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function PrescriptionsList({ 
  prescriptions, 
  clients, 
  products,
  loading, 
  onViewDetails,
  onComplete,
  onCancel
}: {
  prescriptions: any[], 
  clients: any[],
  products: any[],
  loading: boolean,
  onViewDetails: (prescription: any) => void,
  onComplete: (id: string | number) => void,
  onCancel: (id: string | number) => void
}) {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'default'
      case 'PENDING': return 'outline'
      case 'CANCELLED': return 'destructive'
      default: return 'secondary'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'Complétée'
      case 'PENDING': return 'En attente'
      case 'CANCELLED': return 'Annulée'
      default: return status
    }
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Médecin</TableHead>
              <TableHead>Date d'émission</TableHead>
              <TableHead>Expiration</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">Chargement des données...</TableCell>
              </TableRow>
            ) : prescriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">Aucune prescription trouvée</TableCell>
              </TableRow>
            ) : (
              prescriptions.map((prescription) => {
                const client = clients.find(c => c.id === prescription.clientId)
                const isExpired = new Date(prescription.expiryDate) < new Date() && prescription.status === 'PENDING'
                
                return (
                  <TableRow key={prescription.id} className={isExpired ? "bg-red-50" : ""}>
                    <TableCell>{prescription.id}</TableCell>
                    <TableCell>{client?.name || "Patient inconnu"}</TableCell>
                    <TableCell>{prescription.doctorName}</TableCell>
                    <TableCell>{formatDate(prescription.issueDate)}</TableCell>
                    <TableCell className={isExpired ? "text-red-500 font-medium" : ""}>
                      {formatDate(prescription.expiryDate)}
                      {isExpired && " (Expirée)"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(prescription.status)}>
                        {getStatusLabel(prescription.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => onViewDetails(prescription)}>
                          Détails
                        </Button>
                        
                        {prescription.status === 'PENDING' && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => onComplete(prescription.id)}>
                              Compléter
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => onCancel(prescription.id)}>
                              Annuler
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// Données fictives pour démonstration
function getMockPrescriptions() {
  return [
    {
      id: 1,
      clientId: "1",
      doctorName: "Dr. Ahmed Benjelloun",
      issueDate: "2023-05-01",
      expiryDate: "2023-06-01",
      status: "COMPLETED",
      notes: "Prendre les médicaments après les repas",
      medications: [
        { productId: "1", quantity: 2, instructions: "1 comprimé matin et soir" },
        { productId: "2", quantity: 1, instructions: "1 comprimé par jour pendant 7 jours" }
      ]
    },
    {
      id: 2,
      clientId: "2",
      doctorName: "Dr. Leila Tazi",
      issueDate: "2023-05-15",
      expiryDate: "2023-06-15",
      status: "PENDING",
      notes: "",
      medications: [
        { productId: "3", quantity: 1, instructions: "Prendre en cas de douleur, max 3 fois par jour" }
      ]
    },
    {
      id: 3,
      clientId: "3",
      doctorName: "Dr. Karim Mansouri",
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: "PENDING",
      notes: "Patient allergique à la pénicilline",
      medications: [
        { productId: "1", quantity: 1, instructions: "1 comprimé toutes les 8 heures" },
        { productId: "4", quantity: 3, instructions: "1 comprimé avant chaque repas" }
      ]
    },
    {
      id: 4,
      clientId: "1",
      doctorName: "Dr. Ahmed Benjelloun",
      issueDate: "2023-04-01",
      expiryDate: "2023-05-01",
      status: "PENDING",
      notes: "",
      medications: [
        { productId: "2", quantity: 1, instructions: "1 comprimé par jour" }
      ]
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