export interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  role: "ADMIN" | "PHARMACIST" | "TECHNICIAN"
  createdAt: string
  updatedAt: string
}

export interface Medication {
  id: string
  name: string
  description: string
  category: string
  price: number
  stock: number
  expiryDate: string
  manufacturer: string
  dosage: string
  createdAt: string
  updatedAt: string
}

export interface Client {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  dateOfBirth: string
  status: "ACTIVE" | "INACTIVE"
  createdAt: string
  updatedAt: string
}

export interface Alert {
  id: string
  title: string
  message: string
  category: "INVENTORY" | "CLIENT" | "SYSTEM"
  priority: "LOW" | "MEDIUM" | "HIGH"
  isRead: boolean
  createdAt: string
  updatedAt: string
}

export interface Event {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  type: "MEETING" | "REMINDER" | "DELIVERY"
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface DashboardStats {
  totalMedications: number
  totalClients: number
  lowStockCount: number
  expiringMedicationsCount: number
  recentAlerts: Alert[]
  upcomingEvents: Event[]
}
