<template>
  <div class="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow-md text-center">
    <h2 class="text-3xl font-bold text-gray-900">Welcome to your Dashboard!</h2>

    <div v-if="isLoading" class="mt-4">
        <p class="text-gray-600">Loading user data...</p>
        <div class="w-8 h-8 mx-auto mt-2 border-t-2 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
      </div>

      <div v-if="!isLoading && user" class="mt-6 space-y-4">
        <p class="text-lg text-gray-700">
          Hello, <span class="font-semibold">{{ user.email }}</span>!
        </p>

        <div class="p-4 text-left bg-gray-50 rounded-md shadow-sm">
          <h3 class="text-xl font-semibold text-gray-800 mb-3">Your Profile:</h3>
          <ul class="space-y-2 text-gray-700">
            <li><strong>User ID:</strong> {{ user.id }}</li>
            <li><strong>Email:</strong> {{ user.email }}</li>
            <li><strong>Joined:</strong> {{ formattedCreatedAt }}</li>
            <!-- Add other user profile fields if available and desired -->
          </ul>
        </div>

        <button
          @click="handleLogout"
          class="w-full px-4 py-2 mt-6 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm sm:w-auto hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>

      <div v-if="!isLoading && !user && fetchError" class="mt-4">
         <p class="text-red-600">Could not load user profile. {{ fetchError }}</p>
      </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const user = computed(() => authStore.currentUser);
const isLoading = ref(false);
const fetchError = ref('');


const formattedCreatedAt = computed(() => {
  if (user.value && user.value.created_at) {
    return new Date(user.value.created_at).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }
  return 'N/A';
});

onMounted(async () => {
  // User data might have been loaded by checkAuthStatus in App.vue
  // Or if user directly navigates here after login
  if (!user.value && authStore.isAuthenticated) {
    isLoading.value = true;
    fetchError.value = '';
    try {
      await authStore.fetchUser();
      // user computed property will update automatically
      if(!authStore.currentUser) {
        fetchError.value = "User data not found after fetch.";
      }
    } catch (error) {
      console.error("Dashboard fetchUser error:", error);
      fetchError.value = error.message || "An error occurred while fetching your profile.";
      // The auth interceptor should handle 401s by logging out.
      // If still on dashboard after a 401, router guard might not have re-evaluated yet,
      // or error was not a 401.
    } finally {
      isLoading.value = false;
    }
  } else if (!authStore.isAuthenticated) {
    // This case should ideally be handled by the router guard redirecting to login.
    // If somehow the component mounts while not authenticated.
    fetchError.value = "You are not authenticated.";
  }
});

const handleLogout = () => {
  authStore.logout();
  // Navigation to login page is handled by the logout action in the store
};
</script>

<style scoped>
/* Re-use spinner animation or define globally */
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
