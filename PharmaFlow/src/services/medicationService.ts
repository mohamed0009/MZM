import api from "@/lib/api"
import type { Medication } from "../types"

export const medicationService = {
  async getAll(): Promise<Medication[]> {
    try {
      const response = await api.get<Medication[]>("/medications")
      return response.data
    } catch (error) {
      console.error("Error fetching medications:", error)
      throw error
    }
  },

  async getById(id: string): Promise<Medication> {
    try {
      const response = await api.get<Medication>(`/medications/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching medication ${id}:`, error)
      throw error
    }
  },

  async create(medication: Omit<Medication, "id" | "createdAt" | "updatedAt">): Promise<Medication> {
    try {
      const response = await api.post<Medication>("/medications", medication)
      return response.data
    } catch (error) {
      console.error("Error creating medication:", error)
      throw error
    }
  },

  async update(id: string, medication: Partial<Medication>): Promise<Medication> {
    try {
      const response = await api.put<Medication>(`/medications/${id}`, medication)
      return response.data
    } catch (error) {
      console.error(`Error updating medication ${id}:`, error)
      throw error
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/medications/${id}`)
    } catch (error) {
      console.error(`Error deleting medication ${id}:`, error)
      throw error
    }
  },

  async search(query: string): Promise<Medication[]> {
    try {
      const response = await api.get<Medication[]>(`/medications/search?q=${encodeURIComponent(query)}`)
      return response.data
    } catch (error) {
      console.error(`Error searching medications with query "${query}":`, error)
      throw error
    }
  },
}
