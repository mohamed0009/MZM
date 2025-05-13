/**
 * PharmaFlow Frontend Adapter
 * Ce module sert d'adaptateur entre les composants frontend et l'API backend
 */

import api from './api';
import { toast } from '@/components/ui/use-toast';

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: {field: string, message: string}[];
}

// Configuration
const API_TIMEOUT = 15000; // 15 secondes

/**
 * Wrapper pour gérer les erreurs API de manière uniforme
 */
export const apiRequest = async <T = any>(
  method: 'get' | 'post' | 'put' | 'delete',
  endpoint: string,
  data?: any,
  options?: {
    showErrorToast?: boolean;
    showSuccessToast?: boolean;
    successMessage?: string;
    timeout?: number;
  }
): Promise<ApiResponse<T>> => {
  const opts = {
    showErrorToast: true,
    showSuccessToast: false,
    successMessage: 'Opération réussie',
    timeout: API_TIMEOUT,
    ...options
  };
  
  try {
    let response;
    const config = { timeout: opts.timeout };
    
    switch (method) {
      case 'get':
        response = await api.get(endpoint, config);
        break;
      case 'post':
        response = await api.post(endpoint, data, config);
        break;
      case 'put':
        response = await api.put(endpoint, data, config);
        break;
      case 'delete':
        response = await api.delete(endpoint, { ...config, data });
        break;
      default:
        throw new Error(`Méthode non supportée: ${method}`);
    }
    
    // Traiter la réponse selon le format de l'API
    const result: ApiResponse<T> = response.data?.success !== undefined 
      ? response.data 
      : { success: true, data: response.data };
    
    if (opts.showSuccessToast) {
      toast({
        title: "Succès",
        description: opts.successMessage,
        variant: "default",
      });
    }
    
    return result;
  } catch (error: any) {
    console.error(`Erreur API [${method.toUpperCase()} ${endpoint}]:`, error);
    
    const errorResponse: ApiResponse = {
      success: false,
      message: error.response?.data?.message || error.message || 'Une erreur est survenue'
    };
    
    if (error.response?.data?.errors) {
      errorResponse.errors = error.response.data.errors;
    }
    
    if (opts.showErrorToast) {
      toast({
        title: "Erreur",
        description: errorResponse.message,
        variant: "destructive",
      });
    }
    
    return errorResponse;
  }
};

// Adaptateurs pour les différentes sections de l'application

// Adaptateur pour le tableau de bord
export const dashboardAdapter = {
  getData: async (role?: string) => {
    return apiRequest<any>('get', `/dashboard/data${role ? `?role=${role}` : ''}`);
  },
  getStats: async () => {
    return apiRequest<any>('get', '/dashboard/stats');
  }
};

// Adaptateur pour les produits
export const productsAdapter = {
  getAll: async () => {
    return apiRequest<any[]>('get', '/products');
  },
  getById: async (id: number | string) => {
    return apiRequest<any>('get', `/products/${id}`);
  },
  create: async (data: any) => {
    return apiRequest<any>('post', '/products', data, {
      showSuccessToast: true,
      successMessage: 'Produit créé avec succès'
    });
  },
  update: async (id: number | string, data: any) => {
    return apiRequest<any>('put', `/products/${id}`, data, {
      showSuccessToast: true,
      successMessage: 'Produit mis à jour avec succès'
    });
  },
  delete: async (id: number | string) => {
    return apiRequest<void>('delete', `/products/${id}`, null, {
      showSuccessToast: true,
      successMessage: 'Produit supprimé avec succès'
    });
  },
  search: async (query: string) => {
    return apiRequest<any[]>('get', `/products/search?name=${encodeURIComponent(query)}`);
  },
  getLowStock: async () => {
    return apiRequest<any[]>('get', '/products/low-stock');
  },
  getByCategory: async (category: string) => {
    return apiRequest<any[]>('get', `/products/category/${encodeURIComponent(category)}`);
  },
  getCategories: async () => {
    return apiRequest<any[]>('get', '/products/categories');
  },
  getStats: async () => {
    return apiRequest<any>('get', '/products/stats');
  }
};

// Adaptateur pour les clients
export const clientsAdapter = {
  getAll: async () => {
    return apiRequest<any[]>('get', '/clients');
  },
  getById: async (id: number | string) => {
    return apiRequest<any>('get', `/clients/${id}`);
  },
  create: async (data: any) => {
    return apiRequest<any>('post', '/clients', data, {
      showSuccessToast: true,
      successMessage: 'Client créé avec succès'
    });
  },
  update: async (id: number | string, data: any) => {
    return apiRequest<any>('put', `/clients/${id}`, data, {
      showSuccessToast: true,
      successMessage: 'Client mis à jour avec succès'
    });
  },
  delete: async (id: number | string) => {
    return apiRequest<void>('delete', `/clients/${id}`, null, {
      showSuccessToast: true,
      successMessage: 'Client supprimé avec succès'
    });
  },
  search: async (query: string) => {
    return apiRequest<any[]>('get', `/clients/search?name=${encodeURIComponent(query)}`);
  },
  getByStatus: async (status: string) => {
    return apiRequest<any[]>('get', `/clients/status/${encodeURIComponent(status)}`);
  },
  getWithPrescription: async () => {
    return apiRequest<any[]>('get', '/clients/with-prescription');
  },
  getStatuses: async () => {
    return apiRequest<any[]>('get', '/clients/statuses');
  },
  getStats: async () => {
    return apiRequest<any>('get', '/clients/stats');
  }
};

// Adaptateur pour les ventes
export const salesAdapter = {
  getAll: async () => {
    return apiRequest<any[]>('get', '/sales');
  },
  getById: async (id: number | string) => {
    return apiRequest<any>('get', `/sales/${id}`);
  },
  create: async (data: any) => {
    return apiRequest<any>('post', '/sales', data, {
      showSuccessToast: true,
      successMessage: 'Vente enregistrée avec succès'
    });
  },
  getStats: async (period?: string) => {
    return apiRequest<any>('get', `/sales/stats${period ? `?period=${period}` : ''}`);
  }
};

// Adaptateur pour les prescriptions
export const prescriptionsAdapter = {
  getAll: async () => {
    return apiRequest<any[]>('get', '/prescriptions');
  },
  getById: async (id: number | string) => {
    return apiRequest<any>('get', `/prescriptions/${id}`);
  },
  create: async (data: any) => {
    return apiRequest<any>('post', '/prescriptions', data, {
      showSuccessToast: true,
      successMessage: 'Prescription créée avec succès'
    });
  },
  update: async (id: number | string, data: any) => {
    return apiRequest<any>('put', `/prescriptions/${id}`, data, {
      showSuccessToast: true,
      successMessage: 'Prescription mise à jour avec succès'
    });
  },
  complete: async (id: number | string) => {
    return apiRequest<any>('put', `/prescriptions/${id}/complete`, null, {
      showSuccessToast: true,
      successMessage: 'Prescription complétée avec succès'
    });
  },
  cancel: async (id: number | string) => {
    return apiRequest<any>('put', `/prescriptions/${id}/cancel`, null, {
      showSuccessToast: true,
      successMessage: 'Prescription annulée'
    });
  }
};

// Adaptateur pour l'authentification
export const authAdapter = {
  login: async (email: string, password: string) => {
    return apiRequest<{token: string, user: any}>('post', '/auth/login', { email, password });
  },
  register: async (userData: any) => {
    return apiRequest<{token: string, user: any}>('post', '/auth/register', userData);
  },
  resetPassword: async (email: string) => {
    return apiRequest<void>('post', '/auth/reset-password', { email }, {
      showSuccessToast: true,
      successMessage: 'Instructions envoyées à votre adresse email'
    });
  },
  getProfile: async () => {
    return apiRequest<any>('get', '/auth/profile');
  },
  updateProfile: async (data: any) => {
    return apiRequest<any>('put', '/auth/profile', data, {
      showSuccessToast: true,
      successMessage: 'Profil mis à jour avec succès'
    });
  }
};

// Adaptateur pour l'initialisation de données
export const dataInitAdapter = {
  initProducts: async (count: number) => {
    return apiRequest<{message: string}>('post', `/data/init-products?count=${count}`, null, {
      showSuccessToast: true,
      successMessage: 'Produits initialisés avec succès'
    });
  },
  initClients: async (count: number) => {
    return apiRequest<{message: string}>('post', `/data/init-clients?count=${count}`, null, {
      showSuccessToast: true,
      successMessage: 'Clients initialisés avec succès'
    });
  }
};

// Exportation des adaptateurs
export default {
  dashboard: dashboardAdapter,
  products: productsAdapter,
  clients: clientsAdapter,
  sales: salesAdapter,
  prescriptions: prescriptionsAdapter,
  auth: authAdapter,
  dataInit: dataInitAdapter
}; 