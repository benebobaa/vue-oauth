<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    @click="$emit('click')"
    :class="[
      'flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2',
      variantClasses,
      { 'opacity-50 cursor-not-allowed': disabled || loading },
      { 'w-full': block }
    ]"
  >
    <span v-if="loading" class="w-5 h-5 mr-2 border-t-2 border-b-2 border-current rounded-full animate-spin"></span>
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'button', // submit, button, reset
  },
  variant: {
    type: String,
    default: 'primary', // primary, secondary, danger, warning
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  block: { // Whether the button should take full width
    type: Boolean,
    default: false,
  }
});

defineEmits(['click']);

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:ring-indigo-500';
    case 'danger':
      return 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500';
    case 'warning':
        return 'text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400'
    default: // primary
      return 'text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500';
  }
});
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
