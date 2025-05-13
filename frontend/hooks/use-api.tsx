import api from "@/lib/api"
import { useState } from "react"

// Add timeout utility function for API calls
const withTimeout = (promise: Promise<any>, timeout: number) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Request timed out after ${timeout}ms`)), timeout)
    )
  ]);
};

export const useApi = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get dashboard data
  const getDashboardData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await withTimeout(api.get("/dashboard/data"), 5000)
      return response.data
    } catch (err: any) {
      console.error("Error fetching dashboard data:", err)
      setError(err.message || "Failed to fetch dashboard data")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Product related API calls
  const inventory = {
    // Get all products
    getProducts: async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await withTimeout(api.get("/products"), 3000)
        return response.data
      } catch (err: any) {
        console.error("Error fetching products:", err)
        setError(err.message || "Failed to fetch products")
        return []
      } finally {
        setIsLoading(false)
      }
    },

    // Get single product
    getProduct: async (id: string) => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await withTimeout(api.get(`/products/${id}`), 3000)
        return response.data
      } catch (err: any) {
        console.error(`Error fetching product ${id}:`, err)
        setError(err.message || "Failed to fetch product")
        return null
      } finally {
        setIsLoading(false)
      }
    },

    // Create new product
    createProduct: async (productData: any) => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await withTimeout(api.post("/products", productData), 5000)
        return response.data
      } catch (err: any) {
        console.error("Error creating product:", err)
        setError(err.message || "Failed to create product")
        throw err
      } finally {
        setIsLoading(false)
      }
    },

    // Update product
    updateProduct: async (id: string, productData: any) => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await withTimeout(api.put(`/products/${id}`, productData), 5000)
        return response.data
      } catch (err: any) {
        console.error(`Error updating product ${id}:`, err)
        setError(err.message || "Failed to update product")
        throw err
      } finally {
        setIsLoading(false)
      }
    },

    // Delete product
    deleteProduct: async (id: string) => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await withTimeout(api.delete(`/products/${id}`), 5000)
        return response.data
      } catch (err: any) {
        console.error(`Error deleting product ${id}:`, err)
        setError(err.message || "Failed to delete product")
        throw err
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Client related API calls
  const clients = {
    // Get all clients
    getClients: async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await withTimeout(api.get("/clients"), 3000)
        return response.data
      } catch (err: any) {
        console.error("Error fetching clients:", err)
        setError(err.message || "Failed to fetch clients")
        return []
      } finally {
        setIsLoading(false)
      }
    },

    // Get single client
    getClient: async (id: string) => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await withTimeout(api.get(`/clients/${id}`), 3000)
        return response.data
      } catch (err: any) {
        console.error(`Error fetching client ${id}:`, err)
        setError(err.message || "Failed to fetch client")
        return null
      } finally {
        setIsLoading(false)
      }
    },

    // Create new client
    createClient: async (clientData: any) => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await withTimeout(api.post("/clients", clientData), 5000)
        return response.data
      } catch (err: any) {
        console.error("Error creating client:", err)
        setError(err.message || "Failed to create client")
        throw err
      } finally {
        setIsLoading(false)
      }
    }
  }

  return {
    isLoading,
    error,
    getDashboardData,
    inventory,
    clients
  }
} 