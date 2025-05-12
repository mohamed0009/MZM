import api from "./api"
import type { AuthResponse } from "../types"

let authToken: string | null = null

export const authService = {
  setToken(token: string) {
    authToken = token
  },

  clearToken() {
    authToken = null
  },

  getToken() {
    return authToken
  },

  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", { username, password })
    return response.data
  },

  async register(userData: {
    username: string
    email: string
    password: string
    firstName: string
    lastName: string
  }): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", userData)
    return response.data
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>("/auth/forgot-password", { email })
    return response.data
  },

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>("/auth/reset-password", { token, password })
    return response.data
  },
}
