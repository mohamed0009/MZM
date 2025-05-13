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
    <Card className="border-none shadow-md rounded-xl overflow-hidden">
      <CardHeader className="bg-white border-b border-slate-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold text-slate-800">Liste des Clients</CardTitle>
            <CardDescription className="text-slate-500">
              {filteredClients.length} client{filteredClients.length !== 1 ? "s" : ""} enregistré{filteredClients.length !== 1 ? "s" : ""}
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Rechercher un client..."
                className="pl-8 w-full sm:w-[280px] bg-white border-slate-200 rounded-lg focus:border-blue-300 focus:ring-blue-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white shadow-sm font-medium">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Nouveau Client
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader className="bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-500 p-6 rounded-t-xl text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-15 bg-center"></div>
                  <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-3xl animate-pulse"></div>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-200 via-white/20 to-cyan-200 opacity-30"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-gradient-x"></div>
                  
                  <DialogTitle className="text-xl font-bold text-white">Ajouter un nouveau client</DialogTitle>
                  <DialogDescription className="text-cyan-100 mt-1">
                    Entrez les informations du client. Cliquez sur enregistrer quand vous avez terminé.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-5 px-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                      Nom
                    </Label>
                    <Input
                      id="name"
                      className="border-slate-200 hover:border-blue-300 focus:border-blue-400 transition-colors"
                      value={newClient.name}
                      onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      className="border-slate-200 hover:border-blue-300 focus:border-blue-400 transition-colors"
                      value={newClient.email}
                      onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-slate-700">
                      Téléphone
                    </Label>
                    <Input
                      id="phone"
                      className="border-slate-200 hover:border-blue-300 focus:border-blue-400 transition-colors"
                      value={newClient.phone}
                      onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob" className="text-sm font-medium text-slate-700">
                      Date de naissance
                    </Label>
                    <Input
                      id="dob"
                      type="date"
                      className="border-slate-200 hover:border-blue-300 focus:border-blue-400 transition-colors"
                      value={newClient.birthDate}
                      onChange={(e) => setNewClient({ ...newClient, birthDate: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter className="gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200 rounded-b-xl flex">
                  <Button
                    variant="outline"
                    onClick={() => setOpenDialog(false)}
                    className="border-slate-200 hover:bg-slate-100 transition-colors"
                  >
                    Annuler
                  </Button>
                  <Button 
                    onClick={handleAddClient}
                    className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white"
                  >
                    Enregistrer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {success && (
          <Alert className="mt-4 bg-green-50 text-green-700 border border-green-100">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <Tabs defaultValue="all" onValueChange={(value) => setStatusFilter(value)} className="w-full">
            <TabsList className="bg-white rounded-xl overflow-hidden border border-slate-100 p-1 shadow-sm">
              <TabsTrigger 
                value="all" 
                className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm px-6 py-2 transition-all"
              >
                Tous
              </TabsTrigger>
              <TabsTrigger 
                value="actif" 
                className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm px-6 py-2 transition-all"
              >
                Actifs
              </TabsTrigger>
              <TabsTrigger 
                value="inactif" 
                className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm px-6 py-2 transition-all"
              >
                Inactifs
              </TabsTrigger>
              <TabsTrigger 
                value="nouveau" 
                className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm px-6 py-2 transition-all"
              >
                Nouveaux
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="rounded-md border overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50">
              <TableRow className="hover:bg-blue-50/70 border-b border-blue-200/50">
                <TableHead className="font-medium w-[80px]">Avatar</TableHead>
                <TableHead className="font-medium">Nom</TableHead>
                <TableHead className="font-medium">Email</TableHead>
                <TableHead className="font-medium">Téléphone</TableHead>
                <TableHead className="font-medium">Statut</TableHead>
                <TableHead className="font-medium">Dernière visite</TableHead>
                <TableHead className="font-medium text-right">Actions</TableHead>
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
          <DialogHeader className="bg-white p-6 border-b border-slate-100">
            <DialogTitle className="text-xl font-bold">Modifier le client</DialogTitle>
            <DialogDescription className="text-slate-500 mt-1">
              Modifiez les informations du client.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-5 px-6 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-sm font-medium text-slate-700">
                Nom
              </Label>
              <Input
                id="edit-name"
                className="border-slate-200 hover:border-blue-300 focus:border-blue-400 transition-colors"
                value={editClient.name}
                onChange={(e) => setEditClient({ ...editClient, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email" className="text-sm font-medium text-slate-700">
                Email
              </Label>
              <Input
                id="edit-email"
                type="email"
                className="border-slate-200 hover:border-blue-300 focus:border-blue-400 transition-colors"
                value={editClient.email}
                onChange={(e) => setEditClient({ ...editClient, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone" className="text-sm font-medium text-slate-700">
                Téléphone
              </Label>
              <Input
                id="edit-phone"
                className="border-slate-200 hover:border-blue-300 focus:border-blue-400 transition-colors"
                value={editClient.phone}
                onChange={(e) => setEditClient({ ...editClient, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-dob" className="text-sm font-medium text-slate-700">
                Date de naissance
              </Label>
              <Input
                id="edit-dob"
                type="date"
                className="border-slate-200 hover:border-blue-300 focus:border-blue-400 transition-colors"
                value={editClient.birthDate}
                onChange={(e) => setEditClient({ ...editClient, birthDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status" className="text-sm font-medium text-slate-700">
                Statut
              </Label>
              <select
                id="edit-status"
                className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-300 focus:outline-none"
                value={editClient.status}
                onChange={(e) => setEditClient({ ...editClient, status: e.target.value })}
              >
                <option value="nouveau">Nouveau</option>
                <option value="régulier">Régulier</option>
                <option value="occasionnel">Occasionnel</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-prescription" className="text-sm font-medium text-slate-700">
                Ordonnance
              </Label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-prescription"
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  checked={editClient.hasPrescription}
                  onChange={(e) => setEditClient({ ...editClient, hasPrescription: e.target.checked })}
                />
                <Label htmlFor="edit-prescription" className="text-sm font-normal">
                  Le client a une ordonnance
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200 rounded-b-xl flex">
            <div className="grid grid-cols-2 gap-3 w-full">
              <Button
                variant="outline"
                onClick={() => setEditDialog(false)}
                className="border-slate-200 hover:bg-slate-100 transition-colors"
              >
                Annuler
              </Button>
              <Button 
                onClick={handleEditClient}
                className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white"
              >
                Enregistrer les modifications
              </Button>
            </div>
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
          <DialogHeader className="bg-white p-6 border-b border-slate-100">
            <DialogTitle className="text-xl font-bold">Profil du client</DialogTitle>
            <DialogDescription className="text-slate-500 mt-1">
              Informations détaillées sur le client.
            </DialogDescription>
          </DialogHeader>
          {selectedClient && (
            <div className="max-h-[60vh] overflow-y-auto">
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="bg-white rounded-xl overflow-hidden border border-slate-100 p-1 shadow-sm mx-6 mt-4">
                  <TabsTrigger 
                    value="info" 
                    className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm px-6 py-2.5 transition-all"
                  >
                    Informations
                  </TabsTrigger>
                  <TabsTrigger 
                    value="history" 
                    className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm px-6 py-2.5 transition-all"
                  >
                    Historique
                  </TabsTrigger>
                  <TabsTrigger 
                    value="prescriptions" 
                    className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm px-6 py-2.5 transition-all"
                  >
                    Ordonnances
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="space-y-6 px-6 py-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20 bg-teal-50 text-teal-600 ring-1 ring-teal-200">
                      <AvatarFallback className="text-xl bg-teal-50 text-teal-600 font-semibold">
                        {getInitials(selectedClient.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-800">{selectedClient.name}</h3>
                      <p className="text-sm text-slate-500">Client depuis {formatDate(selectedClient.lastVisit)}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 mb-1">Email</h4>
                      <p className="text-slate-800">{selectedClient.email}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 mb-1">Téléphone</h4>
                      <p className="text-slate-800">{selectedClient.phone}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 mb-1">Date de naissance</h4>
                      <p className="text-slate-800">{formatDate(selectedClient.birthDate)}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 mb-1">Statut</h4>
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
                <TabsContent value="history" className="space-y-4 px-6 py-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Historique des visites</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between p-3 bg-slate-50 rounded-md border border-slate-100">
                        <div>
                          <p className="font-medium">Consultation régulière</p>
                          <p className="text-sm text-slate-500">Prise de tension, vérification traitement</p>
                        </div>
                        <p className="text-sm text-slate-500">{formatDate(selectedClient.lastVisit)}</p>
                      </div>
                      <div className="flex justify-between p-3 bg-slate-50 rounded-md border border-slate-100">
                        <div>
                          <p className="font-medium">Renouvellement ordonnance</p>
                          <p className="text-sm text-slate-500">Médicaments pour hypertension</p>
                        </div>
                        <p className="text-sm text-slate-500">{formatDate(new Date(2024, 2, 15))}</p>
                      </div>
                      <div className="flex justify-between p-3 bg-slate-50 rounded-md border border-slate-100">
                        <div>
                          <p className="font-medium">Première visite</p>
                          <p className="text-sm text-slate-500">Création du dossier client</p>
                        </div>
                        <p className="text-sm text-slate-500">{formatDate(new Date(2024, 1, 10))}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="prescriptions" className="space-y-4 px-6 py-4">
                  {selectedClient.hasPrescription ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Ordonnances actives</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md border border-slate-100">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-medium">Ordonnance Dr. Benjelloun</p>
                              <p className="text-sm text-slate-500">Expire le {formatDate(new Date(2024, 5, 15))}</p>
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
                      <FileText className="h-12 w-12 text-slate-300" />
                      <p className="mt-2 text-slate-500">Aucune ordonnance active</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
          <DialogFooter className="px-6 py-4 bg-slate-50 border-t border-slate-200 rounded-b-xl">
            <Button onClick={() => setViewDialog(false)} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
              Fermer
            </Button>
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
