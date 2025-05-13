"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Filter, Pencil, Plus, Search, ShoppingCart, Trash } from "lucide-react"

export interface MedicationsListProps {
  data?: any[]
}

export function MedicationsList({ data }: MedicationsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [openDialog, setOpenDialog] = useState(false)
  const [editDialog, setEditDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [orderDialog, setOrderDialog] = useState(false)
  const [selectedMedication, setSelectedMedication] = useState<any>(null)
  const [medicationsData, setMedicationsData] = useState(data || [])
  const [newMedication, setNewMedication] = useState({
    name: "",
    category: "antidouleur",
    stock: 0,
    threshold: 20,
    expiryDate: "",
    price: 0,
  })
  const [editMedication, setEditMedication] = useState({
    id: 0,
    name: "",
    category: "",
    stock: 0,
    threshold: 0,
    expiryDate: "",
    price: 0,
  })
  const [orderQuantity, setOrderQuantity] = useState(0)
  const [success, setSuccess] = useState("")

  // Filtrer les médicaments en fonction de la recherche et de la catégorie
  const filteredMedications = medicationsData.filter((med) => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || med.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleAddMedication = () => {
    // Ajouter un nouveau médicament
    const newId = Math.max(...medicationsData.map((med) => med.id)) + 1
    const newMedicationData = {
      id: newId,
      name: newMedication.name,
      category: newMedication.category,
      stock: Number(newMedication.stock),
      threshold: Number(newMedication.threshold),
      expiryDate: new Date(newMedication.expiryDate),
      price: Number(newMedication.price),
    }

    setMedicationsData([...medicationsData, newMedicationData])
    setSuccess(`Le médicament ${newMedication.name} a été ajouté avec succès.`)
    setOpenDialog(false)

    // Réinitialiser le formulaire après 3 secondes
    setTimeout(() => {
      setSuccess("")
      setNewMedication({
        name: "",
        category: "antidouleur",
        stock: 0,
        threshold: 20,
        expiryDate: "",
        price: 0,
      })
    }, 3000)
  }

  const handleEditMedication = () => {
    // Mettre à jour le médicament
    const updatedMedications = medicationsData.map((med) =>
      med.id === editMedication.id
        ? {
            ...med,
            ...editMedication,
            stock: Number(editMedication.stock),
            threshold: Number(editMedication.threshold),
            expiryDate: new Date(editMedication.expiryDate),
            price: Number(editMedication.price),
          }
        : med,
    )

    setMedicationsData(updatedMedications)
    setSuccess(`Le médicament ${editMedication.name} a été mis à jour avec succès.`)
    setEditDialog(false)

    // Réinitialiser le message après 3 secondes
    setTimeout(() => {
      setSuccess("")
    }, 3000)
  }

  const handleDeleteMedication = () => {
    // Supprimer le médicament
    const updatedMedications = medicationsData.filter((med) => med.id !== selectedMedication.id)

    setMedicationsData(updatedMedications)
    setSuccess(`Le médicament ${selectedMedication.name} a été supprimé avec succès.`)
    setDeleteDialog(false)
    setSelectedMedication(null)

    // Réinitialiser le message après 3 secondes
    setTimeout(() => {
      setSuccess("")
    }, 3000)
  }

  const handleOrderMedication = () => {
    // Commander le médicament
    const updatedMedications = medicationsData.map((med) =>
      med.id === selectedMedication.id
        ? {
            ...med,
            stock: med.stock + Number(orderQuantity),
          }
        : med,
    )

    setMedicationsData(updatedMedications)
    setSuccess(`Commande de ${orderQuantity} unités de ${selectedMedication.name} effectuée avec succès.`)
    setOrderDialog(false)
    setSelectedMedication(null)
    setOrderQuantity(0)

    // Réinitialiser le message après 3 secondes
    setTimeout(() => {
      setSuccess("")
    }, 3000)
  }

  const openEditDialog = (medication: any) => {
    setEditMedication({
      id: medication.id,
      name: medication.name,
      category: medication.category,
      stock: medication.stock,
      threshold: medication.threshold,
      expiryDate: formatDateForInput(medication.expiryDate),
      price: medication.price,
    })
    setEditDialog(true)
  }

  const openDeleteDialog = (medication: any) => {
    setSelectedMedication(medication)
    setDeleteDialog(true)
  }

  const openOrderDialog = (medication: any) => {
    setSelectedMedication(medication)
    setOrderDialog(true)
    // Définir une quantité par défaut basée sur le seuil
    setOrderQuantity(Math.max(medication.threshold - medication.stock, 10))
  }

  // Formater la date pour l'input type="date"
  const formatDateForInput = (date: Date) => {
    const d = new Date(date)
    let month = "" + (d.getMonth() + 1)
    let day = "" + d.getDate()
    const year = d.getFullYear()

    if (month.length < 2) month = "0" + month
    if (day.length < 2) day = "0" + day

    return [year, month, day].join("-")
  }

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-pharma-primary/10 to-pharma-primary/5 border-b">
        <div className="flex items-center justify-between">
          <CardTitle>Inventaire des Médicaments</CardTitle>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1 bg-pharma-primary hover:bg-pharma-primary/90">
                <Plus className="h-4 w-4" />
                Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau médicament</DialogTitle>
                <DialogDescription>
                  Entrez les informations du médicament. Cliquez sur enregistrer quand vous avez terminé.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nom
                  </Label>
                  <Input
                    id="name"
                    className="col-span-3"
                    value={newMedication.name}
                    onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Catégorie
                  </Label>
                  <Select
                    value={newMedication.category}
                    onValueChange={(value) => setNewMedication({ ...newMedication, category: value })}
                  >
                    <SelectTrigger id="category" className="col-span-3">
                      <SelectValue placeholder="Sélectionnez une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="antibiotique">Antibiotiques</SelectItem>
                      <SelectItem value="antidouleur">Antidouleurs</SelectItem>
                      <SelectItem value="antiinflammatoire">Anti-inflammatoires</SelectItem>
                      <SelectItem value="cardiovasculaire">Cardiovasculaires</SelectItem>
                      <SelectItem value="respiratoire">Respiratoires</SelectItem>
                      <SelectItem value="antiacide">Anti-acides</SelectItem>
                      <SelectItem value="antidiabétique">Anti-diabétiques</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="stock" className="text-right">
                    Stock
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    className="col-span-3"
                    value={newMedication.stock}
                    onChange={(e) => setNewMedication({ ...newMedication, stock: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="threshold" className="text-right">
                    Seuil d'alerte
                  </Label>
                  <Input
                    id="threshold"
                    type="number"
                    className="col-span-3"
                    value={newMedication.threshold}
                    onChange={(e) => setNewMedication({ ...newMedication, threshold: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="expiryDate" className="text-right">
                    Date d'expiration
                  </Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    className="col-span-3"
                    value={newMedication.expiryDate}
                    onChange={(e) => setNewMedication({ ...newMedication, expiryDate: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Prix (MAD)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    className="col-span-3"
                    value={newMedication.price}
                    onChange={(e) => setNewMedication({ ...newMedication, price: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenDialog(false)}>
                  Annuler
                </Button>
                <Button type="submit" onClick={handleAddMedication}>
                  Enregistrer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription>Gérez votre inventaire de médicaments et surveillez les niveaux de stock</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {success && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher un médicament..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                <SelectItem value="antibiotique">Antibiotiques</SelectItem>
                <SelectItem value="antidouleur">Antidouleurs</SelectItem>
                <SelectItem value="antiinflammatoire">Anti-inflammatoires</SelectItem>
                <SelectItem value="cardiovasculaire">Cardiovasculaires</SelectItem>
                <SelectItem value="respiratoire">Respiratoires</SelectItem>
                <SelectItem value="antiacide">Anti-acides</SelectItem>
                <SelectItem value="antidiabétique">Anti-diabétiques</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-semibold">Nom</TableHead>
                <TableHead className="font-semibold">Catégorie</TableHead>
                <TableHead className="font-semibold">Stock</TableHead>
                <TableHead className="font-semibold">Date d'expiration</TableHead>
                <TableHead className="font-semibold">Prix</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMedications.map((medication) => (
                <TableRow key={medication.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium">{medication.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        medication.category === "antibiotique"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : medication.category === "antidouleur"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : medication.category === "antiinflammatoire"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : medication.category === "cardiovasculaire"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-gray-50 text-gray-700 border-gray-200"
                      }
                    >
                      {getCategoryName(medication.category)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${getStockStatusDot(medication.stock, medication.threshold)}`}
                      ></div>
                      <span className={`${getStockStatusColor(medication.stock, medication.threshold)}`}>
                        {medication.stock}
                      </span>
                      {medication.stock <= medication.threshold && (
                        <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">
                          Stock faible
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{formatDate(medication.expiryDate)}</span>
                      {isExpiringSoon(medication.expiryDate) && (
                        <Badge variant="outline" className="text-amber-500 border-amber-200 bg-amber-50">
                          Expire bientôt
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{medication.price.toFixed(2)} MAD</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                              onClick={() => openOrderDialog(medication)}
                            >
                              <ShoppingCart className="h-4 w-4" />
                              <span className="sr-only">Commander</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Commander</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-green-600 hover:text-green-800 hover:bg-green-50"
                              onClick={() => openEditDialog(medication)}
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Modifier</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Modifier</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-50"
                              onClick={() => openDeleteDialog(medication)}
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Supprimer</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Supprimer</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Dialogue de modification */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier le médicament</DialogTitle>
            <DialogDescription>Modifiez les informations du médicament.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Nom
              </Label>
              <Input
                id="edit-name"
                className="col-span-3"
                value={editMedication.name}
                onChange={(e) => setEditMedication({ ...editMedication, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-category" className="text-right">
                Catégorie
              </Label>
              <Select
                value={editMedication.category}
                onValueChange={(value) => setEditMedication({ ...editMedication, category: value })}
              >
                <SelectTrigger id="edit-category" className="col-span-3">
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="antibiotique">Antibiotiques</SelectItem>
                  <SelectItem value="antidouleur">Antidouleurs</SelectItem>
                  <SelectItem value="antiinflammatoire">Anti-inflammatoires</SelectItem>
                  <SelectItem value="cardiovasculaire">Cardiovasculaires</SelectItem>
                  <SelectItem value="respiratoire">Respiratoires</SelectItem>
                  <SelectItem value="antiacide">Anti-acides</SelectItem>
                  <SelectItem value="antidiabétique">Anti-diabétiques</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-stock" className="text-right">
                Stock
              </Label>
              <Input
                id="edit-stock"
                type="number"
                className="col-span-3"
                value={editMedication.stock}
                onChange={(e) => setEditMedication({ ...editMedication, stock: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-threshold" className="text-right">
                Seuil d'alerte
              </Label>
              <Input
                id="edit-threshold"
                type="number"
                className="col-span-3"
                value={editMedication.threshold}
                onChange={(e) => setEditMedication({ ...editMedication, threshold: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-expiryDate" className="text-right">
                Date d'expiration
              </Label>
              <Input
                id="edit-expiryDate"
                type="date"
                className="col-span-3"
                value={editMedication.expiryDate}
                onChange={(e) => setEditMedication({ ...editMedication, expiryDate: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-price" className="text-right">
                Prix (MAD)
              </Label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                className="col-span-3"
                value={editMedication.price}
                onChange={(e) => setEditMedication({ ...editMedication, price: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog(false)}>
              Annuler
            </Button>
            <Button type="submit" onClick={handleEditMedication}>
              Enregistrer les modifications
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogue de suppression */}
      <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce médicament ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera définitivement le médicament {selectedMedication?.name} de
              votre inventaire.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMedication} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialogue de commande */}
      <Dialog open={orderDialog} onOpenChange={setOrderDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Commander {selectedMedication?.name}</DialogTitle>
            <DialogDescription>Spécifiez la quantité à commander pour réapprovisionner votre stock.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="order-quantity" className="text-right">
                Quantité
              </Label>
              <Input
                id="order-quantity"
                type="number"
                className="col-span-3"
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(Number(e.target.value))}
              />
            </div>
            {selectedMedication && (
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-sm text-blue-700">
                  Stock actuel: <span className="font-semibold">{selectedMedication.stock}</span> | Seuil minimum:{" "}
                  <span className="font-semibold">{selectedMedication.threshold}</span>
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Après commande: <span className="font-semibold">{selectedMedication.stock + orderQuantity}</span>
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOrderDialog(false)}>
              Annuler
            </Button>
            <Button type="submit" onClick={handleOrderMedication}>
              Confirmer la commande
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

// Données fictives pour les médicaments
const medications = [
  {
    id: 1,
    name: "Paracétamol 500mg",
    category: "antidouleur",
    stock: 5,
    threshold: 20,
    expiryDate: new Date(2024, 8, 15),
    price: 49.9,
  },
  {
    id: 2,
    name: "Amoxicilline 1g",
    category: "antibiotique",
    stock: 8,
    threshold: 15,
    expiryDate: new Date(2024, 4, 10),
    price: 85.0,
  },
  {
    id: 3,
    name: "Ibuprofène 400mg",
    category: "antiinflammatoire",
    stock: 12,
    threshold: 25,
    expiryDate: new Date(2025, 2, 20),
    price: 67.5,
  },
  {
    id: 4,
    name: "Oméprazole 20mg",
    category: "antiacide",
    stock: 7,
    threshold: 15,
    expiryDate: new Date(2024, 7, 5),
    price: 123.0,
  },
  {
    id: 5,
    name: "Doliprane 1000mg",
    category: "antidouleur",
    stock: 10,
    threshold: 20,
    expiryDate: new Date(2024, 9, 30),
    price: 52.5,
  },
  {
    id: 6,
    name: "Ventoline spray",
    category: "respiratoire",
    stock: 18,
    threshold: 10,
    expiryDate: new Date(2024, 5, 5),
    price: 159.9,
  },
  {
    id: 7,
    name: "Augmentin 1g",
    category: "antibiotique",
    stock: 22,
    threshold: 15,
    expiryDate: new Date(2024, 5, 12),
    price: 98.0,
  },
  {
    id: 8,
    name: "Bisoprolol 5mg",
    category: "cardiovasculaire",
    stock: 30,
    threshold: 20,
    expiryDate: new Date(2025, 1, 15),
    price: 74.5,
  },
  {
    id: 9,
    name: "Aspirine 500mg",
    category: "antidouleur",
    stock: 45,
    threshold: 30,
    expiryDate: new Date(2025, 3, 10),
    price: 39.9,
  },
  {
    id: 10,
    name: "Metformine 850mg",
    category: "antidiabétique",
    stock: 25,
    threshold: 20,
    expiryDate: new Date(2024, 11, 25),
    price: 82.0,
  },
]

// Fonction pour obtenir la couleur en fonction du niveau de stock
function getStockStatusColor(stock: number, threshold: number): string {
  if (stock <= threshold / 2) return "text-red-600 font-bold"
  if (stock <= threshold) return "text-amber-600 font-bold"
  return "text-green-600"
}

// Fonction pour obtenir la couleur du point indicateur de stock
function getStockStatusDot(stock: number, threshold: number): string {
  if (stock <= threshold / 2) return "bg-red-600"
  if (stock <= threshold) return "bg-amber-500"
  return "bg-green-500"
}

// Fonction pour vérifier si un médicament expire bientôt (dans les 30 jours)
function isExpiringSoon(expiryDate: Date): boolean {
  const today = new Date()
  const diffTime = expiryDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= 30 && diffDays > 0
}

// Fonction pour formater la date
function formatDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })
}

// Fonction pour obtenir le nom de la catégorie
function getCategoryName(category: string): string {
  switch (category) {
    case "antibiotique":
      return "Antibiotique"
    case "antidouleur":
      return "Antidouleur"
    case "antiinflammatoire":
      return "Anti-inflammatoire"
    case "cardiovasculaire":
      return "Cardiovasculaire"
    case "respiratoire":
      return "Respiratoire"
    case "antiacide":
      return "Anti-acide"
    case "antidiabétique":
      return "Anti-diabétique"
    default:
      return category
  }
}
