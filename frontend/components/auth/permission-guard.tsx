"use client"

import { ReactNode } from "react"
import { redirect } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { AnyPermission } from "@/lib/permissions"

type PermissionGuardProps = {
  permission: AnyPermission
  fallback?: ReactNode
  redirectTo?: string
  siteId?: string
  children: ReactNode
}

/**
 * Component that guards content based on user permissions
 * 
 * This component will:
 * 1. Check if the user has the required permission
 * 2. If yes, render the children
 * 3. If no, either:
 *    - Redirect to the specified path
 *    - Show a fallback component
 *    - Show a default "access denied" message
 * 
 * Usage:
 * <PermissionGuard permission="inventory:update" redirectTo="/dashboard">
 *   <ProtectedComponent />
 * </PermissionGuard>
 */
export function PermissionGuard({
  permission,
  fallback,
  redirectTo,
  siteId,
  children
}: PermissionGuardProps) {
  const { user, hasPermission } = useAuth()
  
  // Check if user is logged in
  if (!user) {
    return redirectTo ? redirect(redirectTo) : (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Accès refusé</AlertTitle>
        <AlertDescription>
          Vous devez vous connecter pour accéder à cette ressource.
        </AlertDescription>
      </Alert>
    )
  }
  
  // Check if user has permission
  const userHasPermission = hasPermission(permission, siteId)
  
  if (userHasPermission) {
    return <>{children}</>
  }
  
  // Handle case where user doesn't have permission
  if (redirectTo) {
    redirect(redirectTo)
  }
  
  if (fallback) {
    return <>{fallback}</>
  }
  
  // Default permission denied message
  return (
    <Alert variant="destructive" className="max-w-2xl mx-auto my-8">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Accès refusé</AlertTitle>
      <AlertDescription>
        Vous n'avez pas les permissions nécessaires pour accéder à cette fonctionnalité.
        {user.role !== 'admin' && " Veuillez contacter votre administrateur si vous pensez que c'est une erreur."}
      </AlertDescription>
    </Alert>
  )
}
