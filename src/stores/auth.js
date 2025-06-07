import { defineStore } from 'pinia';
import * as authService from '@/services/authService'; // Using @ for /src
import router from '@/router'; // Using @ for /src
// import apiClient from '@/services/api'; // No longer directly used here
import { useToast } from '@/composables/useToast';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('authToken') || null,
    // error: null, // Optional: for storing error messages
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
    // getError: (state) => state.error, // Optional
  },
  actions: {
    setToken(newToken) {
      this.token = newToken;
      if (newToken) {
        localStorage.setItem('authToken', newToken);
      } else {
        localStorage.removeItem('authToken');
      }
    },
    setUser(userData) {
      this.user = userData;
    },
    // Optional: for setting errors
    // setError(message) {
    //   this.error = message;
    // },
    // clearError() {
    //   this.error = null;
    // },
    async login(credentials) {
      const { showToast } = useToast();
      try {
        const response = await authService.loginUser(credentials);
        if (response.data && response.data.success && response.data.data.token) {
          this.setToken(response.data.data.token);
          this.setUser(response.data.data.user);
          showToast('Login successful!', 'success');
          await router.push({ name: 'Dashboard' });
          return true;
        }
        const apiErrorMessage = response.data?.message || 'Login failed: Invalid response from server.';
        throw new Error(apiErrorMessage);
      } catch (error) {
        console.error('Login error (via service):', error);
        const errorMessage = error.response?.data?.message ||
                           (error.response?.data?.errors ? error.response.data.errors.join(', ') : null) ||
                           error.message ||
                           'An unexpected error occurred during login.';
        showToast(errorMessage, 'error');
        throw new Error(errorMessage);
      }
    },
    async register(userData) {
      const { showToast } = useToast();
      try {
        const response = await authService.registerUser(userData);
        if (response.data && response.data.success && response.data.data.token) {
          this.setToken(response.data.data.token);
          this.setUser(response.data.data.user);
          showToast('Registration successful!', 'success');
          await router.push({ name: 'Dashboard' });
          return true;
        }
        const apiErrorMessage = response.data?.message || 'Registration failed: Invalid response from server.';
        throw new Error(apiErrorMessage);
      } catch (error) {
        console.error('Registration error (via service):', error);
        const errorMessage = error.response?.data?.message ||
                           (error.response?.data?.errors ? error.response.data.errors.join(', ') : null) ||
                           error.message ||
                           'An unexpected error occurred during registration.';
        showToast(errorMessage, 'error');
        throw new Error(errorMessage);
      }
    },
    async fetchUser() {
      if (!this.isAuthenticated) return null;
      // this.clearError(); // Optional
      try {
        const response = await authService.getUserProfile();
        if (response.data && response.data.success) {
          this.setUser(response.data.data);
          return response.data.data;
        }
        // If API call is successful but success:false, or data is missing
        console.warn('Fetch user (via service) call succeeded but API indicated failure or missing data:', response.data?.message);
        // this.setError(response.data?.message || 'Failed to fetch user profile.'); // Optional
        return null; // Or handle as an error by throwing
      } catch (error) {
        console.error('Fetch user error (via service):', error);
        // Axios interceptor handles 401 by calling logout.
        // For other errors, you might want to clear user data or set an error message.
        if (error.response && error.response.status !== 401) {
          // this.setError('Could not fetch user profile due to server error.'); // Optional
        }
        return null; // No need to throw here unless components need to react to fetchUser failure specifically
      }
    },
    logout() {
      this.setToken(null);
      this.setUser(null);
      // this.clearError(); // Optional
      router.push({ name: 'Login' }); // Ensure router is imported
    },
    async checkAuthStatus() {
      if (this.token && !this.user) { // Token exists but no user data (e.g., on app load)
        await this.fetchUser();
      }
      // If fetchUser fails (e.g. token is invalid and API returns 401),
      // the Axios interceptor in api.js should catch this and call logout(),
      // which will clear the token and redirect to login.
    }
  },
});
