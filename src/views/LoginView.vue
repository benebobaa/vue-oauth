<template>
  <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-center text-gray-900">Login to your account</h2>
    <form @submit.prevent="handleLogin" class="space-y-6">
      <AppInput
        id="email"
        v-model="email"
        type="email"
        label="Email address"
        required
        placeholder="you@example.com"
        :has-error="!!errorMessage"
      />
      <AppInput
        id="password"
        v-model="password"
        type="password"
        label="Password"
        required
        placeholder="••••••••"
        :has-error="!!errorMessage"
      />

      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input id="remember-me" name="remember-me" type="checkbox" v-model="rememberMe" class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
          <label for="remember-me" class="block ml-2 text-sm text-gray-900">Remember me</label>
        </div>
        <div class="text-sm">
          <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">Forgot your password?</a>
        </div>
      </div>

      <div v-if="errorMessage" class="p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md">
        {{ errorMessage }}
      </div>

      <div>
        <AppButton
          type="submit"
          :loading="isLoading"
          :disabled="isLoading"
          block="true"
          variant="primary"
        >
          Sign in
        </AppButton>
      </div>
    </form>

    <div class="relative my-6">
      <div class="absolute inset-0 flex items-center" aria-hidden="true">
        <div class="w-full border-t border-gray-300"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-2 text-gray-500 bg-white">Or continue with</span>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div>
        <AppButton variant="secondary" @click="handleOAuthLogin('github')" block="true">
          GitHub
        </AppButton>
      </div>
      <div>
        <AppButton variant="secondary" @click="handleOAuthLogin('google')" block="true">
          Google
        </AppButton>
      </div>
    </div>
    <p class="mt-6 text-sm text-center">
      Not a member?
      <router-link :to="{ name: 'Register' }" class="font-medium text-indigo-600 hover:text-indigo-500">
        Sign up now
      </router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import AppInput from '@/components/common/AppInput.vue';
import AppButton from '@/components/common/AppButton.vue';

const authStore = useAuthStore();
const email = ref('');
const password = ref('');
const rememberMe = ref(false); // UI only for now
const isLoading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    await authStore.login({ email: email.value, password: password.value });
    // Navigation is handled by the store action upon successful login
  } catch (error) {
    errorMessage.value = error.message || 'Failed to login. Please check your credentials.';
    console.error("Login page error:", error);
  } finally {
    isLoading.value = false;
  }
};

const handleOAuthLogin = async (provider) => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    if (provider === 'google') {
      await authStore.initiateGoogleLogin();
      // The browser will redirect, so further code here might not execute
      // or will only execute if the redirection is blocked or fails.
    } else if (provider === 'github') {
      await authStore.initiateGitHubLogin();
      // Similar to Google, redirection is expected.
    } else {
      throw new Error('Unsupported OAuth provider.');
    }
    // If redirection occurs, isLoading might not be set to false here.
    // This is generally fine as the page navigates away.
  } catch (error) {
    console.error(`OAuth login error with ${provider}:`, error);
    errorMessage.value = error.message || `Failed to initiate OAuth with ${provider}.`;
    isLoading.value = false; // Ensure loading is false on error
  }
  // No finally block to set isLoading to false, as successful redirection means this component instance is destroyed.
  // If the initiation itself fails and throws, catch block handles isLoading.
};
</script>

<style scoped>
/* Spinner animation is now in AppButton, can remove if not used elsewhere here */
/* However, if other elements might spin, keep it or move globally */
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
