<template>
  <div v-if="visible"
       :class="['fixed top-5 right-5 p-4 rounded-md shadow-lg text-white z-50 transition-opacity duration-300', toastClasses]">
    <p>{{ message }}</p>
    <button @click="hideToast" class="absolute top-1 right-2 text-xl font-bold">&times;</button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  message: String,
  type: { // 'success', 'error', 'info'
    type: String,
    default: 'info'
  },
  duration: {
    type: Number,
    default: 3000 // 3 seconds
  }
});

const visible = ref(false);
let timeoutId = null;

const toastClasses = computed(() => {
  switch (props.type) {
    case 'success': return 'bg-green-500';
    case 'error': return 'bg-red-500';
    default: return 'bg-blue-500';
  }
});

const showToast = () => {
  visible.value = true;
  if (timeoutId) clearTimeout(timeoutId);
  if (props.duration > 0) { // Allow indefinite duration if props.duration is 0 or less
    timeoutId = setTimeout(() => {
      hideToast();
    }, props.duration);
  }
};

const hideToast = () => {
  visible.value = false;
  if (timeoutId) clearTimeout(timeoutId);
};

// Expose showToast to be called from parent or a service
defineExpose({ showToast, hideToast });

// Watch message prop to auto-show if it changes and is non-empty
// This makes it easier to use by just updating props from parent
watch(() => props.message, (newMessage) => {
  if (newMessage) {
    showToast();
  } else {
    // Do not hide if message is cleared, allow hideToast or timeout to handle it
    // This prevents flicker if message is cleared then immediately set again
  }
});
</script>
