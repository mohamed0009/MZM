"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Heart, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ResetPasswordForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)

    try {
      // Simulation d'une requête de réinitialisation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simuler une réponse réussie
      setSuccess(true)
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
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 bg-pharma-primary rounded-full animate-pulse opacity-60"></div>
            <div className="relative flex items-center justify-center w-full h-full bg-pharma-primary rounded-full">
              <Heart 
                className="text-white" 
                fill="white" 
                size={28} 
              />
              <svg 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
                width={18} 
                height={10} 
                viewBox="0 0 16 8" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M0 4H3L4 1L6 7L8 4L9 5L11 2L13 4H16" 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                  className="heartbeat-line text-pharma-secondary"
                />
              </svg>
            </div>
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Réinitialiser votre mot de passe</CardTitle>
        <CardDescription>Entrez votre adresse email pour recevoir un lien de réinitialisation</CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <AlertDescription>
              Si un compte existe avec cette adresse email, vous recevrez un lien de réinitialisation dans quelques
              minutes.
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemple@pharmaflow.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-pharma-primary hover:bg-pharma-primary/90" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                "Envoyer le lien de réinitialisation"
              )}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="text-center">
        <div className="text-sm text-muted-foreground">
          <Link href="/auth/login" className="text-pharma-primary hover:underline">
            Retour à la connexion
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
