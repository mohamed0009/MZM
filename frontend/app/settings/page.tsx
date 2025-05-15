"use client"

import { Settings as SettingsIcon, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SettingsPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      <div className="mb-6">
        <Link href="/dashboard" className="text-slate-600 hover:text-slate-800 inline-flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au tableau de bord
        </Link>
      </div>
      
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-slate-200 p-2 rounded-full">
              <SettingsIcon className="h-5 w-5 text-slate-700" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800">Paramètres</CardTitle>
          </div>
          <CardDescription>Configurez les paramètres de votre application</CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="min-h-[400px] flex items-center justify-center">
            <p className="text-slate-500 text-center">
              Module de paramètres en cours de développement.<br />
              Revenez bientôt pour accéder à cette fonctionnalité.
            </p>
        </div>
        </CardContent>
      </Card>
    </div>
  )
}
