"use client"

import { ProfileForm } from "@/components/auth/profile-form"

export default function ProfilePage() {
  return (
    <div className="flex-1 space-y-4 pt-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-pharma-primary">Profil</h2>
        <p className="text-sm text-pharma-primary/70">Gérez vos informations personnelles</p>
      </div>
      <div className="mx-auto max-w-2xl">
        <ProfileForm />
      </div>
    </div>
  )
}
