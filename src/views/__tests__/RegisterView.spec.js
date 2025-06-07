import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import RegisterView from '../RegisterView.vue'; // Adjust path
import { useAuthStore } from '@/stores/auth';

// Mock router
const mockRouterPush = vi.fn();
const mockRouterResolve = vi.fn(() => ({ href: '#' }));
vi.mock('@/router', () => ({
  default: {
    push: mockRouterPush,
    resolve: mockRouterResolve,
  }
}));

// Mock useToast
const mockShowToast = vi.fn();
vi.mock('@/composables/useToast', () => ({
    useToast: () => ({
        showToast: mockShowToast,
    }),
}));


const mockRegister = vi.fn();

describe('RegisterView.vue', () => {
  let pinia;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);

    const authStore = useAuthStore();
    authStore.register = mockRegister;
    // Reset other relevant store state if necessary
    authStore.user = null;
    authStore.token = null;

    mockRegister.mockReset();
    mockRouterPush.mockReset();
  });

  it('renders registration form correctly', () => {
    const wrapper = mount(RegisterView, {
      global: { plugins: [pinia], stubs: { RouterLink: true } }
    });
    expect(wrapper.find('h2').text()).toBe('Create your account');
    expect(wrapper.find('input#email-register').exists()).toBe(true); // IDs from AppInput
    expect(wrapper.find('input#password-register').exists()).toBe(true);
    expect(wrapper.find('input#password_confirmation-register').exists()).toBe(true);
    expect(wrapper.find('input#terms').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').text()).toContain('Create account');
  });

  it('calls authStore.register on form submission with correct data', async () => {
    mockRegister.mockResolvedValue(true);
    const wrapper = mount(RegisterView, {
      global: { plugins: [pinia], stubs: { RouterLink: true } }
    });

    await wrapper.find('input#email-register').setValue('newuser@example.com');
    await wrapper.find('input#password-register').setValue('password123');
    await wrapper.find('input#password_confirmation-register').setValue('password123');
    await wrapper.find('input#terms').setValue(true);
    await wrapper.find('form').trigger('submit.prevent');

    expect(mockRegister).toHaveBeenCalledTimes(1);
    expect(mockRegister).toHaveBeenCalledWith({
      email: 'newuser@example.com',
      password: 'password123',
      password_confirmation: 'password123',
    });
  });

  it('displays error if passwords do not match and prevents submission', async () => {
    const wrapper = mount(RegisterView, {
      global: { plugins: [pinia], stubs: { RouterLink: true } }
    });
    await wrapper.find('input#password-register').setValue('password123');
    await wrapper.find('input#password_confirmation-register').setValue('passwordmismatch');
    await wrapper.find('input#terms').setValue(true);

    await wrapper.find('form').trigger('submit.prevent');
    await wrapper.vm.$nextTick();

    expect(mockRegister).not.toHaveBeenCalled();
    // Check for the specific password mismatch error message displayed by the component
    const errorDiv = wrapper.findAll('.text-red-700').find(e => e.text().includes('Passwords do not match.'));
    expect(errorDiv.exists()).toBe(true);

    // Also check if submit button is disabled
    const submitButton = wrapper.findComponent({ name: 'AppButton' });
    expect(submitButton.props('disabled')).toBe(true);
  });

  it('displays error if terms are not agreed to and prevents submission', async () => {
    const wrapper = mount(RegisterView, {
      global: { plugins: [pinia], stubs: { RouterLink: true } }
    });
    await wrapper.find('input#email-register').setValue('newuser@example.com');
    await wrapper.find('input#password-register').setValue('password123');
    await wrapper.find('input#password_confirmation-register').setValue('password123');
    await wrapper.find('input#terms').setValue(false);

    await wrapper.find('form').trigger('submit.prevent');
    await wrapper.vm.$nextTick();

    expect(mockRegister).not.toHaveBeenCalled();
    // Check for the specific terms error message
    const errorDiv = wrapper.findAll('.text-red-700').find(e => e.text().includes('You must agree to the Terms of Service.'));
    expect(errorDiv.exists()).toBe(true);

    // Also check if submit button is disabled
    const submitButton = wrapper.findComponent({ name: 'AppButton' });
    expect(submitButton.props('disabled')).toBe(true);
  });

  it('displays API error message from authStore on registration failure', async () => {
    const errorMessage = 'Email already exists.';
    mockRegister.mockRejectedValue(new Error(errorMessage));
    const wrapper = mount(RegisterView, {
      global: { plugins: [pinia], stubs: { RouterLink: true } }
    });

    await wrapper.find('input#email-register').setValue('existing@example.com');
    await wrapper.find('input#password-register').setValue('password123');
    await wrapper.find('input#password_confirmation-register').setValue('password123');
    await wrapper.find('input#terms').setValue(true);
    await wrapper.find('form').trigger('submit.prevent');
    await wrapper.vm.$nextTick();

    const errorDiv = wrapper.findAll('.text-red-700').find(e => e.text().includes(errorMessage));
    expect(errorDiv.exists()).toBe(true);
  });

  it('shows loading state during registration attempt', async () => {
    mockRegister.mockImplementation(() => {
      return new Promise(resolve => setTimeout(() => resolve(true), 100));
    });
    const wrapper = mount(RegisterView, {
      global: { plugins: [pinia], stubs: { RouterLink: true } }
    });

    await wrapper.find('input#email-register').setValue('test@example.com');
    await wrapper.find('input#password-register').setValue('password123');
    await wrapper.find('input#password_confirmation-register').setValue('password123');
    await wrapper.find('input#terms').setValue(true);
    const submitButton = wrapper.findComponent({ name: 'AppButton' });

    wrapper.find('form').trigger('submit.prevent');
    await wrapper.vm.$nextTick();

    expect(submitButton.props('loading')).toBe(true);

    // Wait for the mockRegister promise to resolve
    await new Promise(resolve => setTimeout(resolve, 150));
    await wrapper.vm.$nextTick();

    expect(submitButton.props('loading')).toBe(false);
  });
});
