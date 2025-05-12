import api from "./api"
import type { Alert } from "../types"

export const alertService = {
  async getAll(): Promise<Alert[]> {
    const response = await api.get<Alert[]>("/alerts")
    return response.data
  },

  async getById(id: string): Promise<Alert> {
    const response = await api.get<Alert>(`/alerts/${id}`)
    return response.data
  },

  async create(alert: Omit<Alert, "id" | "createdAt" | "updatedAt">): Promise<Alert> {
    const response = await api.post<Alert>("/alerts", alert)
    return response.data
  },

  async update(id: string, alert: Partial<Alert>): Promise<Alert> {
    const response = await api.put<Alert>(`/alerts/${id}`, alert)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/alerts/${id}`)
  },

  async markAsRead(id: string): Promise<Alert> {
    const response = await api.patch<Alert>(`/alerts/${id}/read`, {})
    return response.data
  },
}
