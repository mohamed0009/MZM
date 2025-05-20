"use client"

import { useEffect, useState } from "react"
import { useApi } from "@/hooks/use-api"

interface Client {
  id: number | string;
  name: string;
  email: string;
  phone: string;
  status: string;
  birthDate?: string | Date;
  lastVisit?: string | Date;
  hasPrescription?: boolean;
}

export default function ClientsTestPage() {
  const { clients } = useApi()
  const [clientsData, setClientsData] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchClients() {
      try {
        setLoading(true)
        console.log("Fetching clients...")
        const data = await clients.getClients()
        console.log("Clients data:", data)
        setClientsData(data as Client[])
        setError(null)
      } catch (err: any) {
        console.error("Error fetching clients:", err)
        setError(err.message || "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [clients])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Clients Test Page</h1>
      
      {loading && <p>Chargement des clients...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p><strong>Erreur:</strong> {error}</p>
        </div>
      )}
      
      <div>
        <h2 className="text-xl font-semibold mb-2">Nombre de clients: {clientsData.length || 0}</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(clientsData, null, 2)}
        </pre>
      </div>
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Liste des clients:</h2>
        
        <ul className="divide-y divide-gray-200">
          {Array.isArray(clientsData) && clientsData.map((client) => (
            <li key={client.id} className="py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{client.name}</p>
                  <p className="text-sm text-gray-500 truncate">{client.email}</p>
                  <p className="text-sm text-gray-500 truncate">{client.phone}</p>
                </div>
                <div className="inline-flex items-center text-sm font-semibold text-indigo-700">
                  {client.status}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
} 