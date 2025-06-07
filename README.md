# Vue.js Authentication System

## Overview

This project is a Vue.js single-page application (SPA) demonstrating a complete authentication system. It includes user registration, login (with email/password), a protected dashboard area, and foundational setup for OAuth authentication. The application features JWT-based authentication, global state management with Pinia, and routing with Vue Router. It's styled with Tailwind CSS and includes unit tests using Vitest.

## Features

- User Registration (Email/Password)
- User Login (Email/Password)
- JWT-based Authentication
- Protected Dashboard Route
- Global Toast Notifications for user feedback
- Placeholder for OAuth (GitHub, Google) login
- Responsive Navigation
- Environment-based API configuration
- Basic Form Validation (client-side)
- Unit tests for core authentication logic and components

## Tech Stack

- **Frontend:**
    - Vue 3 (Composition API with `<script setup>`)
    - Vite (Build Tool)
    - Pinia (State Management)
    - Vue Router (Routing)
    - Axios (HTTP Client)
    - Tailwind CSS (Styling)
- **Testing:**
    - Vitest (Unit Testing Framework)
    - Vue Test Utils (Component Testing Utilities)
    - happy-dom (DOM Environment for tests)
- **Code Quality:**
    - ESLint (Linting)
    - Prettier (Code Formatting) - *Assumed, based on typical Vue project setups*

## Project Structure

The main application code resides in the `src/` directory:

```
src/
├── App.vue               # Root Vue component
├── main.js               # Application entry point
├── assets/               # Static assets (CSS, images)
├── components/           # Reusable UI components
│   ├── common/           # General purpose components (AppButton, AppInput, ToastNotification)
│   └── layout/           # Layout components (AuthLayout, DefaultLayout)
├── composables/          # Vue composables (e.g., useToast)
├── router/               # Vue Router configuration (index.js)
├── services/             # API service modules (api.js, authService.js)
├── stores/               # Pinia stores (auth.js)
│   └── __tests__/        # Unit tests for stores
├── types/                # TypeScript type definitions (if used more extensively)
├── utils/                # Utility functions
└── views/                # Page components (LoginView, RegisterView, DashboardView)
    └── __tests__/        # Unit tests for view components
```

## Setup and Installation

### Prerequisites

- Node.js (v18.x or later recommended)
- npm (v9.x or later) or yarn

### Steps

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    *(Or `yarn install` if you prefer yarn)*

3.  **Environment Configuration:**
    -   Copy the example environment file:
        ```bash
        cp .env.example .env
        ```
    -   Update the `.env` file with your specific backend API URL and OAuth client IDs:
        -   `VITE_API_BASE_URL`: The base URL for your backend API (e.g., `http://localhost:8000/api` or `https://your-api.com/api`).
        -   `VITE_OAUTH_GITHUB_CLIENT_ID`: Your GitHub OAuth application's Client ID.
        -   `VITE_OAUTH_GOOGLE_CLIENT_ID`: Your Google OAuth application's Client ID.

        Example `.env` content:
        ```
        VITE_API_BASE_URL=https://api.example.com
        VITE_OAUTH_GITHUB_CLIENT_ID=your_actual_github_client_id
        VITE_OAUTH_GOOGLE_CLIENT_ID=your_actual_google_client_id
        ```

## Running the Application

1.  **Start the development server:**
    ```bash
    npm run dev
    ```

2.  **Access the application:**
    Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite if 5173 is in use).

## Running Tests

-   **Run unit tests:**
    ```bash
    npm run test:unit
    ```
    *(Or `npm test` if it's configured as an alias in `package.json`)*

## API Endpoints

The application interacts with the following backend API endpoints for authentication (actual paths may vary based on your `VITE_API_BASE_URL`):

-   `POST /api/login`: User login.
-   `POST /api/register`: User registration.
-   `GET /users/profile`: Fetch authenticated user's profile (protected endpoint).

*(Note: These are example paths. The actual backend implementation is outside the scope of this frontend project.)*

## Code Quality

This project is set up with ESLint for JavaScript/Vue linting and (presumably) Prettier for code formatting to maintain consistent code style. Ensure these tools are integrated with your IDE for the best development experience.
You can typically run linting and formatting with:
```bash
npm run lint # (If script is configured in package.json)
# Or directly: npx eslint . --ext .vue,.js,.jsx,.cjs,.mjs --fix
# npx prettier . --write
```

---

This README provides a comprehensive guide for developers to set up, run, and understand the project.
