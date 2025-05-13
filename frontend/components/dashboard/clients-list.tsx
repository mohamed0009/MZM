"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, FileText, Filter, Pencil, Search, Trash, UserPlus } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ClientsListProps {
  data?: any[]
}

export function ClientsList({ data = [] }: ClientsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [openDialog, setOpenDialog] = useState(false)
  const [editDialog, setEditDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [viewDialog, setViewDialog] = useState(false)
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [clientsData, setClientsData] = useState(data)
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    birthDate: "",
    hasPrescription: false,
    status: "nouveau",
  })
  const [editClient, setEditClient] = useState({
    id: 0,
    name: "",
    email: "",
    phone: "",
    birthDate: "",
    hasPrescription: false,
    status: "",
  })
  const [success, setSuccess] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filtrer les clients en fonction de la recherche et du statut
  const filteredClients = clientsData.filter(
    (client) =>
      (client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm)) &&
      (statusFilter === "all" || client.status === statusFilter),
  )

  const handleAddClient = () => {
    // Ajouter un nouveau client
    const newId = Math.max(...clientsData.map((client) => client.id)) + 1
    const newClientData = {
      id: newId,
      name: newClient.name,
      email: newClient.email,
      phone: newClient.phone,
      birthDate: new Date(newClient.birthDate),
      lastVisit: new Date(),
      status: newClient.status,
      hasPrescription: newClient.hasPrescription,
      avatar: "/placeholder-user.jpg",
    }

    setClientsData([...clientsData, newClientData])
    setSuccess(`Le client ${newClient.name} a été ajouté avec succès.`)
    setOpenDialog(false)

    // Réinitialiser le formulaire après 3 secondes
    setTimeout(() => {
      setSuccess("")
      setNewClient({
        name: "",
        email: "",
        phone: "",
        birthDate: "",
        hasPrescription: false,
        status: "nouveau",
      })
    }, 3000)
  }

  const handleEditClient = () => {
    // Mettre à jour le client
    const updatedClients = clientsData.map((client) =>
      client.id === editClient.id
        ? {
            ...client,
            ...editClient,
            birthDate: new Date(editClient.birthDate),
          }
        : client,
    )

    setClientsData(updatedClients)
    setSuccess(`Le client ${editClient.name} a été mis à jour avec succès.`)
    setEditDialog(false)

    // Réinitialiser le message après 3 secondes
    setTimeout(() => {
      setSuccess("")
    }, 3000)
  }

  const handleDeleteClient = () => {
    // Supprimer le client
    const updatedClients = clientsData.filter((client) => client.id !== selectedClient.id)

    setClientsData(updatedClients)
    setSuccess(`Le client ${selectedClient.name} a été supprimé avec succès.`)
    setDeleteDialog(false)
    setSelectedClient(null)

    // Réinitialiser le message après 3 secondes
    setTimeout(() => {
      setSuccess("")
    }, 3000)
  }

  const openEditDialog = (client: any) => {
    setEditClient({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      birthDate: formatDateForInput(client.birthDate),
      hasPrescription: client.hasPrescription,
      status: client.status,
    })
    setEditDialog(true)
  }

  const openDeleteDialog = (client: any) => {
    setSelectedClient(client)
    setDeleteDialog(true)
  }

  const openViewDialog = (client: any) => {
    setSelectedClient(client)
    setViewDialog(true)
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
          <div>
            <CardTitle>Gestion des Clients</CardTitle>
            <CardDescription>Gérez les informations de vos clients et leur historique médical</CardDescription>
          </div>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1 bg-pharma-primary hover:bg-pharma-primary/90">
                <UserPlus className="h-4 w-4" />
                Nouveau Client
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau client</DialogTitle>
                <DialogDescription>
                  Entrez les informations du client. Cliquez sur enregistrer quand vous avez terminé.
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
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    className="col-span-3"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Téléphone
                  </Label>
                  <Input
                    id="phone"
                    className="col-span-3"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dob" className="text-right">
                    Date de naissance
                  </Label>
                  <Input
                    id="dob"
                    type="date"
                    className="col-span-3"
                    value={newClient.birthDate}
                    onChange={(e) => setNewClient({ ...newClient, birthDate: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="prescription" className="text-right">
                    Ordonnance
                  </Label>
                  <div className="col-span-3 flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="prescription"
                      className="h-4 w-4 rounded border-gray-300 text-pharma-primary focus:ring-pharma-primary"
                      checked={newClient.hasPrescription}
                      onChange={(e) => setNewClient({ ...newClient, hasPrescription: e.target.checked })}
                    />
                    <Label htmlFor="prescription" className="text-sm font-normal">
                      Le client a une ordonnance
                    </Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenDialog(false)}>
                  Annuler
                </Button>
                <Button type="submit" onClick={handleAddClient}>
                  Enregistrer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription>Gérez les informations de vos clients et leur historique médical</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {success && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              className="h-10 w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="régulier">Régulier</option>
              <option value="occasionnel">Occasionnel</option>
              <option value="nouveau">Nouveau</option>
            </select>
          </div>
        </div>

        <div className="rounded-md border overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-[80px] font-semibold">Client</TableHead>
                <TableHead className="font-semibold">Nom</TableHead>
                <TableHead className="font-semibold">Contact</TableHead>
                <TableHead className="font-semibold">Dernière visite</TableHead>
                <TableHead className="font-semibold">Statut</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell>
                    <Avatar className="border-2 border-gray-200">
                      <AvatarImage src={client.avatar || "/placeholder.svg"} alt={client.name} />
                      <AvatarFallback className="bg-pharma-primary/10 text-pharma-primary font-semibold">
                        {getInitials(client.name)}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div>
                      {client.name}
                      {client.hasPrescription && (
                        <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                          Ordonnance
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">{formatDate(client.birthDate)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{client.email}</div>
                    <div className="text-sm text-muted-foreground">{client.phone}</div>
                  </TableCell>
                  <TableCell className="text-sm">{formatDate(client.lastVisit)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        client.status === "régulier"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : client.status === "nouveau"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                      }
                    >
                      {client.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                              onClick={() => openViewDialog(client)}
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Voir</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Voir le profil</p>
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
                              onClick={() => openEditDialog(client)}
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Modifier</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Modifier le client</p>
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
                              onClick={() => openDeleteDialog(client)}
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Supprimer</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Supprimer le client</p>
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
            <DialogTitle>Modifier le client</DialogTitle>
            <DialogDescription>Modifiez les informations du client.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Nom
              </Label>
              <Input
                id="edit-name"
                className="col-span-3"
                value={editClient.name}
                onChange={(e) => setEditClient({ ...editClient, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email
              </Label>
              <Input
                id="edit-email"
                type="email"
                className="col-span-3"
                value={editClient.email}
                onChange={(e) => setEditClient({ ...editClient, email: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-phone" className="text-right">
                Téléphone
              </Label>
              <Input
                id="edit-phone"
                className="col-span-3"
                value={editClient.phone}
                onChange={(e) => setEditClient({ ...editClient, phone: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-dob" className="text-right">
                Date de naissance
              </Label>
              <Input
                id="edit-dob"
                type="date"
                className="col-span-3"
                value={editClient.birthDate}
                onChange={(e) => setEditClient({ ...editClient, birthDate: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                Statut
              </Label>
              <select
                id="edit-status"
                className="col-span-3 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={editClient.status}
                onChange={(e) => setEditClient({ ...editClient, status: e.target.value })}
              >
                <option value="régulier">Régulier</option>
                <option value="occasionnel">Occasionnel</option>
                <option value="nouveau">Nouveau</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-prescription" className="text-right">
                Ordonnance
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-prescription"
                  className="h-4 w-4 rounded border-gray-300 text-pharma-primary focus:ring-pharma-primary"
                  checked={editClient.hasPrescription}
                  onChange={(e) => setEditClient({ ...editClient, hasPrescription: e.target.checked })}
                />
                <Label htmlFor="edit-prescription" className="text-sm font-normal">
                  Le client a une ordonnance
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog(false)}>
              Annuler
            </Button>
            <Button type="submit" onClick={handleEditClient}>
              Enregistrer les modifications
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogue de suppression */}
      <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce client ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera définitivement le client {selectedClient?.name} et toutes
              ses données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteClient} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialogue de visualisation */}
      <Dialog open={viewDialog} onOpenChange={setViewDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Profil du client</DialogTitle>
            <DialogDescription>Informations détaillées sur le client.</DialogDescription>
          </DialogHeader>
          {selectedClient && (
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Informations</TabsTrigger>
                <TabsTrigger value="history">Historique</TabsTrigger>
                <TabsTrigger value="prescriptions">Ordonnances</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="space-y-4 py-4">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-16 w-16 border-2 border-gray-200">
                    <AvatarImage src={selectedClient.avatar || "/placeholder.svg"} alt={selectedClient.name} />
                    <AvatarFallback className="text-xl bg-pharma-primary/10 text-pharma-primary font-semibold">
                      {getInitials(selectedClient.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedClient.name}</h3>
                    <p className="text-sm text-gray-500">Client depuis {formatDate(selectedClient.lastVisit)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Email</h4>
                    <p>{selectedClient.email}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Téléphone</h4>
                    <p>{selectedClient.phone}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Date de naissance</h4>
                    <p>{formatDate(selectedClient.birthDate)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Statut</h4>
                    <Badge
                      variant="outline"
                      className={
                        selectedClient.status === "régulier"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : selectedClient.status === "nouveau"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                      }
                    >
                      {selectedClient.status}
                    </Badge>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="history" className="space-y-4 py-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Historique des visites</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between p-3 bg-gray-50 rounded-md">
                      <div>
                        <p className="font-medium">Consultation régulière</p>
                        <p className="text-sm text-gray-500">Prise de tension, vérification traitement</p>
                      </div>
                      <p className="text-sm text-gray-500">{formatDate(selectedClient.lastVisit)}</p>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-md">
                      <div>
                        <p className="font-medium">Renouvellement ordonnance</p>
                        <p className="text-sm text-gray-500">Médicaments pour hypertension</p>
                      </div>
                      <p className="text-sm text-gray-500">{formatDate(new Date(2024, 2, 15))}</p>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-md">
                      <div>
                        <p className="font-medium">Première visite</p>
                        <p className="text-sm text-gray-500">Création du dossier client</p>
                      </div>
                      <p className="text-sm text-gray-500">{formatDate(new Date(2024, 1, 10))}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="prescriptions" className="space-y-4 py-4">
                {selectedClient.hasPrescription ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Ordonnances actives</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium">Ordonnance Dr. Benjelloun</p>
                            <p className="text-sm text-gray-500">Expire le {formatDate(new Date(2024, 5, 15))}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Voir
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <FileText className="h-12 w-12 text-gray-300" />
                    <p className="mt-2 text-gray-500">Aucune ordonnance active</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button onClick={() => setViewDialog(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

// Données fictives pour les clients marocains
const clients = [
  {
    id: 1,
    name: "Mohammed Alami",
    email: "mohammed.alami@gmail.com",
    phone: "06 12 34 56 78",
    birthDate: new Date(1975, 5, 15),
    lastVisit: new Date(2024, 3, 10),
    status: "régulier",
    hasPrescription: true,
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 2,
    name: "Fatima Benali",
    email: "fatima.benali@gmail.com",
    phone: "06 23 45 67 89",
    birthDate: new Date(1982, 8, 22),
    lastVisit: new Date(2024, 3, 15),
    status: "régulier",
    hasPrescription: false,
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 3,
    name: "Youssef Mansouri",
    email: "youssef.mansouri@gmail.com",
    phone: "06 34 56 78 90",
    birthDate: new Date(1968, 2, 10),
    lastVisit: new Date(2024, 2, 28),
    status: "occasionnel",
    hasPrescription: true,
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 4,
    name: "Amina Tazi",
    email: "amina.tazi@gmail.com",
    phone: "06 45 67 89 01",
    birthDate: new Date(1990, 11, 5),
    lastVisit: new Date(2024, 3, 18),
    status: "nouveau",
    hasPrescription: true,
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 5,
    name: "Karim Idrissi",
    email: "karim.idrissi@gmail.com",
    phone: "06 56 78 90 12",
    birthDate: new Date(1985, 7, 30),
    lastVisit: new Date(2024, 3, 5),
    status: "régulier",
    hasPrescription: false,
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 6,
    name: "Nadia Chraibi",
    email: "nadia.chraibi@gmail.com",
    phone: "06 67 89 01 23",
    birthDate: new Date(1995, 4, 12),
    lastVisit: new Date(2024, 3, 20),
    status: "nouveau",
    hasPrescription: false,
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 7,
    name: "Hassan Benjelloun",
    email: "hassan.benjelloun@gmail.com",
    phone: "06 78 90 12 34",
    birthDate: new Date(1972, 9, 8),
    lastVisit: new Date(2024, 3, 1),
    status: "régulier",
    hasPrescription: true,
    avatar: "/placeholder-user.jpg",
  },
]

// Fonction pour formater la date
function formatDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })
}

// Fonction pour obtenir les initiales d'un nom
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}
