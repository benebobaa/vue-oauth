import apiClient from './api'; // Assuming api.js exports the configured axios instance

export const registerUser = (userData) => {
  // userData: { email, password, password_confirmation }
  return apiClient.post('/api/register', userData);
};

export const loginUser = (credentials) => {
  // credentials: { email, password }
  return apiClient.post('/api/login', credentials);
};

export const getUserProfile = () => {
  return apiClient.get('/users/profile');
};

// OAuth related functions can be added later
// export const redirectToOAuthProvider = (provider) => { ... }
// export const handleOAuthLoginCallback = (provider, code, state) => { ... }
