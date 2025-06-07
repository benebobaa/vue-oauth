import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import LoginView from '../LoginView.vue'; // Adjust path
import { useAuthStore } from '@/stores/auth'; // To interact with the store
import router from '@/router'; // To access the mocked router object

// Mock the auth store actions
const mockLogin = vi.fn();
// const mockInitiateOAuth = vi.fn(); // If we test OAuth buttons

// Mock router
// router is imported as `router` in the test file, so we mock its default export's methods
const mockRouterPush = vi.fn();
const mockRouterResolve = vi.fn(() => ({ href: '#' }));
vi.mock('@/router', () => ({
  default: {
     push: mockRouterPush,
     resolve: mockRouterResolve,
  }
}));

// Mock useToast (LoginView itself doesn't call it, authStore does)
// This is primarily for completeness. The store's use of toast is tested in store unit tests.
const mockShowToast = vi.fn();
vi.mock('@/composables/useToast', () => ({
    useToast: () => ({
        showToast: mockShowToast,
    }),
}));


describe('LoginView.vue', () => {
  let pinia;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);

    // Reset store state and mocks for useAuthStore
    const authStore = useAuthStore();
    authStore.login = mockLogin;
    // authStore.initiateOAuth = mockInitiateOAuth;
    authStore.user = null;
    authStore.token = null;
    // Assuming LoginView itself might use a store error state, or relies on thrown errors
    // For this test, we're checking component's errorMessage ref based on thrown errors.

    mockLogin.mockReset();
    // mockInitiateOAuth.mockReset();
    mockRouterPush.mockReset();
  });

  it('renders login form correctly', () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [pinia],
        stubs: {
          RouterLink: { template: '<a><slot /></a>' }
        }
      }
    });
    expect(wrapper.find('h2').text()).toBe('Login to your account');
    // Check for AppInput components by a distinguishing prop like 'id' or 'label'
    expect(wrapper.find('input#email').exists()).toBe(true); // AppInput renders an input
    expect(wrapper.find('input#password').exists()).toBe(true);
    // Check for AppButton by its text content or type
    expect(wrapper.find('button[type="submit"]').text()).toContain('Sign in');
  });

  it('calls authStore.login on form submission with correct credentials', async () => {
    mockLogin.mockResolvedValue(true);

    const wrapper = mount(LoginView, {
      global: { plugins: [pinia], stubs: { RouterLink: true } }
    });

    await wrapper.find('input#email').setValue('test@example.com');
    await wrapper.find('input#password').setValue('password123');
    await wrapper.find('form').trigger('submit.prevent');

    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(mockLogin).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
  });

  it('displays error message from authStore on login failure', async () => {
    const errorMessage = 'Invalid credentials or user not found.';
    mockLogin.mockRejectedValue(new Error(errorMessage));

    const wrapper = mount(LoginView, {
      global: { plugins: [pinia], stubs: { RouterLink: true } }
    });

    await wrapper.find('input#email').setValue('test@example.com');
    await wrapper.find('input#password').setValue('wrongpassword');
    await wrapper.find('form').trigger('submit.prevent');

    await wrapper.vm.$nextTick();

    const errorDiv = wrapper.find('.text-red-700');
    expect(errorDiv.exists()).toBe(true);
    expect(errorDiv.text()).toBe(errorMessage);
  });

  it('shows loading state during login attempt', async () => {
    mockLogin.mockImplementation(() => {
      return new Promise(resolve => setTimeout(() => resolve(true), 100));
    });

    const wrapper = mount(LoginView, {
      global: { plugins: [pinia], stubs: { RouterLink: true } }
    });

    await wrapper.find('input#email').setValue('test@example.com');
    await wrapper.find('input#password').setValue('password123');
    const submitButton = wrapper.findComponent({ name: 'AppButton' });

    wrapper.find('form').trigger('submit.prevent');

    await wrapper.vm.$nextTick();

    expect(submitButton.props('loading')).toBe(true);
    expect(submitButton.attributes('disabled')).toBeDefined();

    // Wait for the mockLogin promise to resolve by awaiting a timeout that allows the mock to complete
    await new Promise(resolve => setTimeout(resolve, 150)); // Ensure this is longer than mockLogin delay
    await wrapper.vm.$nextTick();

    expect(submitButton.props('loading')).toBe(false);
    expect(submitButton.attributes('disabled')).toBeUndefined();
  });

  it('calls placeholder OAuth handler when GitHub button is clicked', async () => {
    const wrapper = mount(LoginView, {
      global: { plugins: [pinia], stubs: { RouterLink: true } }
    });
    const appButtons = wrapper.findAllComponents({ name: 'AppButton' });
    // Find the GitHub button specifically. This assumes button text or a unique prop.
    // If AppButton slots content, text() might work.
    const githubButton = appButtons.find(b => b.text().includes('GitHub'));

    expect(githubButton, 'GitHub AppButton not found').toBeTruthy();
    if (githubButton) {
        await githubButton.trigger('click');
        await wrapper.vm.$nextTick();
        const errorDiv = wrapper.find('.text-red-700'); // Error message display
        expect(errorDiv.exists()).toBe(true);
        expect(errorDiv.text()).toContain('OAuth with github is not implemented yet.');
    }
  });
});
