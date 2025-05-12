"use client"

import { ReactNode } from "react"
import { redirect } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

type Permission =
  | "manage_users"
  | "view_reports"
  | "manage_inventory"
  | "approve_prescriptions"
  | "manage_clients"
  | "view_dashboard"

interface PermissionGuardProps {
  permission: Permission
  children: ReactNode
  fallback?: ReactNode
}

export function PermissionGuard({ permission, children, fallback }: PermissionGuardProps) {
  const { hasPermission } = useAuth()

  if (hasPermission(permission)) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Accès refusé</AlertTitle>
      <AlertDescription>
        Vous n'avez pas les permissions nécessaires pour accéder à cette fonctionnalité.
      </AlertDescription>
    </Alert>
  )
}
