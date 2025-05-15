"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthContext"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function UserNav() {
  const { user, logout, updateProfile } = useAuth()
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
  const [profileName, setProfileName] = useState(user?.name || "")

  // Update profileName when user changes
  useEffect(() => {
    if (user?.name) {
      setProfileName(user.name);
    }
  }, [user?.name]);

  // Get user initials for avatar
  const getUserInitials = (name?: string): string => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  }

  // Fonction pour obtenir la couleur du badge en fonction du rôle
  const getRoleBadgeVariant = (role: string) => {
    const normalizedRole = role.toUpperCase();
    switch (normalizedRole) {
      case "ADMIN":
        return "destructive"
      case "PHARMACIST":
        return "default"
      case "TECHNICIAN":
      case "CASHIER":
        return "secondary"
      default:
        return "outline"
    }
  }

  // Fonction pour obtenir le libellé du rôle en français
  const getRoleLabel = (role: string) => {
    const normalizedRole = role.toUpperCase();
    switch (normalizedRole) {
      case "ADMIN":
        return "Administrateur"
      case "PHARMACIST":
        return "Pharmacien"
      case "TECHNICIAN":
        return "Technicien"
      case "CASHIER":
        return "Caissier"
      default:
        return role
    }
  }

  const handleUpdateProfile = async () => {
    await updateProfile({ name: profileName });
    setIsProfileDialogOpen(false);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatars/male-avatar.png" alt={user?.name || "Avatar"} />
              <AvatarFallback>{getUserInitials(user?.name)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none cursor-pointer hover:underline" 
                 onClick={() => setIsProfileDialogOpen(true)}>
                {user?.name || "Utilisateur"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {getRoleLabel(user?.role || "").toLowerCase()}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setIsProfileDialogOpen(true)}>
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem>
              Paramètres
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>
            Déconnexion
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier le profil</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom</Label>
              <Input 
                id="name" 
                value={profileName} 
                onChange={(e) => setProfileName(e.target.value)} 
                placeholder="Votre nom"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProfileDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleUpdateProfile}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
