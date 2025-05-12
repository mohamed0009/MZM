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
import { Checkbox } from "@/components/ui/checkbox"

export function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    pharmacyName: "",
    acceptTerms: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validation simple
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      setIsLoading(false)
      return
    }

    if (!formData.acceptTerms) {
      setError("Vous devez accepter les conditions d'utilisation")
      setIsLoading(false)
      return
    }

    try {
      // Simulation d'une requête d'inscription
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Stocker les informations d'authentification dans localStorage
      localStorage.setItem(
        "mzm-auth",
        JSON.stringify({
          isAuthenticated: true,
          user: {
            email: formData.email,
            name: formData.name,
            pharmacyName: formData.pharmacyName,
          },
        }),
      )

      // Rediriger vers la page d'accueil
      router.push("/")
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
        <CardTitle className="text-2xl font-bold">Créer un compte MZM</CardTitle>
        <CardDescription>Inscrivez-vous pour commencer à gérer votre pharmacie</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Nom complet</Label>
            <Input
              id="name"
              name="name"
              placeholder="Votre nom"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="exemple@mzm.ma"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pharmacyName">Nom de la pharmacie</Label>
            <Input
              id="pharmacyName"
              name="pharmacyName"
              placeholder="Pharmacie MZM"
              value={formData.pharmacyName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="acceptTerms"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onCheckedChange={(checked) => setFormData({ ...formData, acceptTerms: checked as boolean })}
            />
            <label
              htmlFor="acceptTerms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              J'accepte les{" "}
              <Link href="#" className="text-pharma-primary hover:underline">
                conditions d'utilisation
              </Link>{" "}
              et la{" "}
              <Link href="#" className="text-pharma-primary hover:underline">
                politique de confidentialité
              </Link>
            </label>
          </div>
          <Button type="submit" className="w-full bg-pharma-primary hover:bg-pharma-primary/90" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Inscription en cours...
              </>
            ) : (
              "S'inscrire"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-center">
        <div className="text-sm text-muted-foreground">
          <span>Vous avez déjà un compte? </span>
          <Link href="/auth/login" className="text-pharma-primary hover:underline">
            Se connecter
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
