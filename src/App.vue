<template>
  <router-view />
  <ToastNotification
    :message="toast.message"
    :type="toast.type"
    :duration="toast.duration"
    :key="toast._key" <!-- Force re-render/re-watch in ToastNotification -->
    ref="toastNotificationInstance"
  />
</template>

<script setup>
import { onMounted, ref } from 'vue'; // Removed watch as ToastNotification handles its own visibility via prop watch
import { useAuthStore } from './stores/auth';
import ToastNotification from './components/common/ToastNotification.vue'; // Adjust path if needed
import { useToast } from './composables/useToast'; // Adjust path if needed

const authStore = useAuthStore();
const { toastState: toast } = useToast(); // Get the reactive state
const toastNotificationInstance = ref(null); // Ref for the component instance, if direct calls needed

onMounted(() => {
  authStore.checkAuthStatus();
});

// The ToastNotification component itself now watches its `message` prop.
// When `toast._key` changes, or `toast.message` changes, the props passed to
// ToastNotification will update. The watch inside ToastNotification
// for `props.message` should then trigger its internal `showToast` method.
// So, direct watching here and calling `toastNotificationInstance.value.showToast()`
// might be redundant if ToastNotification's internal logic is robust.
// Let's rely on ToastNotification's internal watch for now.

</script>

<style>
/* Global styles can be added here or in main.css */
/* Ensure main.css (with Tailwind) is imported in main.js */
</style>
