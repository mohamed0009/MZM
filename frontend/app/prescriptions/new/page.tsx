"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, FileText, Loader2, Plus, Save, Trash2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function NewPrescriptionPage() {
  const router = useRouter()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    patient: "",
    doctor: "",
    date: new Date().toISOString().split('T')[0],
    notes: "",
    medications: [{ name: "", quantity: "", dosage: "" }]
  })
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }
  
  const handleMedicationChange = (index: number, field: string, value: string) => {
    const newMedications = [...formData.medications]
    newMedications[index] = { ...newMedications[index], [field]: value }
    setFormData({
      ...formData,
      medications: newMedications
    })
  }
  
  const addMedication = () => {
    setFormData({
      ...formData,
      medications: [...formData.medications, { name: "", quantity: "", dosage: "" }]
    })
  }
  
  const removeMedication = (index: number) => {
    const newMedications = [...formData.medications]
    newMedications.splice(index, 1)
    setFormData({
      ...formData,
      medications: newMedications.length > 0 ? newMedications : [{ name: "", quantity: "", dosage: "" }]
    })
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      // Here would be your API call to create a prescription
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
      
      console.log("Prescription submitted:", formData)
      
      // Redirect to prescriptions page
      router.push('/prescriptions')
    } catch (err: any) {
      setError(err.message || "Une erreur s'est produite lors de l'ajout de la prescription")
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <div className="mb-6">
        <Link href="/prescriptions" className="text-slate-600 hover:text-blue-600 inline-flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux prescriptions
        </Link>
      </div>
      
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-blue-100 p-2 rounded-full">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800">Nouvelle Prescription</CardTitle>
          </div>
          <CardDescription>Complétez le formulaire pour enregistrer une nouvelle prescription</CardDescription>
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
                <Label htmlFor="patient">Patient *</Label>
                <Input
                  id="patient"
                  name="patient"
                  placeholder="Nom du patient"
                  value={formData.patient}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="doctor">Médecin *</Label>
                <Input
                  id="doctor"
                  name="doctor"
                  placeholder="Nom du médecin"
                  value={formData.doctor}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Informations complémentaires"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Médicaments *</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={addMedication}
                  className="gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter
                </Button>
              </div>
              
              {formData.medications.map((medication, index) => (
                <Card key={index} className="border border-slate-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium text-slate-700">Médicament {index + 1}</h4>
                      {formData.medications.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMedication(index)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Nom *</Label>
                        <Input
                          placeholder="Nom du médicament"
                          value={medication.name}
                          onChange={(e) => handleMedicationChange(index, "name", e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Quantité *</Label>
                        <Input
                          type="number"
                          min="1"
                          placeholder="Quantité"
                          value={medication.quantity}
                          onChange={(e) => handleMedicationChange(index, "quantity", e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Posologie</Label>
                        <Input
                          placeholder="Ex: 1 comprimé 3x/jour"
                          value={medication.dosage}
                          onChange={(e) => handleMedicationChange(index, "dosage", e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
          
          <CardFooter className="border-t border-slate-100 bg-slate-50 gap-2 flex justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push('/prescriptions')}
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