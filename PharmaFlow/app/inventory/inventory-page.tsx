"use client"

import { PermissionGuard } from "@/components/auth/permission-guard"
import { MainNav } from "@/components/dashboard/main-nav"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { UserNav } from "@/components/dashboard/user-nav"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/AuthContext"
import { Search, Plus, FileText, Download, Filter } from "lucide-react"

export default function InventoryPageClient() {
  return (
    <PermissionGuard permission="manage_inventory">
      <div className="flex min-h-screen flex-col">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <MobileNav />
            <MainNav className="mx-6 hidden md:flex" />
            <div className="ml-auto flex items-center space-x-4">
              <UserNav />
            </div>
          </div>
        </div>
        <div className="flex-1">
          {/* Green Header Section */}
          <div className="bg-green-50/80 p-8">
            <div className="flex flex-col space-y-1.5">
              <h2 className="text-2xl font-bold text-gray-900">Inventaire des Médicaments</h2>
              <p className="text-sm text-gray-600">Gérez votre inventaire de médicaments et surveillez les niveaux de stock</p>
            </div>
          </div>

          <div className="p-6">
            {/* Search and Actions Bar */}
            <div className="mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div className="flex flex-1 items-center space-x-2">
                <div className="relative flex-1 md:max-w-md">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder="Rechercher un médicament..." 
                    className="pl-8 border-gray-200"
                  />
                </div>
                <Button variant="outline" className="border-gray-200">
                  <Filter className="mr-2 h-4 w-4" />
                  Toutes les catégories
                </Button>
              </div>
              <Button className="bg-green-600 text-white hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter
              </Button>
            </div>

            {/* Medications Table */}
            <div className="rounded-md border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="p-3 text-left text-sm font-medium text-gray-600">Nom</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-600">Catégorie</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-600">Stock</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-600">Date d'expiration</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-600">Prix</th>
                    <th className="p-3 text-right text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {medications.map((med) => (
                    <tr key={med.id} className="border-b">
                      <td className="p-3 font-medium text-gray-900">{med.name}</td>
                      <td className="p-3">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getCategoryStyle(med.category)}`}>
                          {med.category}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center">
                          <div className={`mr-2 h-2 w-2 rounded-full ${med.stock < 20 ? 'bg-red-500' : 'bg-yellow-500'}`} />
                          <span className={med.stock < 20 ? 'text-red-600 font-medium' : ''}>
                            {med.stock}
                          </span>
                          {med.stock < 20 && (
                            <span className="ml-2 rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-600">
                              Stock faible
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3">{med.expiryDate}</td>
                      <td className="p-3">{med.price.toFixed(2)} MAD</td>
                      <td className="p-3">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Modifier</span>
                            <FileText className="h-4 w-4 text-gray-600" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Supprimer</span>
                            <Download className="h-4 w-4 text-gray-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </PermissionGuard>
  )
}

// Helper function for category styling
function getCategoryStyle(category: string): string {
  const styles: Record<string, string> = {
    'Antidouleur': 'bg-green-50 text-green-700',
    'Antibiotique': 'bg-blue-50 text-blue-700',
    'Anti-inflammatoire': 'bg-purple-50 text-purple-700',
    'Anti-acide': 'bg-gray-50 text-gray-700',
    'default': 'bg-gray-50 text-gray-700'
  }
  return styles[category] || styles.default
}

const medications = [
  {
    id: "1",
    name: "Paracétamol 500mg",
    category: "Antidouleur",
    stock: 5,
    expiryDate: "15/09/2024",
    price: 49.90,
  },
  {
    id: "2",
    name: "Amoxicilline 1g",
    category: "Antibiotique",
    stock: 8,
    expiryDate: "10/05/2024",
    price: 85.00,
  },
  {
    id: "3",
    name: "Ibuprofène 400mg",
    category: "Anti-inflammatoire",
    stock: 12,
    expiryDate: "20/03/2025",
    price: 67.50,
  },
  {
    id: "4",
    name: "Oméprazole 20mg",
    category: "Anti-acide",
    stock: 7,
    expiryDate: "05/08/2024",
    price: 123.00,
  },
  {
    id: "5",
    name: "Doliprane 1000mg",
    category: "Antidouleur",
    stock: 10,
    expiryDate: "30/10/2024",
    price: 52.50,
  },
]
