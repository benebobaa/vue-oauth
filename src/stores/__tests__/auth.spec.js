import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '../auth'; // Adjust path as necessary
import * as authService from '@/services/authService'; // To mock its functions
import router from '@/router'; // To access the mocked router object

// Mock the authService
vi.mock('@/services/authService', () => ({
  loginUser: vi.fn(),
  registerUser: vi.fn(),
  getUserProfile: vi.fn(),
}));

// Mock Vue Router
// The store imports `router from '@/router'` and calls `router.push()`.
// So the mock should provide a `default` export which is an object with a `push` method.
const mockRouterPush = vi.fn();
vi.mock('@/router', () => ({
  default: {
    push: mockRouterPush,
  }
}));

// Mock useToast composable
const mockShowToast = vi.fn();
vi.mock('@/composables/useToast', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    // Reset mocks before each test
    vi.clearAllMocks(); // This clears all vi mocks
    // Reset localStorage
    localStorage.clear();
  });

  it('initializes with token from localStorage', () => {
    localStorage.setItem('authToken', 'test-token');
    const authStore = useAuthStore();
    expect(authStore.token).toBe('test-token');
    expect(authStore.isAuthenticated).toBe(true);
  });

  it('sets token and user on successful login', async () => {
    const authStore = useAuthStore();
    const mockUserData = { id: '1', email: 'test@example.com' };
    const mockToken = 'new-token';
    authService.loginUser.mockResolvedValue({
      data: { success: true, data: { token: mockToken, user: mockUserData } },
    });

    await authStore.login({ email: 'test@example.com', password: 'password' });

    expect(authStore.token).toBe(mockToken);
    expect(authStore.user).toEqual(mockUserData);
    expect(authStore.isAuthenticated).toBe(true);
    expect(localStorage.getItem('authToken')).toBe(mockToken);
    expect(mockRouterPush).toHaveBeenCalledWith({ name: 'Dashboard' }); // Assert against the specific mock function
    expect(mockShowToast).toHaveBeenCalledWith('Login successful!', 'success');
  });

  it('handles login failure', async () => {
    const authStore = useAuthStore();
    authService.loginUser.mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } },
    });

    await expect(authStore.login({ email: 'test@example.com', password: 'wrongpassword' }))
      .rejects.toThrow('Invalid credentials');

    expect(authStore.token).toBeNull();
    expect(authStore.user).toBeNull();
    expect(localStorage.getItem('authToken')).toBeNull();
    expect(mockShowToast).toHaveBeenCalledWith('Invalid credentials', 'error');
  });

  it('sets token and user on successful registration', async () => {
    const authStore = useAuthStore();
    const mockUserData = { id: '2', email: 'new@example.com' };
    const mockToken = 'register-token';
    authService.registerUser.mockResolvedValue({
      data: { success: true, data: { token: mockToken, user: mockUserData } },
    });

    await authStore.register({ email: 'new@example.com', password: 'password123', password_confirmation: 'password123' });

    expect(authStore.token).toBe(mockToken);
    expect(authStore.user).toEqual(mockUserData);
    expect(localStorage.getItem('authToken')).toBe(mockToken);
    expect(mockRouterPush).toHaveBeenCalledWith({ name: 'Dashboard' });
    expect(mockShowToast).toHaveBeenCalledWith('Registration successful!', 'success');
  });

  it('handles registration failure', async () => {
    const authStore = useAuthStore();
    authService.registerUser.mockRejectedValue({
      response: { data: { message: 'Email already taken', errors: ['Email has already been taken.'] } },
    });

    // Testing the error message extraction logic for "errors" array
    const expectedErrorMessage = 'Email already taken';
    await expect(authStore.register({ email: 'test@example.com', password: 'password' }))
      .rejects.toThrow(expectedErrorMessage);

    expect(authStore.token).toBeNull();
    expect(authStore.user).toBeNull();
    expect(mockShowToast).toHaveBeenCalledWith(expectedErrorMessage, 'error');
  });

  it('logs out user, clears token and user, and redirects', () => {
    localStorage.setItem('authToken', 'test-token');
    const authStore = useAuthStore();
    authStore.setUser({ id: '1', email: 'test@example.com' });

    authStore.logout();

    expect(authStore.token).toBeNull();
    expect(authStore.user).toBeNull();
    expect(authStore.isAuthenticated).toBe(false);
    expect(localStorage.getItem('authToken')).toBeNull();
    expect(mockRouterPush).toHaveBeenCalledWith({ name: 'Login' });
  });

  it('fetches user profile successfully if authenticated', async () => {
    localStorage.setItem('authToken', 'valid-token');
    const authStore = useAuthStore();
    const mockProfileData = { id: '1', email: 'profile@example.com', created_at: '2023-01-01T00:00:00Z' };
    authService.getUserProfile.mockResolvedValue({
      data: { success: true, data: mockProfileData },
    });

    const user = await authStore.fetchUser();

    expect(user).toEqual(mockProfileData);
    expect(authStore.user).toEqual(mockProfileData);
    expect(authService.getUserProfile).toHaveBeenCalled();
  });

  it('does not fetch user if not authenticated', async () => {
    const authStore = useAuthStore();
    await authStore.fetchUser();
    expect(authService.getUserProfile).not.toHaveBeenCalled();
  });

  it('handles fetch user failure (e.g. token valid but API error other than 401)', async () => {
    localStorage.setItem('authToken', 'valid-token');
    const authStore = useAuthStore();
    authService.getUserProfile.mockRejectedValue({ response: { status: 500, data: { message: 'Server error' } } });

    const user = await authStore.fetchUser();
    expect(user).toBeNull();
    // User should be null (or initial value) if fetch fails and isn't a 401 handled by interceptor's logout
    expect(authStore.user).toBeNull();
  });

  it('checkAuthStatus calls fetchUser if token exists and user is not set', async () => {
    localStorage.setItem('authToken', 'existing-token');
    const authStore = useAuthStore();

    // Spy on fetchUser method of this specific store instance
    const fetchUserSpy = vi.spyOn(authStore, 'fetchUser');
    authService.getUserProfile.mockResolvedValue({ // Ensure fetchUser doesn't fail for this test
        data: { success: true, data: {id: '1', email: 'test@test.com'} },
    });


    await authStore.checkAuthStatus();

    expect(fetchUserSpy).toHaveBeenCalled();
    fetchUserSpy.mockRestore(); // Clean up spy
  });

  it('checkAuthStatus does not call fetchUser if no token', async () => {
    const authStore = useAuthStore();
    const fetchUserSpy = vi.spyOn(authStore, 'fetchUser');
    await authStore.checkAuthStatus();
    expect(fetchUserSpy).not.toHaveBeenCalled();
    fetchUserSpy.mockRestore();
  });

  it('checkAuthStatus does not call fetchUser if token and user already set', async () => {
    localStorage.setItem('authToken', 'existing-token');
    const authStore = useAuthStore();
    authStore.setUser({ id: '1', email: 'test@example.com' });

    const fetchUserSpy = vi.spyOn(authStore, 'fetchUser');
    await authStore.checkAuthStatus();
    expect(fetchUserSpy).not.toHaveBeenCalled();
    fetchUserSpy.mockRestore();
  });

});
