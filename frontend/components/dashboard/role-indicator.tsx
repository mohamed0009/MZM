"use client"

import { useAuth } from "@/contexts/AuthContext"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, User, Users } from "lucide-react"

export function RoleIndicator() {
  const { user } = useAuth()

  // Fonction pour obtenir la couleur du badge en fonction du rôle
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "destructive"
      case "PHARMACIST":
        return "default"
      case "TECHNICIAN":
        return "secondary"
      default:
        return "outline"
    }
  }

  // Fonction pour obtenir le libellé du rôle en français
  const getRoleLabel = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Administrateur"
      case "PHARMACIST":
        return "Pharmacien"
      case "TECHNICIAN":
        return "Technicien"
      default:
        return role
    }
  }

  // Fonction pour obtenir l'icône du rôle
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <ShieldCheck className="h-5 w-5 text-red-500" />
      case "PHARMACIST":
        return <User className="h-5 w-5 text-blue-500" />
      case "TECHNICIAN":
        return <Users className="h-5 w-5 text-green-500" />
      default:
        return <User className="h-5 w-5" />
    }
  }

  // Fonction pour obtenir la description du rôle
  const getRoleDescription = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Accès complet à toutes les fonctionnalités du système, y compris la gestion des utilisateurs et les rapports avancés."
      case "PHARMACIST":
        return "Accès à la gestion de l'inventaire, aux prescriptions et aux rapports. Peut approuver les ordonnances."
      case "TECHNICIAN":
        return "Accès limité à l'inventaire et aux clients. Ne peut pas approuver les ordonnances ni accéder aux rapports."
      default:
        return "Rôle non défini."
    }
  }

  if (!user) return null

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Votre rôle actuel</CardTitle>
        {getRoleIcon(user.role)}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <Badge className="w-fit" variant={getRoleBadgeVariant(user.role)}>
            {getRoleLabel(user.role)}
          </Badge>
          <CardDescription className="mt-2 text-xs">{getRoleDescription(user.role)}</CardDescription>
        </div>
      </CardContent>
    </Card>
  )
}
