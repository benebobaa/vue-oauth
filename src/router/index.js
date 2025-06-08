// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import DashboardView from '../views/DashboardView.vue';
import GoogleCallbackView from '../views/GoogleCallbackView.vue'; // Will be created
import GitHubCallbackView from '../views/GitHubCallbackView.vue'; // Will be created
import AuthLayout from '../components/layout/AuthLayout.vue';
import DefaultLayout from '../components/layout/DefaultLayout.vue';
import { useAuthStore } from '../stores/auth';

const routes = [
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      { path: 'login', name: 'Login', component: LoginView },
      { path: 'register', name: 'Register', component: RegisterView },
      { path: 'google/callback', name: 'GoogleCallback', component: GoogleCallbackView },
      { path: 'github/callback', name: 'GitHubCallback', component: GitHubCallbackView }
    ],
    // Redirect /auth to /auth/login if no sub-route is specified
    redirect: '/auth/login',
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore();
      if (authStore.isAuthenticated) {
        next({ name: 'Dashboard' }); // Redirect authenticated users away from auth pages
      } else {
        next();
      }
    }
  },
  {
    path: '/', // Root path for authenticated users
    component: DefaultLayout,
    children: [
      // Redirect root of DefaultLayout to Dashboard
      // This handles cases like user navigating to "/" when already authenticated
      // and the main "/" redirect has already sent them to DefaultLayout.
      { path: '', redirect: { name: 'Dashboard'} },
      { path: 'dashboard', name: 'Dashboard', component: DashboardView },
      // Add other authenticated routes here
      // e.g. { path: 'profile', name: 'Profile', component: ProfileView }
    ],
    meta: { requiresAuth: true }
  },
  // Adjusted root redirect to handle auth status
  // This is the very first redirect the app will see for path: '/'
  {
    path: '/',
    redirect: () => {
      const authStore = useAuthStore();
      if (authStore.isAuthenticated) {
        // If authenticated, go to the DefaultLayout which will then redirect to Dashboard
        return { path: '/dashboard' }; // Direct path to dashboard under DefaultLayout
      }
      // If not authenticated, go to the AuthLayout which will redirect to Login
      return { path: '/auth/login' }; // Direct path to login under AuthLayout
    }
  },
  // Catch-all for unmatched routes, redirect to dashboard or login
  {
    path: '/:pathMatch(.*)*',
    redirect: () => {
      const authStore = useAuthStore();
      if (authStore.isAuthenticated) {
        return { name: 'Dashboard' };
      }
      return { name: 'Login' };
    }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  // Check if trying to access auth routes while already authenticated
  // This is partly handled by the /auth route's beforeEnter, but this adds another layer
  // especially if user navigates to /auth/login directly.
  if (to.matched.some(record => record.path === '/auth') && authStore.isAuthenticated) {
     next({ name: 'Dashboard' });
  } else if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
