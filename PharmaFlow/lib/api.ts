import axios, { AxiosError, AxiosRequestConfig, AxiosInstance } from 'axios';

// Log API configuration for debugging
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
console.log('API URL:', apiUrl);

// Create standard axios instance with base URL
const api = axios.create({
  baseURL: apiUrl,
  timeout: 10000, // Reduced timeout for faster error feedback
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cache-Control': 'no-cache'
  },
  withCredentials: false // Important for CORS with our mock server
});

// Add a request interceptor for auth token and logging
api.interceptors.request.use(
  (config) => {
    // Log request for debugging
    console.log(`Making API request to: ${config.method?.toUpperCase()} ${config.url}`, config);
    
    // Get the token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    // If token exists, add it to the headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling and logging
api.interceptors.response.use(
  (response) => {
    console.log('API Response Success:', response.config.url, response.data);
    return response;
  },
  async (error) => {
    console.error('API Response Error:', error.message);
    
    if (error.config) {
      console.error('Request URL:', error.config.url);
      console.error('Request Method:', error.config.method);
      console.error('Request Data:', error.config.data);
    }
    
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
    }
    
    const originalRequest = error.config;
    
    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear expired tokens
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      
      console.log('Unauthorized: Redirecting to login page');
      // Don't redirect automatically, let the auth context handle it
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

// Function to check backend connection
export const checkBackendConnection = async () => {
  try {
    console.log('Attempting to connect to backend at:', apiUrl + '/test/echo');
    
    // Use axios directly for consistency
    const response = await api.get('/test/echo');
    console.log('Backend connection successful:', response.data);
    
    return { 
      isConnected: true, 
      message: 'Backend is connected',
      details: response.data
    };
  } catch (error) {
    console.error('Backend connection failed:', error);
    const axiosError = error as AxiosError;
    return { 
      isConnected: false, 
      message: 'Unable to connect to backend',
      error: {
        message: axiosError.message || 'Connection failed',
        code: axiosError.code,
        status: axiosError.response?.status,
        url: axiosError.config?.url
      }
    };
  }
};

// Helper function to directly access the mock login endpoint
export const mockLogin = async (email: string, password: string) => {
  try {
    console.log('Attempting direct mock login with:', { email, password });
    // Correctly format the API URL for auth endpoints
    const loginUrl = `${apiUrl}/auth/login`;
    console.log('Login URL:', loginUrl);
    
    // Use fetch API for direct access
    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    
    // Handle non-ok responses
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Direct mock login response:', data);
    
    // Ensure user data is correctly formatted for our app
    if (data && data.user) {
      // Fix any missing properties in user object
      const user = {
        ...data.user,
        // Ensure permissions array exists
        permissions: data.user.permissions || []
      };
      
      return {
        ...data,
        user
      };
    }
    
    return data;
  } catch (error) {
    console.error('Direct mock login failed:', error);
    throw error;
  }
};

// Emergency hardcoded login function for mock server issues
export const hardcodedLogin = () => {
  // This is a last resort fallback to be used when server has issues
  const mockResponse = {
    token: "mock-jwt-token-fallback",
    user: {
      id: "1",
      email: "admin@example.com",
      name: "Admin User",
      role: "admin",
      permissions: [
        {
          id: "1",
          name: "VIEW_CLIENTS",
          description: "Voir la liste des clients"
        },
        {
          id: "2",
          name: "EDIT_CLIENTS",
          description: "Modifier les informations des clients"
        },
        {
          id: "3",
          name: "VIEW_INVENTORY",
          description: "Voir l'inventaire des produits"
        },
        {
          id: "4",
          name: "EDIT_INVENTORY",
          description: "Modifier l'inventaire des produits"
        }
      ]
    }
  };
  
  console.log('Using hardcoded login response:', mockResponse);
  return mockResponse;
};

// Simple API client for the dashboard

// Mock data for development
const mockData = {
  stats: {
    totalSales: 8459,
    totalOrders: 145,
    totalCustomers: 72,
    totalRevenue: 145890,
    totalProducts: 728,
    lowStockProducts: 12,
    totalClients: 96,
    recentSales: 8459,
    pendingOrders: 5,
    alerts: 8
  },
  salesChart: {
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul"],
    data: [4500, 3800, 5200, 2900, 1950, 2400, 3600]
  },
  recentSales: [
    {
      id: "1",
      customer: "Mohammed Alami",
      amount: 450,
      date: "Il y a 3 heures"
    },
    {
      id: "2",
      customer: "Fatima Benali",
      amount: 235,
      date: "Il y a 5 heures"
    },
    {
      id: "3",
      customer: "Youssef Mansouri",
      amount: 899,
      date: "Hier"
    },
    {
      id: "4",
      customer: "Amina Tazi",
      amount: 340,
      date: "Hier"
    }
  ],
  recentSalesCount: 5,
  alerts: [
    { id: "1", title: "Rupture de stock", message: "Paracétamol 500mg" },
    { id: "2", title: "Expiration proche", message: "Amoxicilline 1g" }
  ],
  inventory: [
    { id: "1", name: "Paracétamol 500mg", stock: 5, category: "Analgésique" },
    { id: "2", name: "Amoxicilline 1g", stock: 12, category: "Antibiotique" }
  ],
  clients: [
    { id: "1", name: "Mohammed Alami", phone: "+212 612 345 678" },
    { id: "2", name: "Fatima Benali", phone: "+212 634 567 890" }
  ],
  calendar: [
    { id: "1", title: "Livraison fournisseur", date: "2024-04-28" },
    { id: "2", title: "Inventaire mensuel", date: "2024-04-30" }
  ],
  analytics: [
    { id: "1", title: "Ventes par catégorie", data: [30, 25, 20, 15, 10] }
  ],
  settings: {
    pharmacyName: "PharmaFlow",
    address: "12 Rue des Pharmaciens, Casablanca",
    phone: "+212 522 123 456"
  },
  prescriptions: [
    { 
      id: "1", 
      patient: { name: "Mohammed Alami", avatar: "/avatars/default.png" },
      doctor: "Dr. Rachid Mansouri",
      date: "2024-04-20",
      status: "pending",
      medications: [
        { id: "1", name: "Paracétamol 500mg", quantity: 2, dosage: "1 comprimé 3x/jour" }
      ]
    }
  ]
};

// Simple mock API client
const apiClient = {
  get: async (url: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return mock data based on the URL
    if (url.includes('/api/dashboard/data')) {
      return { data: mockData };
    }
    
    // Return empty data for other endpoints
    return { data: {} };
  },
  
  post: async (url: string, data: any) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return success response
    return { data: { success: true } };
  },
  
  put: async (url: string, data: any) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return success response
    return { data: { success: true } };
  },
  
  delete: async (url: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return success response
    return { data: { success: true } };
  }
};

export default apiClient; 