// src/composables/useToast.js
import { ref } from 'vue';

const toastState = ref({
  message: '',
  type: 'info', // success, error, info
  duration: 3000, // Default duration
  visible: false, // This might not be strictly needed here if ToastNotification handles its own visibility
  _key: 0, // Used to trigger watcher in App.vue even if message/type are same
});

export function useToast() {
  const show = (message, type = 'info', duration = 3000) => {
    // Update the shared state. App.vue will watch this and pass props to ToastNotification.
    toastState.value = {
      message,
      type,
      duration,
      visible: true, // Signal that a new toast should be shown
      _key: toastState.value._key + 1
    };
  };

  // Optional: a hide function if global hiding is needed, though ToastNotification handles its own.
  // const hide = () => {
  //   toastState.value.visible = false;
  // };

  return { toastState, showToast: show };
}
