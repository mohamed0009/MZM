import api from "./api"
import type { Event } from "../types"

export const eventService = {
  async getAll(): Promise<Event[]> {
    const response = await api.get<Event[]>("/events")
    return response.data
  },

  async getById(id: string): Promise<Event> {
    const response = await api.get<Event>(`/events/${id}`)
    return response.data
  },

  async create(event: Omit<Event, "id" | "createdAt" | "updatedAt">): Promise<Event> {
    const response = await api.post<Event>("/events", event)
    return response.data
  },

  async update(id: string, event: Partial<Event>): Promise<Event> {
    const response = await api.put<Event>(`/events/${id}`, event)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/events/${id}`)
  },

  async getByDateRange(startDate: string, endDate: string): Promise<Event[]> {
    const response = await api.get<Event[]>(`/events/range?start=${startDate}&end=${endDate}`)
    return response.data
  },
}
