<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="p-6 text-center bg-white rounded-lg shadow-md">
      <p class="text-lg font-semibold text-gray-700">Processing Google login...</p>
      <!-- Optional: You can add a spinner here -->
      <!-- <div class="mt-4 spinner"></div> -->
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { showToast } = useToast()

onMounted(async () => {
  const { code, state } = route.query // Assuming 'state' might be used, otherwise it'll be undefined

  if (code) {
    try {
      // The loginWithGoogle action is expected to handle redirection on success
      // and throw an error on failure, which will be caught here.
      await authStore.loginWithGoogle(code, state) // Pass state if it's part of your OAuth flow
      // If loginWithGoogle successfully redirects, lines below this won't execute.
    } catch (error) {
      console.error('Google login callback error:', error)
      showToast(error.message || 'Failed to complete Google login. Please try again.', 'error')
      router.push({ name: 'Login' }) // Redirect to login on error
    }
  } else {
    console.error('Google login callback: No authorization code found.')
    showToast('Google login failed: Authorization code not provided.', 'error')
    router.push({ name: 'Login' }) // Redirect to login if no code
  }
})
</script>

<style scoped>
/* Example spinner styles if you add one */
/*
.spinner {
  border: 4px solid rgba(0, 0, 0, .1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #09f;
  animation: spin 1s ease infinite;
  margin-left: auto;
  margin-right: auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
*/
</style>
