"use client"

import { ClientsList } from "@/components/dashboard/clients-list"

export default function ClientsPage() {
  return (
    <div className="flex-1 space-y-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Clients</h2>
      </div>
      <ClientsList />
    </div>
  )
}
