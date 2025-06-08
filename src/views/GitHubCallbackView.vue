<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="p-6 text-center bg-white rounded-lg shadow-md">
      <p class="text-lg font-semibold text-gray-700">Processing GitHub login...</p>
      <!-- Optional: You can add a spinner here -->
      <!-- <div class="mt-4 spinner"></div> -->
    </div>
  </div>
</template>

<script setup>
import { onMounted }_from_ 'vue';
import { useRoute, useRouter }_from_ 'vue-router';
import { useAuthStore }_from_ '@/stores/auth';
import { useToast }_from_ '@/composables/useToast'; // For potential error messages

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { showToast }_from_ useToast();

onMounted(async () => {
  const { code, state } = route.query; // Assuming 'state' might be used

  if (code) {
    try {
      // The loginWithGitHub action is expected to handle redirection on success
      // and throw an error on failure, which will be caught here.
      await authStore.loginWithGitHub(code, state); // Pass state if it's part of your OAuth flow
      // If loginWithGitHub successfully redirects, lines below this won't execute.
    } catch (error) {
      console.error('GitHub login callback error:', error);
      showToast(error.message || 'Failed to complete GitHub login. Please try again.', 'error');
      router.push({ name: 'Login' }); // Redirect to login on error
    }
  } else {
    console.error('GitHub login callback: No authorization code found.');
    showToast('GitHub login failed: Authorization code not provided.', 'error');
    router.push({ name: 'Login' }); // Redirect to login if no code
  }
});
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
