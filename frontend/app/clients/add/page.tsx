"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, Save, User } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"

export default function AddClientPage() {
  const router = useRouter()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
    gender: ""
  })
  
  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    phone: ""
  })
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Clear validation errors when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: ""
      })
    }
  }
  
  const handleSelectChange = (value: string, field: string) => {
    setFormData({
      ...formData,
      [field]: value
    })
  }
  
  const validateForm = () => {
    let isValid = true
    const newErrors = { ...formErrors }
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "Le prénom est obligatoire"
      isValid = false
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Le nom est obligatoire"
      isValid = false
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Le numéro de téléphone est obligatoire"
      isValid = false
    } else if (!(/^\d{10}$/).test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = "Le format du numéro de téléphone est invalide"
      isValid = false
    }
    
    setFormErrors(newErrors)
    return isValid
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      // Here would be your API call to create the client
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
      
      console.log("Client submitted:", formData)
      
      // Redirect to clients page
      router.push('/clients')
    } catch (err: any) {
      setError(err.message || "Une erreur s'est produite lors de l'ajout du client")
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <div className="mb-6">
        <Link href="/clients" className="text-slate-600 hover:text-blue-600 inline-flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux clients
        </Link>
      </div>
      
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-blue-100 p-2 rounded-full">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800">Nouveau Client</CardTitle>
          </div>
          <CardDescription>Complétez le formulaire pour ajouter un nouveau client</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="gender">Civilité</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange(value, "gender")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mr">M.</SelectItem>
                    <SelectItem value="mrs">Mme</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="firstName" className={formErrors.firstName ? "text-destructive" : ""}>
                  Prénom *
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Prénom"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={formErrors.firstName ? "border-destructive" : ""}
                />
                {formErrors.firstName && (
                  <p className="text-xs text-destructive">{formErrors.firstName}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName" className={formErrors.lastName ? "text-destructive" : ""}>
                  Nom *
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Nom de famille"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={formErrors.lastName ? "border-destructive" : ""}
                />
                {formErrors.lastName && (
                  <p className="text-xs text-destructive">{formErrors.lastName}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@exemple.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className={formErrors.phone ? "text-destructive" : ""}>
                  Téléphone *
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="06 12 34 56 78"
                  value={formData.phone}
                  onChange={handleChange}
                  className={formErrors.phone ? "border-destructive" : ""}
                />
                {formErrors.phone && (
                  <p className="text-xs text-destructive">{formErrors.phone}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-slate-800">Adresse</h3>
              
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="123 Rue Exemple"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Code Postal</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    placeholder="12345"
                    value={formData.postalCode}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="Ville"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Informations complémentaires sur ce client..."
                value={formData.notes}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </CardContent>
          
          <CardFooter className="border-t border-slate-100 bg-slate-50 gap-2 flex justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push('/clients')}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Traitement...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Enregistrer
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 