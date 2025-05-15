import axios, { AxiosError, AxiosRequestConfig, AxiosInstance } from 'axios';

// Use relative URL for API calls to work with Next.js rewrites/proxy
const API_URL = '/api';
console.log('Using API URL with proxy:', API_URL);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage if it exists
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
    
    // If token exists, add Authorization header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Try to refresh token
      try {
        const refreshToken = localStorage.getItem('refresh-token');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
          const { token } = response.data;
          
          // Store the new token
          localStorage.setItem('auth-token', token);
          
          // Update the original request header
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          
          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-token');
          localStorage.removeItem('refresh-token');
          window.location.href = '/auth/login';
        }
      }
    }
    
    // Enhanced error logging
    if (process.env.NODE_ENV !== 'production') {
      console.error('API Response Error:', error.message);
      
      // Log specific information about CORS errors
      if (error.message === 'Network Error') {
        console.error('CORS ERROR: This is likely a Cross-Origin Resource Sharing (CORS) issue.');
        console.error('Check that your backend server is:');
        console.error('1. Running and accessible');
        console.error('2. Configured to accept requests from ' + window.location.origin);
        console.error('3. Setting the correct Access-Control-Allow-Origin header');
        console.error('---');
        console.error('Request URL:', originalRequest?.url);
        console.error('Origin:', window.location.origin);
        console.error('---');
        console.error('Using proxy via Next.js rewrites to avoid CORS.');
      }
      
      if (error.response) {
        console.error('Request URL:', originalRequest.url);
        console.error('Request Method:', originalRequest.method);
        console.error('Status:', error.response.status);
        console.error('Response Data:', error.response.data);
      }
    }
    
    return Promise.reject(error);
  }
);

// Function to check backend connection
export const checkBackendConnection = async () => {
  try {
    console.log('Attempting to connect to backend at:', API_URL + '/test/echo');
    
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
    
    // More detailed error information
    let errorDetails = {
      message: axiosError.message || 'Connection failed',
      code: axiosError.code,
      status: axiosError.response?.status,
      url: axiosError.config?.url,
      possibleIssue: ''
    };
    
    // Add helpful troubleshooting information
    if (!axiosError.response) {
      if (axiosError.message.includes('Network Error')) {
        errorDetails.possibleIssue = 'Possible CORS issue or backend server is not running';
      } else if (axiosError.code === 'ECONNABORTED') {
        errorDetails.possibleIssue = 'Connection timed out. Backend server might be slow or unresponsive';
      }
    }
    
    return { 
      isConnected: false, 
      message: 'Unable to connect to backend',
      error: errorDetails
    };
  }
};

// Helper function to directly access the mock login endpoint
export const mockLogin = async (email: string, password: string) => {
  try {
    console.log('Attempting direct mock login with:', { email, password });
    // Correctly format the API URL for auth endpoints
    const loginUrl = `${API_URL}/auth/login`;
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

export default api; 