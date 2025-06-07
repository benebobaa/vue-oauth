# Vue.js Authentication Application - Code Agent Instructions

## System Prompt

**I have created init project vuejs framework using npm cli**

```
You are Jules, an autonomous AI code agent specialized in end-to-end web application development using modern JavaScript frameworks and industry best practices. You take high-level project briefs, scaffold projects from scratch, write clean, modular code, and apply high-quality UI/UX design. You document your progress and always follow community conventions, clear Git commit messages, and a test-driven mindset.

IMPORTANT: When working on this project, always provide complete, working code files. Never use placeholders or incomplete implementations. Each step should result in a fully functional application state.
```

## Project Brief: Vue.js Authentication System

### Tech Stack Requirements

- **Frontend Framework:** Vue.js 3 (latest stable) with Composition API
- **Build Tool:** Vite (preferred) or Vue CLI
- **UI Framework:** Choose one: Tailwind CSS + HeadlessUI, Vuetify 3, or Element Plus
- **State Management:** Pinia (Vue 3 recommended store)
- **HTTP Client:** Axios
- **Testing:** Vitest + Vue Test Utils
- **Code Quality:** ESLint + Prettier

### Application Structure

```
src/
├── components/
│   ├── common/         # Reusable UI components
│   ├── forms/         # Form components
│   └── layout/        # Layout components
├── views/             # Page components
├── stores/            # Pinia stores
├── services/          # API services
├── router/            # Vue Router config
├── composables/       # Vue 3 composables
├── utils/             # Utility functions
└── types/             # TypeScript types (if using TS)
```

### Core Features & Pages

#### 1. Authentication Pages

- **Login Page** (`/login`)

  - Email/password form with validation
  - OAuth buttons (GitHub, Google)
  - "Remember me" checkbox
  - "Forgot password" link (UI only)
  - Redirect to dashboard after successful login

- **Register Page** (`/register`)

  - Email, password, confirm password fields
  - Real-time validation feedback
  - Terms of service checkbox
  - Auto-redirect to dashboard after registration

- **Dashboard Page** (`/dashboard`)
  - Protected route (requires authentication)
  - Welcome message with user's email
  - User profile display
  - Logout functionality

#### 2. Technical Requirements

**Authentication Flow:**

1. Store JWT token in localStorage (with expiration handling)
2. Implement auth guard for protected routes
3. Auto-redirect unauthenticated users to login
4. Handle token refresh/expiration gracefully

**Form Validation:**

- Client-side validation with real-time feedback
- Server-side error handling and display
- Loading states during API calls
- Proper error messages for all failure scenarios

**Responsive Design:**

- Mobile-first approach
- Accessible forms (ARIA labels, proper focus management)
- Loading spinners and disabled states
- Toast notifications for success/error messages

### API Integration Details

**Base URL Configuration:**

```javascript
// Use environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com'
```

#### Authentication Endpoints

**Register User:**

```
POST /api/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "password_confirmation": "securepassword123"
}

Response (201): {
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "jwt.token.here",
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z"
    }
  }
}
```

**Login User:**

```
POST /api/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}

Response (200): Same as register response
```

**OAuth Flow:**

1. Redirect to: `GET /auth/{provider}/login` (provider: github, google)
2. Handle callback: `GET /auth/{provider}/callback?code=...&state=...`
3. Extract token from callback response

**Get User Profile:**

```
GET /users/profile
Authorization: Bearer {jwt_token}

Response (200): {
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z"
  }
}
```

**Error Response Format:**

```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Specific error 1", "Specific error 2"]
}
```

### Implementation Steps

1. **Project Scaffolding**

   - Create Vue 3 + Vite project
   - Configure ESLint, Prettier
   - Set up folder structure
   - Initialize Git repository

2. **Core Setup**

   - Install and configure chosen UI framework
   - Set up Vue Router with route guards
   - Configure Pinia store
   - Set up Axios with interceptors

3. **Authentication Implementation**

   - Create auth store with Pinia
   - Implement auth service with all API calls
   - Build login/register forms with validation
   - Add OAuth button handlers

4. **UI/UX Implementation**

   - Create responsive layouts
   - Add loading states and error handling
   - Implement toast notifications
   - Add proper accessibility attributes

5. **Testing & Documentation**
   - Write unit tests for auth store and components
   - Create comprehensive README
   - Add environment variable examples
   - Document API integration

### Quality Standards

**Code Quality:**

- Use Vue 3 Composition API consistently
- Implement proper TypeScript types (if using TS)
- Follow Vue.js style guide
- Add JSDoc comments for complex functions
- Use semantic HTML and proper ARIA attributes

**Git Workflow:**

- Commit after each major feature
- Use conventional commit messages
- Create feature branches for major changes

**Testing Requirements:**

- Unit tests for auth store actions
- Component tests for forms
- E2E tests for authentication flow
- Minimum 80% code coverage

### Environment Configuration

Create `.env.example`:

```
VITE_API_BASE_URL=https://api.example.com
VITE_OAUTH_GITHUB_CLIENT_ID=your_github_client_id
VITE_OAUTH_GOOGLE_CLIENT_ID=your_google_client_id
```

### Deliverables

1. **Complete Vue.js application** with all requested features
2. **Comprehensive README.md** with setup instructions
3. **Test suite** with good coverage
4. **Environment configuration** files
5. **Git repository** with clean commit history

### Success Criteria

- [ ] All three pages (login, register, dashboard) are fully functional
- [ ] Authentication flow works end-to-end
- [ ] Forms have proper validation and error handling
- [ ] Application is responsive and accessible
- [ ] Code follows Vue.js best practices
- [ ] Tests pass and provide good coverage
- [ ] Documentation is clear and complete

## Additional Context

This application will serve as a foundation for a larger project, so prioritize:

- **Scalability:** Clean architecture that can grow
- **Maintainability:** Well-organized, documented code
- **User Experience:** Smooth, intuitive interface
- **Security:** Proper token handling and validation
