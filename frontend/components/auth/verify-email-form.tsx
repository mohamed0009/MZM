"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { HeartPulse, Loader2, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function VerifyEmailForm() {
  const [isLoading, setIsLoading] = useState(true)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState("")
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError("Token de vérification manquant")
        setIsLoading(false)
        return
      }

      try {
        // Simulation d'une vérification d'email
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Pour la démonstration, on considère que le token "valid-token" est valide
        if (token === "valid-token") {
          setIsVerified(true)
        } else {
          setError("Le token de vérification est invalide ou a expiré")
        }
      } catch (err) {
        setError("Une erreur est survenue lors de la vérification de votre email")
      } finally {
        setIsLoading(false)
      }
    }

    verifyEmail()
  }, [token])

  const handleResendVerification = async () => {
    setIsLoading(true)
    setError("")

    try {
      // Simulation d'un renvoi d'email de vérification
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsLoading(false)
      // Afficher un message de succès
      setError("Un nouvel email de vérification a été envoyé à votre adresse email")
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.")
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
        <CardTitle className="text-2xl font-bold">Vérification d'email</CardTitle>
        <CardDescription>Nous vérifions votre adresse email pour activer votre compte</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-pharma-primary" />
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Vérification de votre adresse email en cours...
            </p>
          </div>
        ) : isVerified ? (
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <h3 className="mt-4 text-xl font-bold text-green-700">Email vérifié avec succès!</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Votre adresse email a été vérifiée avec succès. Vous pouvez maintenant vous connecter à votre compte.
            </p>
            <Button className="mt-6 w-full bg-pharma-primary hover:bg-pharma-primary/90" asChild>
              <Link href="/auth/login">Se connecter</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <XCircle className="h-16 w-16 text-red-500" />
            <h3 className="mt-4 text-xl font-bold text-red-700">Échec de la vérification</h3>
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Si vous n'avez pas reçu l'email de vérification ou si le lien a expiré, vous pouvez demander un nouvel
              email.
            </p>
            <Button
              className="mt-6 w-full bg-pharma-primary hover:bg-pharma-primary/90"
              onClick={handleResendVerification}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                "Renvoyer l'email de vérification"
              )}
            </Button>
          </div>
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
