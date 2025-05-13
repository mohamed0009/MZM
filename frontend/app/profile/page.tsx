"use client"

import { ProfileForm } from "@/components/auth/profile-form"
import { User } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      <div className="flex flex-col gap-6">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-500 rounded-2xl p-6 shadow-xl text-white mb-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-15 bg-center"></div>
          <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-3xl animate-pulse"></div>
          <div className="absolute -top-12 -left-12 w-36 h-36 rounded-full bg-blue-300/10 blur-3xl animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-200 via-white/20 to-cyan-200 opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-gradient-x"></div>
          
          <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center relative z-10">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                <User className="h-7 w-7 text-white/90" />
                Profil
              </h1>
              <p className="text-sm text-cyan-100 mt-1 flex items-center">
                Gérez vos informations personnelles et mettez à jour votre profil
              </p>
            </div>
          </div>
        </div>
        
        <div className="mx-auto w-full max-w-2xl">
          <ProfileForm />
        </div>
      </div>
    </div>
  )
}
