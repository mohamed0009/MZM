"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/AuthContext"
import { Loader2 } from "lucide-react"

export function ProfileForm() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    pharmacyName: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        name: user.name || "",
        email: user.email || "",
        pharmacyName: user.pharmacyName || "",
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Simulation d'une mise à jour de profil
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSuccess("Profil mis à jour avec succès")
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Validation simple
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas")
      setIsLoading(false)
      return
    }

    try {
      // Simulation d'une mise à jour de mot de passe
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSuccess("Mot de passe mis à jour avec succès")
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="bg-white rounded-xl overflow-hidden border border-slate-100 p-1 shadow-sm mb-6">
        <TabsTrigger 
          value="profile" 
          className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm px-6 py-2.5 transition-all"
        >
          Informations
        </TabsTrigger>
        <TabsTrigger 
          value="password" 
          className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm px-6 py-2.5 transition-all"
        >
          Mot de passe
        </TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <Card className="max-w-2xl mx-auto border-none shadow-md rounded-xl overflow-hidden">
          <CardHeader className="bg-white border-b border-slate-100 p-6">
            <CardTitle className="text-xl font-bold text-slate-800">Informations du profil</CardTitle>
            <CardDescription className="text-slate-500">
              Mettez à jour vos informations personnelles et les détails de votre pharmacie
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <form onSubmit={handleProfileSubmit} className="space-y-5">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="bg-green-50 text-green-700 border border-green-100">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-slate-700">Nom complet</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  className="border-slate-200 hover:border-blue-300 focus:border-blue-400 transition-colors"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  className="border-slate-200 hover:border-blue-300 focus:border-blue-400 transition-colors"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pharmacyName" className="text-sm font-medium text-slate-700">Nom de la pharmacie</Label>
                <Input 
                  id="pharmacyName" 
                  name="pharmacyName" 
                  value={formData.pharmacyName} 
                  onChange={handleChange} 
                  className="border-slate-200 hover:border-blue-300 focus:border-blue-400 transition-colors"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white shadow-sm"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mise à jour en cours...
                  </>
                ) : (
                  "Mettre à jour le profil"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card className="max-w-2xl mx-auto border-none shadow-md rounded-xl overflow-hidden">
          <CardHeader className="bg-white border-b border-slate-100 p-6">
            <CardTitle className="text-xl font-bold text-slate-800">Changer le mot de passe</CardTitle>
            <CardDescription className="text-slate-500">
              Mettez à jour votre mot de passe pour sécuriser votre compte
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="bg-green-50 text-green-700 border border-green-100">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-sm font-medium text-slate-700">Mot de passe actuel</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="border-slate-200 hover:border-blue-300 focus:border-blue-400 transition-colors"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium text-slate-700">Nouveau mot de passe</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="border-slate-200 hover:border-blue-300 focus:border-blue-400 transition-colors"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">Confirmer le nouveau mot de passe</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="border-slate-200 hover:border-blue-300 focus:border-blue-400 transition-colors"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white shadow-sm"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mise à jour en cours...
                  </>
                ) : (
                  "Mettre à jour le mot de passe"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
