"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'pharmacist' | 'staff'
  avatar?: string
  pharmacyName?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  isAdmin: boolean
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check for existing session on mount
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      // Mock session check - replace with actual API call
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
        avatar: '/avatars/male-avatar.png',
        pharmacyName: 'PharmaPlus'
      }
      setUser(mockUser)
    } catch (err) {
      setError('Failed to check session')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      // Mock login - replace with actual API call
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email: email,
        role: 'admin',
        avatar: '/avatars/male-avatar.png',
        pharmacyName: 'PharmaPlus'
      }
      setUser(mockUser)
      return true
    } catch (err) {
      setError('Login failed')
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      setError(null)
      // Mock logout - replace with actual API call
      setUser(null)
    } catch (err) {
      setError('Logout failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const refreshToken = async () => {
    try {
      // Mock token refresh - replace with actual API call
      if (user) {
        // Token refreshed successfully
        return
      }
    } catch (err) {
      setError('Token refresh failed')
      throw err
    }
  }

  const isAdmin = user?.role === 'admin'

  const hasPermission = (permission: string) => {
    if (!user) return false
    
    // Basic permission mapping based on roles
    const rolePermissions = {
      admin: ['view_dashboard', 'manage_inventory', 'manage_clients', 'view_reports', 'manage_users'],
      pharmacist: ['view_dashboard', 'manage_inventory', 'manage_clients', 'view_reports'],
      staff: ['view_dashboard', 'view_inventory', 'view_clients']
    }
    
    return rolePermissions[user.role].includes(permission)
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login, 
      logout, 
      refreshToken,
      isAdmin,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 