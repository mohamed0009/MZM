"use client"

import { Calendar as CalendarIcon, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function CalendarPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      <div className="mb-6">
        <Link href="/dashboard" className="text-slate-600 hover:text-green-600 inline-flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au tableau de bord
        </Link>
      </div>
      
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-green-100 p-2 rounded-full">
              <CalendarIcon className="h-5 w-5 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800">Calendrier</CardTitle>
          </div>
          <CardDescription>Gérez vos rendez-vous et votre planning</CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="min-h-[400px] flex items-center justify-center">
            <p className="text-slate-500 text-center">
              Module de calendrier en cours de développement.<br />
              Revenez bientôt pour accéder à cette fonctionnalité.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
