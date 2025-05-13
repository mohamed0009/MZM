"use client"

import { SettingsForm } from "@/components/auth/settings-form"

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-4 pt-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-pharma-primary">Paramètres</h2>
        <p className="text-sm text-pharma-primary/70">Personnalisez vos préférences</p>
      </div>
      <div className="mx-auto max-w-2xl">
        <SettingsForm />
      </div>
    </div>
  )
}
