import apiClient from './api' // Assuming api.js exports the configured axios instance

export const registerUser = (userData) => {
  // userData: { email, password, password_confirmation }
  return apiClient.post('/api/register', userData)
}

export const loginUser = (credentials) => {
  // credentials: { email, password }
  return apiClient.post('/api/login', credentials)
}

export const getUserProfile = () => {
  return apiClient.get('/api/users/profile')
}

export const redirectToGoogleLogin = () => {
  window.location.href = 'http://localhost:8080/api/auth/google/login'
}

export const handleGoogleCallback = (code) => {
  return apiClient.get(`/api/auth/google/callback?code=${code}`)
}

export const redirectToGitHubLogin = () => {
  window.location.href = 'http://localhost:8080/api/auth/github/login'
}

export const handleGitHubCallback = (code) => {
  return apiClient.get(`/api/auth/github/callback?code=${code}`)
}
