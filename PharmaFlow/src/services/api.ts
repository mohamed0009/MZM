import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Remplacez cette URL par l'URL de votre API backend
const API_URL = "https://api.pharmasys.com"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Intercepteur pour ajouter le token d'authentification à chaque requête
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("@PharmaSys:token")

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Si l'erreur est 401 (non autorisé) et que nous n'avons pas déjà essayé de rafraîchir le token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Ici, vous pourriez implémenter une logique pour rafraîchir le token
      // Pour l'instant, nous allons simplement rediriger vers la page de connexion
      await AsyncStorage.removeItem("@PharmaSys:user")
      await AsyncStorage.removeItem("@PharmaSys:token")

      // La redirection sera gérée par le navigateur

      return Promise.reject(error)
    }

    return Promise.reject(error)
  },
)

export default api
