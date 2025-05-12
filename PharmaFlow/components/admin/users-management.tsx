"use client"

import { useState } from "react"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Plus, Search } from "lucide-react"
import { MainNav } from "@/components/dashboard/main-nav"
import { UserNav } from "@/components/dashboard/user-nav"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { useMobile } from "@/hooks/use-mobile"

// Types pour les utilisateurs
type UserRole = "admin" | "pharmacist" | "assistant" | "intern"

type User = {
  id: string
  name: string
  email: string
  role: UserRole
  active: boolean
  createdAt: string
}

// Données fictives pour les utilisateurs
const initialUsers: User[] = [
  {
    id: "1",
    name: "Jean Dupont",
    email: "jean.dupont@pharmasys.com",
    role: "admin",
    active: true,
    createdAt: "2023-01-15",
  },
  {
    id: "2",
    name: "Marie Martin",
    email: "marie.martin@pharmasys.com",
    role: "pharmacist",
    active: true,
    createdAt: "2023-02-10",
  },
  {
    id: "3",
    name: "Pierre Durand",
    email: "pierre.durand@pharmasys.com",
    role: "assistant",
    active: true,
    createdAt: "2023-03-05",
  },
  {
    id: "4",
    name: "Sophie Lefebvre",
    email: "sophie.lefebvre@pharmasys.com",
    role: "intern",
    active: false,
    createdAt: "2023-04-20",
  },
  {
    id: "5",
    name: "Thomas Bernard",
    email: "thomas.bernard@pharmasys.com",
    role: "pharmacist",
    active: true,
    createdAt: "2023-05-12",
  },
]

export function UsersManagement() {
  const isMobile = useMobile()
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: "",
    email: "",
    role: "assistant",
    active: true,
  })
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Filtrer les utilisateurs en fonction de la recherche
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Ajouter un nouvel utilisateur
  const handleAddUser = () => {
    const id = Math.random().toString(36).substring(2, 9)
    const createdAt = new Date().toISOString().split("T")[0]
    const userToAdd = {
      ...newUser,
      id,
      createdAt,
    } as User

    setUsers([...users, userToAdd])
    setNewUser({
      name: "",
      email: "",
      role: "assistant",
      active: true,
    })
    setIsAddDialogOpen(false)
  }

  // Mettre à jour un utilisateur
  const handleUpdateUser = () => {
    if (!editingUser) return

    const updatedUsers = users.map((user) => (user.id === editingUser.id ? editingUser : user))
    setUsers(updatedUsers)
    setIsEditDialogOpen(false)
  }

  // Supprimer un utilisateur
  const handleDeleteUser = () => {
    if (!editingUser) return

    const updatedUsers = users.filter((user) => user.id !== editingUser.id)
    setUsers(updatedUsers)
    setIsDeleteDialogOpen(false)
  }

  // Fonction pour obtenir la couleur du badge en fonction du rôle
  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "pharmacist":
        return "default"
      case "assistant":
        return "secondary"
      case "intern":
        return "outline"
      default:
        return "default"
    }
  }

  // Fonction pour obtenir le libellé du rôle en français
  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "Administrateur"
      case "pharmacist":
        return "Pharmacien"
      case "assistant":
        return "Assistant"
      case "intern":
        return "Stagiaire"
      default:
        return role
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          {isMobile ? <MobileNav /> : <MainNav className="mx-6" />}
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Gestion des utilisateurs</h2>
          <div className="flex items-center space-x-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un utilisateur
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Ajouter un utilisateur</DialogTitle>
                  <DialogDescription>Créez un nouvel utilisateur pour accéder au système.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Nom
                    </Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      Rôle
                    </Label>
                    <Select
                      value={newUser.role}
                      onValueChange={(value) => setNewUser({ ...newUser, role: value as UserRole })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrateur</SelectItem>
                        <SelectItem value="pharmacist">Pharmacien</SelectItem>
                        <SelectItem value="assistant">Assistant</SelectItem>
                        <SelectItem value="intern">Stagiaire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="active" className="text-right">
                      Actif
                    </Label>
                    <div className="col-span-3 flex items-center space-x-2">
                      <Switch
                        id="active"
                        checked={newUser.active}
                        onCheckedChange={(checked) => setNewUser({ ...newUser, active: checked })}
                      />
                      <Label htmlFor="active">{newUser.active ? "Actif" : "Inactif"}</Label>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleAddUser} disabled={!newUser.name || !newUser.email}>
                    Ajouter
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un utilisateur..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date de création</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>{getRoleLabel(user.role)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.active ? "default" : "outline"}
                      className={
                        user.active
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                      }
                    >
                      {user.active ? "Actif" : "Inactif"}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Ouvrir le menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingUser(user)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingUser(user)
                            setIsDeleteDialogOpen(true)
                          }}
                          className="text-red-600"
                        >
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Dialog pour modifier un utilisateur */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Modifier un utilisateur</DialogTitle>
              <DialogDescription>Modifiez les informations de l'utilisateur.</DialogDescription>
            </DialogHeader>
            {editingUser && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Nom
                  </Label>
                  <Input
                    id="edit-name"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-role" className="text-right">
                    Rôle
                  </Label>
                  <Select
                    value={editingUser.role}
                    onValueChange={(value) =>
                      setEditingUser({
                        ...editingUser,
                        role: value as UserRole,
                      })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrateur</SelectItem>
                      <SelectItem value="pharmacist">Pharmacien</SelectItem>
                      <SelectItem value="assistant">Assistant</SelectItem>
                      <SelectItem value="intern">Stagiaire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-active" className="text-right">
                    Actif
                  </Label>
                  <div className="col-span-3 flex items-center space-x-2">
                    <Switch
                      id="edit-active"
                      checked={editingUser.active}
                      onCheckedChange={(checked) => setEditingUser({ ...editingUser, active: checked })}
                    />
                    <Label htmlFor="edit-active">{editingUser.active ? "Actif" : "Inactif"}</Label>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button type="submit" onClick={handleUpdateUser}>
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog pour supprimer un utilisateur */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Supprimer un utilisateur</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            {editingUser && (
              <div className="py-4">
                <p>
                  Vous êtes sur le point de supprimer l'utilisateur : <strong>{editingUser.name}</strong>
                </p>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleDeleteUser}>
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
