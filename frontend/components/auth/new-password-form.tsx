"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { HeartPulse, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface NewPasswordFormProps {
  token: string
}

export function NewPasswordForm({ token }: NewPasswordFormProps) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validation simple
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères")
      setIsLoading(false)
      return
    }

    try {
      // Simulation d'une requête de réinitialisation de mot de passe
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Pour la démonstration, on considère que le token "valid-token" est valide
      if (token === "valid-token") {
        setSuccess(true)

        // Rediriger vers la page de connexion après 3 secondes
        setTimeout(() => {
          router.push("/auth/login")
        }, 3000)
      } else {
        setError("Le token de réinitialisation est invalide ou a expiré")
      }
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-0 shadow-lg">
      <CardHeader className="space-y-2 text-center">
        <div className="flex justify-center">
          <div className="relative">
            <HeartPulse className="h-12 w-12 text-pharma-primary" />
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-pharma-secondary"></div>
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Définir un nouveau mot de passe</CardTitle>
        <CardDescription>Créez un nouveau mot de passe pour votre compte</CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <AlertDescription>
              Votre mot de passe a été réinitialisé avec succès. Vous allez être redirigé vers la page de connexion.
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">Nouveau mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">Le mot de passe doit contenir au moins 8 caractères</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-pharma-primary hover:bg-pharma-primary/90" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Réinitialisation en cours...
                </>
              ) : (
                "Réinitialiser le mot de passe"
              )}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="text-center">
        <div className="text-sm text-muted-foreground w-full">
          <Link href="/auth/login" className="text-pharma-primary hover:underline">
            Retour à la connexion
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
