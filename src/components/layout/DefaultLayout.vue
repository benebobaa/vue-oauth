<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-sm">
      <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <!-- <img class="w-8 h-8" src="@/assets/logo.svg" alt="App Logo" /> -->
              <span class="font-bold text-indigo-600">MyApp</span>
            </div>
            <div class="hidden md:block">
              <div class="flex items-baseline ml-10 space-x-4">
                <router-link
                  :to="{ name: 'Dashboard' }"
                  class="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
                  active-class="bg-gray-100 text-gray-900"
                  >Dashboard</router-link
                >
                <!-- Add other navigation links here if needed -->
              </div>
            </div>
          </div>
          <div class="hidden md:block">
            <button
              v-if="isAuthenticated"
              @click="handleLogout"
              class="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
          <div class="flex -mr-2 md:hidden">
            <!-- Mobile menu button -->
            <button @click="mobileMenuOpen = !mobileMenuOpen" type="button" class="inline-flex items-center justify-center p-2 text-gray-400 bg-white rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" aria-controls="mobile-menu" aria-expanded="false">
              <span class="sr-only">Open main menu</span>
              <!-- Icon for menu open/close -->
              <svg v-if="!mobileMenuOpen" class="block w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              <svg v-else class="block w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu, show/hide based on menu state. -->
      <div v-if="mobileMenuOpen" class="md:hidden" id="mobile-menu">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <router-link :to="{ name: 'Dashboard' }" class="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900" active-class="bg-gray-100 text-gray-900">Dashboard</router-link>
        </div>
        <div v-if="isAuthenticated" class="pt-4 pb-3 border-t border-gray-200">
          <div class="flex items-center px-5">
            <div class="ml-3">
              <div class="text-base font-medium leading-none text-gray-800">{{ userEmail }}</div>
            </div>
          </div>
          <div class="px-2 mt-3 space-y-1">
            <button @click="handleLogout" class="block w-full px-3 py-2 text-left text-base font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900">Logout</button>
          </div>
        </div>
      </div>
    </nav>

    <main>
      <div class="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter(); // Not used directly for navigation in this template, but good to have if needed.

const isAuthenticated = computed(() => authStore.isAuthenticated);
const userEmail = computed(() => authStore.currentUser?.email || 'User');
const mobileMenuOpen = ref(false);

const handleLogout = () => {
  authStore.logout(); // Store action handles redirect
  mobileMenuOpen.value = false; // Close mobile menu on logout
};
</script>
