import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'https://api.pharmaflow.example.com'; // Replace with your actual API URL

// Create a new axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the token to each request
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  // Login user and get token
  async login(email: string, password: string) {
    try {
      // For demo purposes, mock the response
      // In a real app, uncomment the API call
      /*
      const response = await api.post('/auth/login', {
        email,
        password,
      });
      return response.data;
      */
      
      // Mock response
      return {
        token: 'mock-jwt-token',
        user: {
          id: '1',
          email,
          name: 'John Doe',
          role: 'admin',
        },
      };
    } catch (error) {
      throw new Error('Authentication failed');
    }
  },

  // Register new user
  async register(userData: { email: string; password: string; name: string }) {
    try {
      // For demo purposes, mock the response
      /*
      const response = await api.post('/auth/register', userData);
      return response.data;
      */
      
      // Mock response
      return {
        token: 'mock-jwt-token',
        user: {
          id: '1',
          email: userData.email,
          name: userData.name,
          role: 'user',
        },
      };
    } catch (error) {
      throw new Error('Registration failed');
    }
  },

  // Get user profile
  async getProfile() {
    try {
      // For demo purposes, mock the response
      /*
      const response = await api.get('/auth/profile');
      return response.data;
      */
      
      // Mock response
      return {
        id: '1',
        email: 'john.doe@example.com',
        name: 'John Doe',
        role: 'admin',
      };
    } catch (error) {
      throw new Error('Failed to get user profile');
    }
  },
};

export default api;