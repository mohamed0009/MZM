"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AnyPermission, Role, UserPermissions, hasPermission } from '@/lib/permissions'
import { logSecurityEvent } from '@/lib/audit'

// Get browser details for audit logging
const getBrowserInfo = () => {
  if (typeof window === 'undefined') return { ip: 'server', userAgent: 'server' };
  
  return {
    ip: '127.0.0.1', // Would be set by server in real implementation
    userAgent: window.navigator.userAgent
  };
};

interface User {
  id: string
  name: string
  email: string
  role: Role
  avatar?: string
  pharmacyName?: string
  permissions?: UserPermissions
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
  hasPermission: (permission: AnyPermission, siteId?: string) => boolean
  requestEmergencyAccess: (reason: string, permissions: AnyPermission[]) => Promise<boolean>
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
        const parsedUser = JSON.parse(savedUser);
        
        // Add permissions structure if not present
        if (!parsedUser.permissions) {
          parsedUser.permissions = {
            userId: parsedUser.id,
            role: parsedUser.role,
          };
        }
        
        setUser(parsedUser);
        
        // Log session resumption for audit
        const { ip, userAgent } = getBrowserInfo();
        logSecurityEvent(
          parsedUser.id,
          parsedUser.name,
          parsedUser.role,
          'access',
          'User session resumed',
          true,
          ip,
          userAgent
        );
        
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
        pharmacyName: 'PharmaPlus',
        permissions: {
          userId: '1',
          role: getUserRoleFromURL() || 'admin'
        }
      }
      
      // Save to localStorage
      localStorage.setItem('pharma_user', JSON.stringify(mockUser));
      setUser(mockUser)
      
      // Log demo user creation for audit
      const { ip, userAgent } = getBrowserInfo();
      logSecurityEvent(
        mockUser.id,
        mockUser.name,
        mockUser.role,
        'login',
        'Demo user auto-created',
        true,
        ip,
        userAgent
      );
    } catch (err) {
      setError('Failed to check session')
      console.error('Session check error:', err);
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
  const getUserRoleFromURL = (): Role | null => {
    if (typeof window === 'undefined') return null;
    
    const params = new URLSearchParams(window.location.search);
    const role = params.get('userRole');
    
    if (role === 'admin' || role === 'pharmacist' || role === 'technician' || role === 'cashier') {
      return role;
    }
    
    return null;
  }
  
  // Generate a random person name for testing
  const generateRandomName = (): string => {
    const firstNames = ['Mohamed', 'Fatima', 'Ahmed', 'Aisha', 'Yousef', 'Layla', 'Omar', 'Nora'];
    const lastNames = ['El Mansouri', 'Benali', 'Tazi', 'Alaoui', 'El Fassi', 'Benjelloun'];
    
    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return `${randomFirstName} ${randomLastName}`;
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // Here you would normally make an API request to authenticate
      // For demo purposes, we'll accept any login with a valid email format
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      
      if (!isValidEmail) {
        setError('Please enter a valid email address');
        return false;
      }
      
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
      
      // Create mock user based on email domain
      const isAdmin = email.includes('admin') || email.includes('pharmacyflow.ma');
      const isPharmacist = email.includes('pharmacist') || email.includes('pharmacy');
      
      const mockUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' '),
        email: email,
        role: isAdmin ? 'admin' : isPharmacist ? 'pharmacist' : 'technician',
        avatar: '/avatars/male-avatar.png',
        pharmacyName: 'PharmaPlus',
        permissions: {
          userId: Math.random().toString(36).substring(2, 9),
          role: isAdmin ? 'admin' : isPharmacist ? 'pharmacist' : 'technician'
        }
      };
      
      // Log successful login
      const { ip, userAgent } = getBrowserInfo();
      await logSecurityEvent(
        mockUser.id,
        mockUser.name,
        mockUser.role,
        'login',
        'User logged in successfully',
        true,
        ip,
        userAgent
      );
      
      // Save user to localStorage
      localStorage.setItem('pharma_user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(`Login failed: ${errorMessage}`);
      
      // Log failed login attempt
      const { ip, userAgent } = getBrowserInfo();
      await logSecurityEvent(
        'anonymous',
        email || 'unknown',
        'none',
        'login',
        'Login attempt failed',
        false,
        ip,
        userAgent,
        errorMessage
      );
      
      return false;
    } finally {
      setLoading(false);
    }
  }

  const logout = async () => {
    try {
      setLoading(true);
      
      // Log the logout event before clearing user data
      if (user) {
        const { ip, userAgent } = getBrowserInfo();
        await logSecurityEvent(
          user.id,
          user.name,
          user.role,
          'logout',
          'User logged out',
          true,
          ip,
          userAgent
        );
      }
      
      // Remove user from localStorage
      localStorage.removeItem('pharma_user');
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  }

  const refreshToken = async () => {
    // This would typically make an API call to refresh the auth token
    // For now, just extend the session
    try {
      if (user) {
        const extendedUser = { ...user, lastRefresh: new Date().toISOString() };
        localStorage.setItem('pharma_user', JSON.stringify(extendedUser));
      }
    } catch (err) {
      console.error('Token refresh error:', err);
    }
  }

  const updateProfile = async (userData: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) {
        throw new Error('No user logged in');
      }
      
      // Capture previous state for audit
      const previousState = { ...user };
      
      // Update user with new data
      const updatedUser = { ...user, ...userData };
      
      // Save to localStorage
      localStorage.setItem('pharma_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      // Log profile update
      const { ip, userAgent } = getBrowserInfo();
      await logSecurityEvent(
        user.id,
        user.name,
        user.role,
        'access',
        'User profile updated',
        true,
        ip,
        userAgent
      );
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to update profile: ${errorMessage}`);
      
      // Log failed profile update
      if (user) {
        const { ip, userAgent } = getBrowserInfo();
        await logSecurityEvent(
          user.id,
          user.name,
          user.role,
          'access',
          'Profile update failed',
          false,
          ip,
          userAgent,
          errorMessage
        );
      }
      
      return false;
    } finally {
      setLoading(false);
    }
  }

  const isAdmin = user?.role === 'admin';

  // Enhanced permission check that uses our new system
  const checkPermission = (permission: AnyPermission, siteId?: string) => {
    if (!user || !user.permissions) return false;
    
    return hasPermission(user.permissions, permission, siteId);
  }

  // Request emergency access for temporary elevated permissions
  const requestEmergencyAccess = async (reason: string, permissions: AnyPermission[]): Promise<boolean> => {
    try {
      if (!user) return false;
      
      setLoading(true);
      
      // Log the emergency access request
      const { ip, userAgent } = getBrowserInfo();
      await logSecurityEvent(
        user.id,
        user.name,
        user.role,
        'emergency',
        `Emergency access requested: ${reason}`,
        true,
        ip,
        userAgent
      );
      
      // Create temporary permissions
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 30); // 30 minute access
      
      // Update user permissions
      const updatedUser = {
        ...user,
        permissions: {
          ...(user.permissions || {}),
          userId: user.id, // Ensure userId is explicitly set
          role: user.role, // Ensure role is explicitly set
          temporaryPermissions: {
            permissions,
            expiresAt,
            grantedBy: 'system', // In a real system, this would be approved by an admin
            reason
          }
        }
      };
      
      localStorage.setItem('pharma_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return true;
    } catch (error) {
      console.error('Emergency access error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

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
      hasPermission: checkPermission,
      requestEmergencyAccess
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