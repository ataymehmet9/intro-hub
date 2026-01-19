# Next.js to TanStack Start Migration Plan

## Executive Summary

This document outlines the complete migration strategy for converting the IntroHub Next.js 15 application to TanStack Start. The migration aims to simplify the full-stack architecture while maintaining all existing functionality and improving type-safety through TanStack Router's file-based routing system.

**Migration Goals:**

- Simplify full-stack architecture by removing Next.js complexity
- Leverage TanStack Start's server functions for client-side features
- Maintain Go backend API for core business logic (auth, contacts, requests)
- Improve type-safety with TanStack Router
- Keep existing UI components and styling (Tailwind CSS)

---

## Current Architecture Analysis

### Technology Stack (Next.js)

**Frontend Framework:**

- Next.js 15.3.1 with App Router
- React 19.0.0
- TypeScript 5.x

**UI & Styling:**

- Custom Tailwind CSS component library (ECME)
- Tailwind CSS 4.0.4
- Framer Motion for animations

**State Management:**

- React Context API (AuthContext, ContactContext, RequestContext)
- Zustand 5.0.2 (available but not heavily used)
- SWR 2.3.0 for data fetching

**Forms & Validation:**

- React Hook Form 7.53.0
- Zod 3.23.8

**Authentication:**

- NextAuth 5.0.0-beta.25
- Custom JWT token management
- Cookie-based middleware protection

**Backend Integration:**

- Axios 1.7.7 for API calls
- Go backend API (localhost:8000)

### Current Project Structure

```
frontend/src/
├── app/
│   ├── (auth-pages)/          # Login, signup, forgot-password
│   ├── (protected-pages)/     # Dashboard, contacts, requests, profile, search
│   ├── (public-pages)/        # Landing, pricing, what-is-introhub
│   ├── api/                   # NextAuth API routes
│   └── layout.tsx             # Root layout
├── components/
│   ├── intro-hub/             # IntroHub-specific components
│   ├── layouts/               # Layout components
│   ├── shared/                # Shared utilities
│   ├── template/              # Template components
│   └── ui/                    # ECME UI library
├── contexts/                  # React contexts
├── services/                  # API service layer
├── types/                     # TypeScript types
├── utils/                     # Utility functions
└── middleware.ts              # Route protection
```

---

## Target Architecture (TanStack Start)

### Technology Stack

**Framework:**

- TanStack Start v0 (Release Candidate)
- TanStack Router v1 (file-based routing)
- React 19.0.0
- Vite (build tool)

**Key Features:**

- Full-document SSR
- Streaming
- Server functions (type-safe RPCs)
- File-based routing
- Universal deployment

**What Stays the Same:**

- UI components (ECME Tailwind library)
- React Hook Form + Zod
- Framer Motion
- Most utility functions
- Go backend API

**What Changes:**

- Next.js App Router → TanStack Router file-based routing
- NextAuth → Custom auth with TanStack Start patterns
- Next.js middleware → TanStack Router route guards
- Some API calls → Server functions (for client-side features)

### Proposed Project Structure

```
frontend/src/
├── routes/                    # TanStack Router file-based routes
│   ├── __root.tsx            # Root route (document shell)
│   ├── index.tsx             # Landing page (/)
│   ├── login.tsx             # Login page
│   ├── signup.tsx            # Signup page
│   ├── forgot-password.tsx   # Forgot password
│   ├── _authenticated/       # Protected routes layout
│   │   ├── dashboard.tsx
│   │   ├── contacts.tsx
│   │   ├── requests.tsx
│   │   ├── search.tsx
│   │   └── profile.tsx
│   └── _public/              # Public routes layout
│       ├── pricing.tsx
│       └── what-is-introhub.tsx
├── components/               # Same structure as before
├── server/                   # Server functions
│   ├── auth.functions.ts    # Auth-related server functions
│   ├── user.functions.ts    # User profile server functions
│   └── utils.server.ts      # Server-only utilities
├── services/                 # API service layer (Go backend)
│   ├── api.ts               # Axios instance
│   ├── contacts.ts          # Contact API calls
│   └── requests.ts          # Request API calls
├── contexts/                 # React contexts (simplified)
├── hooks/                    # Custom hooks
├── types/                    # TypeScript types
├── utils/                    # Utility functions
└── router.tsx               # Router configuration
```

---

## Migration Strategy

### Phase 1: Project Setup & Foundation

#### 1.1 Create New TanStack Start Project

**Action Items:**

- [ ] Create new TanStack Start project using CLI
- [ ] Choose appropriate starter template (basic or basic-auth)
- [ ] Review generated project structure

**Commands:**

```bash
cd frontend
npm create @tanstack/start@latest intro-hub-tanstack
# Select options:
# - TypeScript: Yes
# - Tailwind CSS: Yes
# - ESLint: Yes
```

**Alternative - Clone Example:**

```bash
npx gitpick TanStack/router/tree/main/examples/react/start-basic-auth intro-hub-tanstack
cd intro-hub-tanstack
npm install
```

#### 1.2 Configure Dependencies

**Action Items:**

- [ ] Copy relevant dependencies from Next.js package.json
- [ ] Remove Next.js specific packages
- [ ] Add TanStack Start specific packages
- [ ] Verify all UI library dependencies

**Dependencies to Keep:**

```json
{
  "@floating-ui/react": "^0.27.2",
  "@fullcalendar/*": "^6.1.15",
  "@hello-pangea/dnd": "^18.0.1",
  "@hookform/resolvers": "^3.9.0",
  "@tanstack/react-table": "^8.20.5",
  "@tanstack/react-virtual": "^3.11.2",
  "axios": "^1.7.7",
  "classnames": "^2.5.1",
  "dayjs": "^1.11.13",
  "framer-motion": "11.15.0",
  "react-hook-form": "^7.53.0",
  "react-icons": "5.4.0",
  "tailwind-merge": "^2.5.2",
  "zod": "^3.23.8",
  "zustand": "^5.0.2"
}
```

**Dependencies to Add:**

```json
{
  "@tanstack/react-router": "^1.x",
  "@tanstack/react-start": "^0.x",
  "@tanstack/router-devtools": "^1.x",
  "@tanstack/router-vite-plugin": "^1.x"
}
```

**Dependencies to Remove:**

```json
{
  "next": "15.3.1",
  "next-auth": "^5.0.0-beta.25",
  "next-intl": "^4.1.0"
}
```

#### 1.3 Configure Build Tools

**Action Items:**

- [ ] Set up Vite configuration
- [ ] Configure TanStack Router plugin
- [ ] Set up Tailwind CSS
- [ ] Configure TypeScript paths

**vite.config.ts:**

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";

export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite({
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
    }),
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
```

**Environment Variables:**

```env
# .env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_TIMEOUT=30000
```

---

### Phase 2: Core Infrastructure Migration

#### 2.1 Set Up Router Configuration

**Action Items:**

- [ ] Create `src/router.tsx` with router configuration
- [ ] Configure default preloading behavior
- [ ] Set up scroll restoration
- [ ] Configure cache settings

**src/router.tsx:**

```typescript
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    scrollRestoration: true,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
```

#### 2.2 Create Root Route

**Action Items:**

- [ ] Create `src/routes/__root.tsx`
- [ ] Set up document shell (html, head, body)
- [ ] Add global providers (Theme, etc.)
- [ ] Configure meta tags

**src/routes/\_\_root.tsx:**

```typescript
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import ThemeProvider from '@/components/template/Theme/ThemeProvider'
import type { ReactNode } from 'react'
import '@/assets/styles/app.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'IntroHub - Professional Introduction Management',
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <ThemeProvider>
        <Outlet />
      </ThemeProvider>
      {process.env.NODE_ENV === 'development' && <TanStackRouterDevtools />}
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
```

#### 2.3 Migrate API Service Layer

**Action Items:**

- [ ] Update `src/services/api.ts` for TanStack Start
- [ ] Keep Axios instance for Go backend calls
- [ ] Update token management utilities
- [ ] Remove Next.js specific code

**src/services/api.ts:**

```typescript
import axios, { AxiosInstance } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || "30000");

// Token storage keys
const TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token management utilities
export const tokenUtils = {
  getToken: (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  },

  setToken: (token: string): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  getRefreshToken: (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    }
    return null;
  },

  setRefreshToken: (token: string): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    }
  },

  clearTokens: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  },
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenUtils.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      tokenUtils.clearTokens();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
```

---

### Phase 3: Authentication System Migration

#### 3.1 Create Server Functions for Auth

**Action Items:**

- [ ] Create `src/server/auth.functions.ts`
- [ ] Implement login server function
- [ ] Implement signup server function
- [ ] Implement logout server function
- [ ] Implement getCurrentUser server function

**src/server/auth.functions.ts:**

```typescript
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { apiClient, tokenUtils } from "@/services/api";

// Login schema
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Signup schema
const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
});

// Login server function
export const loginUser = createServerFn({ method: "POST" })
  .inputValidator(LoginSchema)
  .handler(async ({ data }) => {
    try {
      const response = await apiClient.post("/auth/login", data);
      return {
        success: true,
        token: response.data.token,
        user: response.data.user,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  });

// Signup server function
export const signupUser = createServerFn({ method: "POST" })
  .inputValidator(SignupSchema)
  .handler(async ({ data }) => {
    try {
      const response = await apiClient.post("/auth/register", data);
      return {
        success: true,
        token: response.data.token,
        user: response.data.user,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Signup failed");
    }
  });

// Get current user server function
export const getCurrentUser = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const response = await apiClient.get("/auth/me");
      return response.data;
    } catch (error: any) {
      throw new Error("Failed to fetch user data");
    }
  },
);
```

#### 3.2 Update Auth Context

**Action Items:**

- [ ] Simplify AuthContext for TanStack Start
- [ ] Remove Next.js router dependencies
- [ ] Use TanStack Router navigation
- [ ] Integrate server functions

**src/contexts/AuthContext.tsx:**

```typescript
'use client'

import React, { createContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from '@tanstack/react-router'
import { toast } from '@/components/ui'
import { loginUser, signupUser, getCurrentUser } from '@/server/auth.functions'
import { tokenUtils } from '@/services/api'
import { AuthContextType, User, SignupData } from '@/types/intro-hub'

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = tokenUtils.getToken()

      if (storedToken) {
        try {
          const userData = await getCurrentUser()
          setUser(userData)
          setIsAuthenticated(true)
        } catch (error) {
          console.error('Error fetching user data:', error)
          handleLogout()
        }
      }

      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const result = await loginUser({ data: { email, password } })

      tokenUtils.setToken(result.token)
      setUser(result.user)
      setIsAuthenticated(true)

      toast.push({
        type: 'success',
        message: 'Login successful!',
      })

      router.navigate({ to: '/dashboard' })
    } catch (error: any) {
      toast.push({
        type: 'error',
        message: error.message || 'Login failed',
      })
      throw error
    }
  }

  const signup = async (data: SignupData) => {
    try {
      const result = await signupUser({ data })

      tokenUtils.setToken(result.token)
      setUser(result.user)
      setIsAuthenticated(true)

      toast.push({
        type: 'success',
        message: 'Account created successfully!',
      })

      router.navigate({ to: '/dashboard' })
    } catch (error: any) {
      toast.push({
        type: 'error',
        message: error.message || 'Signup failed',
      })
      throw error
    }
  }

  const logout = () => {
    tokenUtils.clearTokens()
    setUser(null)
    setIsAuthenticated(false)
    router.navigate({ to: '/login' })

    toast.push({
      type: 'info',
      message: 'Logged out successfully',
    })
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

#### 3.3 Implement Route Protection

**Action Items:**

- [ ] Create authentication layout route
- [ ] Implement beforeLoad hook for auth checks
- [ ] Add redirect logic for unauthenticated users
- [ ] Create public routes layout

**src/routes/\_authenticated.tsx (Protected Layout):**

```typescript
import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { tokenUtils } from '@/services/api'
import PostLoginLayout from '@/components/layouts/PostLoginLayout'
import { AuthProvider } from '@/contexts/AuthContext'
import { ContactProvider } from '@/contexts/ContactContext'
import { RequestProvider } from '@/contexts/RequestContext'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const token = tokenUtils.getToken()

    if (!token) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return (
    <AuthProvider>
      <ContactProvider>
        <RequestProvider>
          <PostLoginLayout>
            <Outlet />
          </PostLoginLayout>
        </RequestProvider>
      </ContactProvider>
    </AuthProvider>
  )
}
```

---

### Phase 4: Route Migration

#### 4.1 Public Routes

**Action Items:**

- [ ] Create `src/routes/index.tsx` (landing page)
- [ ] Create `src/routes/login.tsx`
- [ ] Create `src/routes/signup.tsx`
- [ ] Create `src/routes/forgot-password.tsx`
- [ ] Create `src/routes/_public/pricing.tsx`
- [ ] Create `src/routes/_public/what-is-introhub.tsx`

**Example - src/routes/login.tsx:**

```typescript
import { createFileRoute, redirect } from '@tanstack/react-router'
import { tokenUtils } from '@/services/api'
import LoginForm from '@/components/intro-hub/auth/LoginForm'

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    const token = tokenUtils.getToken()

    if (token) {
      throw redirect({
        to: '/dashboard',
      })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">
        <LoginForm />
      </div>
    </div>
  )
}
```

#### 4.2 Protected Routes

**Action Items:**

- [ ] Create `src/routes/_authenticated/dashboard.tsx`
- [ ] Create `src/routes/_authenticated/contacts.tsx`
- [ ] Create `src/routes/_authenticated/requests.tsx`
- [ ] Create `src/routes/_authenticated/search.tsx`
- [ ] Create `src/routes/_authenticated/profile.tsx`

**Example - src/routes/\_authenticated/dashboard.tsx:**

```typescript
import { createFileRoute } from '@tanstack/react-router'
import DashboardContent from '@/components/intro-hub/dashboard/DashboardContent'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  return <DashboardContent />
}
```

---

### Phase 5: Component Migration

#### 5.1 Copy UI Components

**Action Items:**

- [ ] Copy entire `src/components/ui/` directory (no changes needed)
- [ ] Copy `src/components/shared/` directory
- [ ] Copy `src/components/template/` directory
- [ ] Update any Next.js specific imports (Link, Image, etc.)

**Import Updates:**

```typescript
// Before (Next.js)
import Link from "next/link";
import Image from "next/image";

// After (TanStack Router)
import { Link } from "@tanstack/react-router";
// Use regular <img> or keep Next.js Image if needed
```

#### 5.2 Migrate IntroHub Components

**Action Items:**

- [ ] Copy `src/components/intro-hub/` directory
- [ ] Update router imports
- [ ] Update navigation logic
- [ ] Test all components

#### 5.3 Update Layout Components

**Action Items:**

- [ ] Migrate `PostLoginLayout` component
- [ ] Update navigation menu
- [ ] Update header component
- [ ] Test responsive behavior

---

### Phase 6: Server Functions for Client Features

#### 6.1 Identify Features for Server Functions

**Features to Implement with Server Functions:**

- User profile updates
- Password changes
- Account settings
- File uploads (profile pictures)
- Data export functionality

**Features to Keep with Go Backend:**

- Contact CRUD operations
- Introduction request management
- Search functionality
- Authentication (login, signup, token refresh)

#### 6.2 Create User Profile Server Functions

**Action Items:**

- [ ] Create `src/server/user.functions.ts`
- [ ] Implement updateProfile server function
- [ ] Implement changePassword server function
- [ ] Implement uploadProfilePicture server function

**src/server/user.functions.ts:**

```typescript
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { apiClient } from "@/services/api";

const UpdateProfileSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
});

export const updateProfile = createServerFn({ method: "POST" })
  .inputValidator(UpdateProfileSchema)
  .handler(async ({ data }) => {
    try {
      const response = await apiClient.put("/users/profile", data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to update profile",
      );
    }
  });

const ChangePasswordSchema = z
  .object({
    current_password: z.string().min(8),
    new_password: z.string().min(8),
    confirm_password: z.string().min(8),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export const changePassword = createServerFn({ method: "POST" })
  .inputValidator(ChangePasswordSchema)
  .handler(async ({ data }) => {
    try {
      const response = await apiClient.post("/users/change-password", {
        current_password: data.current_password,
        new_password: data.new_password,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to change password",
      );
    }
  });
```

---

### Phase 7: State Management Migration

#### 7.1 Update Context Providers

**Action Items:**

- [ ] Update ContactContext for TanStack Router
- [ ] Update RequestContext for TanStack Router
- [ ] Remove Next.js specific code
- [ ] Test context functionality

#### 7.2 Consider TanStack Query Integration

**Action Items:**

- [ ] Evaluate using TanStack Query for data fetching
- [ ] Implement query hooks for contacts
- [ ] Implement query hooks for requests
- [ ] Add optimistic updates

**Example with TanStack Query:**

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} from "@/services/contacts";

export function useContacts() {
  const queryClient = useQueryClient();

  const { data: contacts, isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: getContacts,
  });

  const createMutation = useMutation({
    mutationFn: createContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      updateContact(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });

  return {
    contacts: contacts || [],
    isLoading,
    createContact: createMutation.mutate,
    updateContact: updateMutation.mutate,
    deleteContact: deleteMutation.mutate,
  };
}
```

---

### Phase 8: Testing & Validation

#### 8.1 Functional Testing

**Test Cases:**

- [ ] User can sign up with valid credentials
- [ ] User can log in with valid credentials
- [ ] User is redirected to login when accessing protected routes without auth
- [ ] User is redirected to dashboard when accessing auth pages while authenticated
- [ ] User can view dashboard with correct data
- [ ] User can create, read, update, delete contacts
- [ ] User can create, view, approve/reject introduction requests
- [ ] User can search for contacts
- [ ] User can update profile information
- [ ] User can change password
- [ ] User can log out successfully

#### 8.2 UI/UX Testing

**Test Cases:**

- [ ] All pages render correctly on desktop
- [ ] All pages render correctly on tablet
- [ ] All pages render correctly on mobile
- [ ] Navigation menu works correctly
- [ ] Forms validate properly
- [ ] Error messages display correctly
- [ ] Success messages display correctly
- [ ] Loading states work correctly
- [ ] Dark mode works (if applicable)

#### 8.3 Performance Testing

**Metrics to Check:**

- [ ] Initial page load time
- [ ] Time to interactive
- [ ] Bundle size comparison with Next.js
- [ ] API response times
- [ ] Navigation speed

---

### Phase 9: Deployment Configuration

#### 9.1 Build Configuration

**Action Items:**

- [ ] Configure production build settings
- [ ] Set up environment variables for production
- [ ] Test production build locally
- [ ] Optimize bundle size

**Build Commands:**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "start": "vite preview"
  }
}
```

#### 9.2 Deployment Options

**Recommended Platforms:**

1. **Vercel** - Easy deployment, good for TanStack Start
2. **Netlify** - Similar to Vercel, good support
3. **Cloudflare Pages** - Fast, global CDN
4. **Railway** - Good for full-stack apps
5. **Fly.io** - Good for custom deployments

**Deployment Steps (Vercel Example):**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
VITE_API_BASE_URL=https://api.yourapp.com/api
```

---

## Migration Checklist

### Pre-Migration

- [x] Review current Next.js architecture
- [x] Understand TanStack Start capabilities
- [x] Identify features for server functions vs Go backend
- [x] Create migration plan

### Phase 1: Setup

- [ ] Create new TanStack Start project
- [ ] Configure dependencies
- [ ] Set up build tools
- [ ] Configure environment variables

### Phase 2: Core Infrastructure

- [ ] Set up router configuration
- [ ] Create root route
- [ ] Migrate API service layer
- [ ] Set up TypeScript configuration

### Phase 3: Authentication

- [ ] Create auth server functions
- [ ] Update AuthContext
- [ ] Implement route protection
- [ ] Test authentication flow

### Phase 4: Routes

- [ ] Migrate public routes
- [ ] Migrate protected routes
- [ ] Test all route navigation
- [ ] Verify route guards

### Phase 5: Components

- [ ] Copy UI components
- [ ] Migrate IntroHub components
- [ ] Update layout components
- [ ] Test all components

### Phase 6: Server Functions

- [ ] Identify features for server functions
- [ ] Create user profile server functions
- [ ] Test server functions
- [ ] Document server function usage

### Phase 7: State Management

- [ ] Update context providers
- [ ] Consider TanStack Query integration
- [ ] Test state management
- [ ] Optimize data fetching

### Phase 8: Testing

- [ ] Functional testing
- [ ] UI/UX testing
- [ ] Performance testing
- [ ] Fix identified issues

### Phase 9: Deployment

- [ ] Configure build settings
- [ ] Set up deployment platform
- [ ] Deploy to production
- [ ] Monitor and optimize

---

## Key Differences: Next.js vs TanStack Start

### Routing

**Next.js:**

```typescript
// app/(protected-pages)/dashboard/page.tsx
export default function DashboardPage() {
  return <div>Dashboard</div>
}
```

**TanStack Start:**

```typescript
// routes/_authenticated/dashboard.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  return <div>Dashboard</div>
}
```

### Navigation

**Next.js:**

```typescript
import Link from 'next/link'
import { useRouter } from 'next/navigation'

<Link href="/dashboard">Dashboard</Link>

const router = useRouter()
router.push('/dashboard')
```

**TanStack Start:**

```typescript
import { Link, useRouter } from '@tanstack/react-router'

<Link to="/dashboard">Dashboard</Link>

const router = useRouter()
router.navigate({ to: '/dashboard' })
```

### Data Fetching

**Next.js:**

```typescript
// Server Component
async function getData() {
  const res = await fetch('https://api.example.com/data')
  return res.json()
}

export default async function Page() {
  const data = await getData()
  return <div>{data}</div>
}
```

**TanStack Start:**

```typescript
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/page')({
  loader: async () => {
    const res = await fetch('https://api.example.com/data')
    return res.json()
  },
  component: Page,
})

function Page() {
  const data = Route.useLoaderData()
  return <div>{data}</div>
}
```

### Route Protection

**Next.js:**

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
```

**TanStack Start:**

```typescript
// routes/_authenticated.tsx
export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    const token = tokenUtils.getToken();
    if (!token) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
});
```

---

## Benefits of Migration

### 1. Simpler Architecture

- No App Router complexity
- No Server Components vs Client Components confusion
- Clearer separation of concerns
- More predictable behavior

### 2. Better Type Safety

- Full type inference across routes
- Type-safe navigation
- Type-safe search params
- Type-safe loaders and actions

### 3. Better Developer Experience

- Faster hot module replacement
- Simpler mental model
- Better error messages
- Excellent DevTools

### 4. Performance

- Smaller bundle sizes
- Faster builds with Vite
- Better code splitting
- Optimized production builds

### 5. Flexibility

- Deploy anywhere (not just Vercel)
- Mix server functions with external APIs
- More control over SSR behavior
- Easier to customize

---

## Potential Challenges

### 1. Learning Curve

- **Challenge:** Team needs to learn TanStack Router patterns
- **Mitigation:** Provide training, documentation, and examples

### 2. Ecosystem Maturity

- **Challenge:** TanStack Start is in Release Candidate stage
- **Mitigation:** Monitor releases, have rollback plan, engage with community

### 3. Migration Effort

- **Challenge:** Significant time investment required
- **Mitigation:** Phased approach, thorough testing, clear timeline

### 4. Third-Party Integrations

- **Challenge:** Some Next.js-specific libraries may not work
- **Mitigation:** Find alternatives, use vanilla React libraries

---

## Timeline Estimate

| Phase                        | Tasks                         | Estimated Time  |
| ---------------------------- | ----------------------------- | --------------- |
| Phase 1: Setup               | Project setup, dependencies   | 4-6 hours       |
| Phase 2: Core Infrastructure | Router, API layer             | 6-8 hours       |
| Phase 3: Authentication      | Auth system, route protection | 8-10 hours      |
| Phase 4: Routes              | All route migration           | 8-12 hours      |
| Phase 5: Components          | Component migration           | 12-16 hours     |
| Phase 6: Server Functions    | User features                 | 6-8 hours       |
| Phase 7: State Management    | Context updates               | 4-6 hours       |
| Phase 8: Testing             | Comprehensive testing         | 12-16 hours     |
| Phase 9: Deployment          | Build, deploy, monitor        | 4-6 hours       |
| **Total**                    |                               | **64-88 hours** |

**Recommended Approach:** 2-3 weeks with 1-2 developers working full-time

---

## Success Criteria

### Functional Requirements

- ✅ All authentication flows work correctly
- ✅ All CRUD operations for contacts work
- ✅ All request management features work
- ✅ Navigation and routing work correctly
- ✅ Forms validate properly
- ✅ API integration works correctly

### Non-Functional Requirements

- ✅ Application is responsive on all devices
- ✅ Performance is equal or better than Next.js version
- ✅ Code follows TanStack Start best practices
- ✅ All components are properly typed
- ✅ Bundle size is optimized
- ✅ SEO is maintained (if applicable)

### Quality Requirements

- ✅ Code is well-documented
- ✅ Components are reusable
- ✅ Error handling is comprehensive
- ✅ Loading states are implemented
- ✅ Accessibility standards are met

---

## Resources

### Documentation

- [TanStack Start Docs](https://tanstack.com/start/latest)
- [TanStack Router Docs](https://tanstack.com/router/latest)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Vite Docs](https://vite.dev/)

### Examples

- [TanStack Start Basic Auth Example](https://github.com/TanStack/router/tree/main/examples/react/start-basic-auth)
- [TanStack Start with React Query](https://github.com/TanStack/router/tree/main/examples/react/start-basic-react-query)

### Community

- [TanStack Discord](https://discord.com/invite/WrRKjPJ)
- [GitHub Discussions](https://github.com/TanStack/router/discussions)

---

## Next Steps

1. **Review this plan** with the development team
2. **Set up development environment** for TanStack Start
3. **Create a test branch** for migration work
4. **Start with Phase 1** - Project setup
5. **Iterate and test** each phase thoroughly
6. **Document learnings** as you progress
7. **Deploy to staging** for comprehensive testing
8. **Deploy to production** when ready

---

**Document Version:** 1.0  
**Date:** 2026-01-19  
**Status:** Ready for Implementation
