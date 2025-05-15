"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'pharmacist' | 'staff' | 'cashier'
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
  updateProfile: (userData: Partial<User>) => Promise<boolean>
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
      // Check if user info is in localStorage
      const savedUser = localStorage.getItem('pharma_user');
      
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        return;
      }
      
      // Generate a dynamic username if none provided
      const dynamicName = getUserNameFromURL() || generateRandomName();
      
      // Mock session check - for demo purposes
      const mockUser: User = {
        id: '1',
        name: dynamicName,
        email: 'contact@pharmaflow.ma',
        role: getUserRoleFromURL() || 'admin',
        avatar: '/avatars/male-avatar.png',
        pharmacyName: 'PharmaPlus'
      }
      
      // Save to localStorage
      localStorage.setItem('pharma_user', JSON.stringify(mockUser));
      setUser(mockUser)
    } catch (err) {
      setError('Failed to check session')
    } finally {
      setLoading(false)
    }
  }

  // Helper to get name from URL if present
  const getUserNameFromURL = (): string | null => {
    if (typeof window === 'undefined') return null;
    
    const params = new URLSearchParams(window.location.search);
    return params.get('userName');
  }
  
  // Helper to get role from URL if present
  const getUserRoleFromURL = (): User['role'] | null => {
    if (typeof window === 'undefined') return null;
    
    const params = new URLSearchParams(window.location.search);
    const role = params.get('userRole');
    
    if (role === 'admin' || role === 'pharmacist' || role === 'staff') {
      return role;
    }
    
    return null;
  }

  // Generate a random username
  const generateRandomName = (): string => {
    const firstNames = ['Mohamed', 'Youssef', 'Ahmed', 'Amine', 'Fatima', 'Sara', 'Nadia', 'Karim'];
    const lastNames = ['Alaoui', 'Berrada', 'Tazi', 'Bennani', 'Sahli', 'Idrissi', 'Belghiti'];
    
    const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return `${randomFirst} ${randomLast}`;
  }

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      
      // Extract name from email (as a better default than "John Doe")
      const nameFromEmail = email.split('@')[0]
        .split('.')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
      
      // Mock login - replace with actual API call
      const mockUser: User = {
        id: '1',
        name: nameFromEmail,
        email: email,
        role: getUserRoleFromURL() || 'admin',
        avatar: '/avatars/male-avatar.png',
        pharmacyName: 'PharmaPlus'
      }
      
      // Save to localStorage
      localStorage.setItem('pharma_user', JSON.stringify(mockUser));
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
      // Clear localStorage
      localStorage.removeItem('pharma_user');
      // Clear user state
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

  const updateProfile = async (userData: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) {
        throw new Error('No user logged in');
      }
      
      // Update user with new data
      const updatedUser = { ...user, ...userData };
      
      // Save to localStorage
      localStorage.setItem('pharma_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return true;
    } catch (err) {
      setError('Failed to update profile');
      return false;
    } finally {
      setLoading(false);
    }
  }

  const isAdmin = user?.role === 'admin'

  const hasPermission = (permission: string) => {
    if (!user) return false
    
    // Basic permission mapping based on roles
    const rolePermissions = {
      admin: ['view_dashboard', 'manage_inventory', 'manage_clients', 'view_reports', 'manage_users'],
      pharmacist: ['view_dashboard', 'manage_inventory', 'manage_clients', 'view_reports'],
      staff: ['view_dashboard', 'view_inventory', 'view_clients'],
      cashier: ['view_dashboard', 'view_clients', 'manage_sales']
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
      updateProfile,
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