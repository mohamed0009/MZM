import api from "./api"
import type { Client } from "../types"

export const clientService = {
  async getAll(): Promise<Client[]> {
    const response = await api.get<Client[]>("/clients")
    return response.data
  },

  async getById(id: string): Promise<Client> {
    const response = await api.get<Client>(`/clients/${id}`)
    return response.data
  },

  async create(client: Omit<Client, "id" | "createdAt" | "updatedAt">): Promise<Client> {
    const response = await api.post<Client>("/clients", client)
    return response.data
  },

  async update(id: string, client: Partial<Client>): Promise<Client> {
    const response = await api.put<Client>(`/clients/${id}`, client)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/clients/${id}`)
  },

  async search(query: string): Promise<Client[]> {
    const response = await api.get<Client[]>(`/clients/search?q=${query}`)
    return response.data
  },
}
