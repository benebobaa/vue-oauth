<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :required="required"
      :placeholder="placeholder"
      :disabled="disabled"
      :minlength="minlength"
      :class="[
        'block w-full px-3 py-2 mt-1 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm',
        { 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500': !hasError },
        { 'border-red-500 focus:ring-red-500 focus:border-red-500': hasError }
      ]"
    />
    <p v-if="errorMessage && hasError" class="mt-1 text-xs text-red-600">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
defineProps({
  id: String,
  label: String,
  type: {
    type: String,
    default: 'text',
  },
  modelValue: [String, Number],
  required: Boolean,
  placeholder: String,
  disabled: Boolean,
  minlength: [String, Number],
  errorMessage: String, // Error message to display
  hasError: Boolean, // Controls error styling
});
defineEmits(['update:modelValue']);
</script>
