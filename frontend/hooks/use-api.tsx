import api from "../lib/api"
import { useState, useRef } from "react"
import { MOCK_PRODUCTS } from "../lib/mock-data"

// Simple cache implementation
type CacheItem = {
  data: any;
  timestamp: number;
  promise?: Promise<any>;
  loading?: boolean;
}

const cache: Record<string, CacheItem> = {};
const CACHE_TTL = 30000; // 30 seconds cache lifetime

// Get from cache or execute the request
const getOrExecute = async (key: string, requestFn: () => Promise<any>) => {
  const now = Date.now();
  
  // If we have a cached response that's not expired, use it
  if (cache[key] && (now - cache[key].timestamp) < CACHE_TTL) {
    console.log(`Using cached response for ${key}`);
    return cache[key].data;
  }
  
  // If we have a pending request, return its promise to avoid duplicate calls
  if (cache[key] && cache[key].promise) {
    console.log(`Reusing pending request for ${key}`);
    return cache[key].promise;
  }
  
  // Check if endpoint is already loading
  if (cache[key] && cache[key].loading) {
    console.log(`Endpoint ${key} is already loading, returning empty result`);
    return Array.isArray(cache[key].data) ? [] : null;
  }
  
  // Otherwise, execute the request and cache the promise
  const promise = requestFn().then(response => {
    // On success, cache the response
    cache[key] = {
      data: response,
      timestamp: Date.now(),
      promise: undefined,
      loading: false
    };
    return response;
  }).catch(error => {
    // On error, clean the cache so it can be retried
    if (cache[key]) {
      cache[key].promise = undefined;
      cache[key].loading = false;
    }
    throw error;
  });
  
  // Cache the promise while it's in flight
  cache[key] = {
    data: null,
    timestamp: 0,
    promise: promise,
    loading: true
  };
  
  return promise;
};

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
    // Create endpoint-specific key
    const cacheKey = 'dashboard-data';
    
    try {
      // Check if this endpoint is already loading
      if (cache[cacheKey]?.loading) return null;
      
      setIsLoading(true)
      setError(null)
      
      return await getOrExecute(cacheKey, async () => {
        const response = await withTimeout(api.get("/dashboard/data"), 5000)
        return response.data
      });
    } catch (err: any) {
      console.error("Error fetching dashboard data:", err)
      setError(err.message || "Failed to fetch dashboard data")
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // Initialize sample data (for testing)
  const initData = async () => {
    const cacheKey = 'init-data';
    
    try {
      if (cache[cacheKey]?.loading) return null;
      
      setIsLoading(true)
      setError(null)
      
      return await getOrExecute(cacheKey, async () => {
        const response = await withTimeout(api.post("/data/init-sample-data"), 5000)
        return response.data
      });
    } catch (err: any) {
      console.error("Error initializing data:", err)
      setError(err.message || "Failed to initialize sample data")
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // Test connection to backend
  const testConnection = async () => {
    const cacheKey = 'test-connection';
    
    try {
      if (cache[cacheKey]?.loading) {
        return { success: false, error: "Request in progress" };
      }
      
      setIsLoading(true)
      setError(null)
      
      return await getOrExecute(cacheKey, async () => {
        const response = await withTimeout(api.get("/test/echo"), 3000)
        return {
          success: true,
          message: "API is connected",
          data: response.data
        }
      });
    } catch (err: any) {
      console.error("Connection test failed:", err)
      setError("Connection to backend failed")
      return {
        success: false,
        error: err.message
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Inventory API methods
  const inventory = {
    // Get all products
    getProducts: async () => {
      const cacheKey = 'inventory-products';
      
      try {
        if (cache[cacheKey]?.loading) return [];
        
        setIsLoading(true)
        setError(null)
        
        return await getOrExecute(cacheKey, async () => {
          try {
            // First try real API
            const response = await withTimeout(api.get("/products"), 5000)
            return response.data
          } catch (err) {
            console.warn("Failed to fetch products from API, using mock data")
            // Fallback to mock data
            return MOCK_PRODUCTS
          }
        });
      } catch (err: any) {
        console.error("Error in getProducts:", err)
        setError(err.message || "Failed to fetch products")
        return []
      } finally {
        setIsLoading(false)
      }
    },
    
    // Get product by ID
    getProduct: async (id: string) => {
      const cacheKey = `product-${id}`;
      
      try {
        if (cache[cacheKey]?.loading) return null;
        
        setIsLoading(true)
        setError(null)
        
        return await getOrExecute(cacheKey, async () => {
          try {
            // First try real API
            const response = await withTimeout(api.get(`/products/${id}`), 5000)
            return response.data
          } catch (err) {
            console.warn(`Failed to fetch product ${id} from API, using mock data`)
            // Fallback to mock data
            const mockProduct = MOCK_PRODUCTS.find(p => p.id === id)
            if (mockProduct) {
              return mockProduct
            } else {
              throw new Error("Product not found")
            }
          }
        });
      } catch (err: any) {
        console.error(`Error in getProduct(${id}):`, err)
        setError(err.message || "Failed to fetch product")
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    
    // Create product
    createProduct: async (productData: any) => {
      const cacheKey = `create-product-${Date.now()}`;
      
      try {
        setIsLoading(true)
        setError(null)
        
        return await getOrExecute(cacheKey, async () => {
          const response = await withTimeout(api.post("/products", productData), 5000)
          return response.data
        });
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
      const cacheKey = `update-product-${id}-${Date.now()}`;
      
      try {
        setIsLoading(true)
        setError(null)
        
        return await getOrExecute(cacheKey, async () => {
          const response = await withTimeout(api.put(`/products/${id}`, productData), 5000)
          return response.data
        });
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
      const cacheKey = `delete-product-${id}-${Date.now()}`;
      
      try {
        setIsLoading(true)
        setError(null)
        
        return await getOrExecute(cacheKey, async () => {
          const response = await withTimeout(api.delete(`/products/${id}`), 5000)
          return response.data
        });
      } catch (err: any) {
        console.error(`Error deleting product ${id}:`, err)
        setError(err.message || "Failed to delete product")
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    
    // Search products
    searchProducts: async (query: string) => {
      const cacheKey = `search-products-${query}`;
      
      try {
        if (cache[cacheKey]?.loading) return [];
        
        setIsLoading(true)
        setError(null)
        
        return await getOrExecute(cacheKey, async () => {
          const response = await withTimeout(api.get(`/products/search?query=${encodeURIComponent(query)}`), 5000)
          return response.data
        });
      } catch (err: any) {
        console.error("Error searching products:", err)
        setError(err.message || "Failed to search products")
        return []
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Client related API calls
  const clients = {
    // Get all clients
    getClients: async () => {
      const cacheKey = 'clients-all';
      
      try {
        if (cache[cacheKey]?.loading) return [];
        
        setIsLoading(true)
        setError(null)
        
        return await getOrExecute(cacheKey, async () => {
          const response = await withTimeout(api.get("/clients"), 5000)
          return response.data
        });
      } catch (err: any) {
        console.error("Error fetching clients:", err)
        setError(err.message || "Failed to fetch clients")
        return []
      } finally {
        setIsLoading(false)
      }
    },
    
    // Get client by ID
    getClient: async (id: string) => {
      const cacheKey = `client-${id}`;
      
      try {
        if (cache[cacheKey]?.loading) return null;
        
        setIsLoading(true)
        setError(null)
        
        return await getOrExecute(cacheKey, async () => {
          const response = await withTimeout(api.get(`/clients/${id}`), 5000)
          return response.data
        });
      } catch (err: any) {
        console.error(`Error fetching client ${id}:`, err)
        setError(err.message || "Failed to fetch client")
        return null
      } finally {
        setIsLoading(false)
      }
    }
  }

  return {
    isLoading,
    error,
    getDashboardData,
    initData,
    testConnection,
    inventory,
    clients
  }
} 