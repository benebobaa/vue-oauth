<template>
  <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-center text-gray-900">Create your account</h2>
    <form @submit.prevent="handleRegister" class="space-y-6">
      <AppInput
        id="email-register"
        v-model="email"
        type="email"
        label="Email address"
        required
        placeholder="you@example.com"
        :has-error="!!errorMessage && !passwordMismatchError"
        :error-message="errorMessage && !passwordMismatchError ? errorMessage : ''"
      />
      <AppInput
        id="password-register"
        v-model="password"
        type="password"
        label="Password"
        required
        minlength="8"
        placeholder="••••••••"
        :has-error="passwordMismatchError || (!!errorMessage && !passwordMismatchError)"
        :error-message="passwordMismatchError ? 'Passwords do not match.' : (errorMessage && !passwordMismatchError ? errorMessage : '')"
      />
      <AppInput
        id="password_confirmation-register"
        v-model="passwordConfirmation"
        type="password"
        label="Confirm Password"
        required
        placeholder="••••••••"
        :has-error="passwordMismatchError || (!!errorMessage && !passwordMismatchError)"
        :error-message="passwordMismatchError ? 'Passwords do not match.' : ''"
      />
      <div class="flex items-start">
        <div class="flex items-center h-5">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            v-model="agreedToTerms"
            required
            class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
        </div>
        <div class="ml-3 text-sm">
          <label for="terms" class="font-medium text-gray-700">I agree to the</label>
          <a href="#" class="ml-1 font-medium text-indigo-600 hover:text-indigo-500">Terms of Service</a>
        </div>
      </div>

      <div v-if="errorMessage && !passwordMismatchError" class="p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md">
        {{ errorMessage }}
      </div>
      <div v-if="passwordMismatchError" class="p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md">
        Passwords do not match.
      </div>

      <div>
        <AppButton
          type="submit"
          :loading="isLoading"
          :disabled="isLoading || passwordMismatchError || !agreedToTerms"
          block="true"
          variant="primary"
        >
          Create account
        </AppButton>
      </div>
    </form>
    <p class="mt-6 text-sm text-center">
      Already a member?
      <router-link :to="{ name: 'Login' }" class="font-medium text-indigo-600 hover:text-indigo-500">
        Sign in
      </router-link>
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import AppInput from '@/components/common/AppInput.vue';
import AppButton from '@/components/common/AppButton.vue';

const authStore = useAuthStore();
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const agreedToTerms = ref(false);
const isLoading = ref(false);
const errorMessage = ref(''); // For API errors or general form errors like "agree to terms"

const passwordMismatchError = computed(() => {
  // Only show mismatch if both fields have some input
  return password.value && passwordConfirmation.value && password.value !== passwordConfirmation.value;
});

const handleRegister = async () => {
  errorMessage.value = ''; // Clear previous API errors

  if (password.value !== passwordConfirmation.value) {
    // This is visually handled by passwordMismatchError computed prop and AppInput's error display
    // No need to set general errorMessage here for this specific case
    return;
  }
  if (!agreedToTerms.value) {
    errorMessage.value = 'You must agree to the Terms of Service.';
    return;
  }

  isLoading.value = true;
  try {
    await authStore.register({
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    });
    // Navigation is handled by the store action
  } catch (error) {
    // This errorMessage is for API errors primarily
    errorMessage.value = error.message || 'Failed to register. Please check your details.';
    console.error("Register page error:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Spinner animation is now in AppButton */
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
