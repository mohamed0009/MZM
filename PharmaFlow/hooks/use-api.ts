import api from "@/lib/api";

// Hook for using the API
export function useApi() {
  // Auth related API calls
  const authApi = {
    login: async (email: string, password: string) => {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Store user data securely
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }
      return response.data;
    },
    register: async (userData: any) => {
      const response = await api.post('/auth/register', userData);
      return response.data;
    },
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  // Inventory related API calls
  const inventoryApi = {
    getProducts: async () => {
      const response = await api.get('/inventory/products');
      return response.data;
    },
    getProduct: async (id: string) => {
      const response = await api.get(`/inventory/products/${id}`);
      return response.data;
    },
    createProduct: async (productData: any) => {
      const response = await api.post('/inventory/products', productData);
      return response.data;
    },
    updateProduct: async (id: string, productData: any) => {
      const response = await api.put(`/inventory/products/${id}`, productData);
      return response.data;
    },
    deleteProduct: async (id: string) => {
      const response = await api.delete(`/inventory/products/${id}`);
      return response.data;
    }
  };

  // Clients related API calls
  const clientsApi = {
    getClients: async () => {
      const response = await api.get('/clients');
      return response.data;
    },
    getClient: async (id: string) => {
      const response = await api.get(`/clients/${id}`);
      return response.data;
    },
    createClient: async (clientData: any) => {
      const response = await api.post('/clients', clientData);
      return response.data;
    },
    updateClient: async (id: string, clientData: any) => {
      const response = await api.put(`/clients/${id}`, clientData);
      return response.data;
    },
    deleteClient: async (id: string) => {
      const response = await api.delete(`/clients/${id}`);
      return response.data;
    }
  };

  // Test connectivity
  const testApi = {
    checkConnection: async () => {
      try {
        const response = await api.get('/test/echo');
        return {
          connected: true,
          data: response.data
        };
      } catch (error) {
        return {
          connected: false,
          error
        };
      }
    }
  };

  return {
    auth: authApi,
    inventory: inventoryApi,
    clients: clientsApi,
    test: testApi,
    api // Expose the axios instance for custom calls
  };
} 