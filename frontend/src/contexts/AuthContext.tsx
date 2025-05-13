"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { User, AuthResponse } from "../types"
import { authService } from "../services/authService"

interface AuthContextData {
  user: User | null
  loading: boolean
  signIn: (username: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signUp: (userData: {
    username: string
    email: string
    password: string
    firstName: string
    lastName: string
  }) => Promise<void>
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStorageData() {
      const storedUser = await AsyncStorage.getItem("@PharmaSys:user")
      const storedToken = await AsyncStorage.getItem("@PharmaSys:token")

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser))
        authService.setToken(storedToken)
      }

      setLoading(false)
    }

    loadStorageData()
  }, [])

  async function signIn(username: string, password: string) {
    try {
      const response: AuthResponse = await authService.login(username, password)

      setUser(response.user)
      authService.setToken(response.token)

      await AsyncStorage.setItem("@PharmaSys:user", JSON.stringify(response.user))
      await AsyncStorage.setItem("@PharmaSys:token", response.token)
    } catch (error) {
      throw error
    }
  }

  async function signOut() {
    await AsyncStorage.removeItem("@PharmaSys:user")
    await AsyncStorage.removeItem("@PharmaSys:token")

    setUser(null)
    authService.clearToken()
  }

  async function signUp(userData: {
    username: string
    email: string
    password: string
    firstName: string
    lastName: string
  }) {
    try {
      const response: AuthResponse = await authService.register(userData)

      setUser(response.user)
      authService.setToken(response.token)

      await AsyncStorage.setItem("@PharmaSys:user", JSON.stringify(response.user))
      await AsyncStorage.setItem("@PharmaSys:token", response.token)
    } catch (error) {
      throw error
    }
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signOut, signUp }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
