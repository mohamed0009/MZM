"use client"

import { PermissionGuard } from "@/components/auth/permission-guard"
import { MainNav } from "@/components/dashboard/main-nav"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { UserNav } from "@/components/dashboard/user-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Filter, Mail, Edit, Trash2, Shield } from "lucide-react"

export default function AdminUsersPage() {
  return (
    <PermissionGuard permission="manage_users">
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
          {/* Blue Header Section */}
          <div className="bg-blue-50/80 p-8">
            <div className="flex flex-col space-y-1.5">
              <h2 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h2>
              <p className="text-sm text-gray-600">Gérez les utilisateurs et leurs permissions</p>
            </div>
          </div>

          <div className="p-6">
            {/* Search and Actions Bar */}
            <div className="mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div className="flex flex-1 items-center space-x-2">
                <div className="relative flex-1 md:max-w-md">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder="Rechercher un utilisateur..." 
                    className="pl-8 border-gray-200"
                  />
                </div>
                <Button variant="outline" className="border-gray-200">
                  <Filter className="mr-2 h-4 w-4" />
                  Tous les rôles
                </Button>
              </div>
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un utilisateur
              </Button>
            </div>

            {/* Users Table */}
            <div className="rounded-md border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="p-3 text-left text-sm font-medium text-gray-600">Utilisateur</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-600">Email</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-600">Rôle</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-600">Statut</th>
                    <th className="p-3 text-right text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="p-3">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="font-medium text-blue-700">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-3">
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">Dernière connexion: {user.lastLogin}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-gray-600">{user.email}</td>
                      <td className="p-3">
                        <span className={getRoleBadgeStyle(user.role)}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={getStatusBadgeStyle(user.status)}>
                          {user.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Envoyer un email</span>
                            <Mail className="h-4 w-4 text-gray-600" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Modifier</span>
                            <Edit className="h-4 w-4 text-gray-600" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:text-red-600">
                            <span className="sr-only">Supprimer</span>
                            <Trash2 className="h-4 w-4" />
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

// Helper function for role badge styling
function getRoleBadgeStyle(role: string): string {
  const styles: Record<string, string> = {
    'Admin': 'inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700',
    'Pharmacien': 'inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700',
    'Assistant': 'inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700',
    'default': 'inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700'
  }
  return styles[role] || styles.default
}

// Helper function for status badge styling
function getStatusBadgeStyle(status: string): string {
  const styles: Record<string, string> = {
    'Actif': 'inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700',
    'Inactif': 'inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700',
    'En attente': 'inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700',
    'default': 'inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700'
  }
  return styles[status] || styles.default
}

// Sample user data
const users = [
  {
    id: "1",
    name: "Dr. Sarah Martin",
    email: "sarah.martin@pharmaflow.com",
    role: "Admin",
    status: "Actif",
    lastLogin: "Il y a 2 heures"
  },
  {
    id: "2",
    name: "Jean Dupont",
    email: "jean.dupont@pharmaflow.com",
    role: "Pharmacien",
    status: "Actif",
    lastLogin: "Il y a 5 heures"
  },
  {
    id: "3",
    name: "Marie Lambert",
    email: "marie.lambert@pharmaflow.com",
    role: "Assistant",
    status: "En attente",
    lastLogin: "Hier"
  },
  {
    id: "4",
    name: "Pierre Dubois",
    email: "pierre.dubois@pharmaflow.com",
    role: "Pharmacien",
    status: "Inactif",
    lastLogin: "Il y a 2 jours"
  },
  {
    id: "5",
    name: "Sophie Bernard",
    email: "sophie.bernard@pharmaflow.com",
    role: "Assistant",
    status: "Actif",
    lastLogin: "Il y a 1 heure"
  }
]
