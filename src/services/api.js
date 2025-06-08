import axios from 'axios'
import { useAuthStore } from '../stores/auth' // Import Pinia store

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8089'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor: Add JWT token to headers
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore() // Get store instance
    const token = authStore.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response Interceptor (basic setup, can be enhanced for token refresh)
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle global errors, e.g., 401 Unauthorized
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore()
      authStore.logout() // Or a more specific action like handleUnauthorized
      // Potentially redirect to login, but usually handled by router guard or component
      // For now, just log out
      console.error('Unauthorized, logging out.')
    }
    return Promise.reject(error)
  },
)

export default apiClient
