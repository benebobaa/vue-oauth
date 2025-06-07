**System Prompt**

```
You are Jules, an autonomous AI code agent specialized in end-to-end web application development using modern JavaScript frameworks and industry best practices. You take high-level project briefs, scaffold projects from scratch, write clean, modular code, and apply high-quality UI/UX design. You document your progress and always follow community conventions, clear Git commit messages, and a test-driven mindset.
```

**User Prompt**

```
## Project Overview
- **Tech Stack:** Vue.js (latest stable), your choice of CSS framework or component library (e.g., Tailwind CSS, Vuetify, BootstrapVue, Element Plus).
- **Pages:** 
  1. **Login**: email/password fields + OAuth buttons (GitHub, Google).
  2. **Register**: email, password, password confirmation.
  3. **Dashboard**: shows a welcome message and user profile info.

## Goals & Requirements
1. **Scaffold** a brand-new Vue.js project (Vue CLI or Vite).  
2. **Install & configure** chosen CSS/UI library for a modern, responsive design.  
3. **Implement routing** for `/login`, `/register`, `/dashboard`.  
4. **Build** accessible, mobile-friendly components for each page.  
5. **State management**: Use Pinia or Vuex to store auth state (token + user).  
6. **Error handling** & **loading states** in forms.  
7. **Code quality**: 
   - ES Lint + Prettier config.
   - Modular folder structure: `components/`, `views/`, `stores/`, `services/`, `router/`.
   - Clean, self-documenting code.
8. **Version control**: Initialize Git repo, commit each major step with descriptive messages.
9. **Best practices**: unit tests for critical components (e.g., form validation), environment variables for API URLs, and clear README with setup instructions.

## OAuth 2.0 & Auth API Details
Use these endpoints in your `/services/auth.js` (or similar) to power login/register flows:

### 1. Register a New User

**Endpoint:** `POST /api/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "password_confirmation": "securepassword123"
}
```

**Success Response (201 Created):**
```json
{
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

### 2. Login

**Endpoint:** `POST /api/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
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

### 3. OAuth Login Flow

#### 3.1 Initiate OAuth Login

**Endpoint:** `GET /auth/:provider/login`

**Path Parameters:**
- `provider`: OAuth provider (e.g., `github`, `google`)

**Behavior:**
- Redirects user to the provider's login page
- After successful authentication, user is redirected to the callback URL with an authorization code

#### 3.2 OAuth Callback

**Endpoint:** `GET /auth/:provider/callback`

**Query Parameters:**
- `code`: Authorization code from the provider
- `state`: CSRF protection token

**Success Response (200 OK):**
```json
{
  "message": "Successfully authenticated",
  "token": "jwt.token.here",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z"
  }
}
```

## User Endpoints

### 1. Get User Profile

**Endpoint:** `GET /users/profile`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200 OK):**
```json
{
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

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Error detail 1", "Error detail 2"]
}
```

### Common HTTP Status Codes

- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication failed or token is invalid/expired
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists (e.g., duplicate email)
- `422 Unprocessable Entity`: Validation errors
- `500 Internal Server Error`: Server error

## Next Steps
1. Scaffold project and push initial repo.
2. Build Login & Register pages with form validation.
3. Wire up API calls to the above endpoints.
4. Create Dashboard view that fetches `/users/profile`.
5. Style everything with the chosen UI framework.
6. Document in README: install, run, test.

