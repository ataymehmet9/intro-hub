# Quick Start Guide - TanStack Start IntroHub

Get up and running with the migrated IntroHub application in 5 minutes.

---

## 🚀 Installation & Setup

### 1. Install Dependencies

```bash
cd frontend-tanstack
npm install
```

### 2. Configure Environment

```bash
# Copy the example env file
cp .env.example .env

# Edit .env and set your API URL
# VITE_API_BASE_URL=http://localhost:8000/api
```

### 3. Start Development Server

```bash
npm run dev
```

Application will be available at **http://localhost:3000**

---

## 🔧 Common Commands

```bash
# Development
npm run dev              # Start dev server with HMR
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint (if configured)
npm run format          # Format code with Prettier (if configured)

# Type Checking
npx tsc --noEmit        # Check TypeScript types (note: will show Vite-related errors)
```

---

## 📁 Project Structure

```
frontend-tanstack/
├── src/
│   ├── routes/                 # 🔹 File-based routing
│   │   ├── __root.tsx         # Root layout
│   │   ├── index.tsx          # Landing page (/)
│   │   ├── login.tsx          # Login page (/login)
│   │   ├── signup.tsx         # Signup page (/signup)
│   │   └── _authenticated/    # Protected routes
│   │       ├── dashboard.tsx  # /dashboard
│   │       ├── contacts.tsx   # /contacts
│   │       ├── requests.tsx   # /requests
│   │       ├── search.tsx     # /search
│   │       └── profile.tsx    # /profile
│   │
│   ├── server/                # 🔹 Server functions
│   │   ├── auth.functions.ts  # Auth operations
│   │   └── user.functions.ts  # User operations
│   │
│   ├── contexts/              # 🔹 React Context
│   │   ├── AuthContext.tsx
│   │   ├── ContactContext.tsx
│   │   └── RequestContext.tsx
│   │
│   ├── services/              # 🔹 API layer
│   │   ├── api.ts            # Axios client
│   │   ├── auth.ts
│   │   ├── contacts.ts
│   │   └── requests.ts
│   │
│   ├── components/            # 🔹 React components
│   │   ├── ui/               # Base UI components
│   │   └── intro-hub/        # App-specific components
│   │
│   ├── assets/               # 🔹 Styles & assets
│   ├── types/                # 🔹 TypeScript types
│   └── utils/                # 🔹 Utility functions
│
├── public/                   # Static assets
├── app.config.ts            # TanStack Start config
├── vite.config.ts           # Vite config
└── package.json             # Dependencies
```

---

## 🎯 Key Concepts

### 1. File-Based Routing

Routes are defined by file structure in `src/routes/`:

- `index.tsx` → `/`
- `login.tsx` → `/login`
- `_authenticated/dashboard.tsx` → `/dashboard` (protected)

### 2. Server Functions

Type-safe RPCs between client and server:

```typescript
// Define server function
export const loginUser = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => LoginSchema.parse(data))
  .handler(async ({ data }) => {
    // Server-side logic
  });

// Use in component
const result = await loginUser({ data: { email, password } });
```

### 3. Navigation

Use TanStack Router's Link component:

```typescript
import { Link } from '@tanstack/react-router'

<Link to="/dashboard">Go to Dashboard</Link>
```

### 4. Route Protection

Protected routes use `beforeLoad`:

```typescript
export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    const token = tokenUtils.getToken();
    if (!token) {
      throw redirect({ to: "/login" });
    }
  },
});
```

---

## 🔐 Authentication Flow

### Sign Up

1. User fills signup form at `/signup`
2. Form submits to `signupUser` server function
3. Server function calls Go backend API
4. On success: JWT token stored, user redirected to `/dashboard`

### Login

1. User fills login form at `/login`
2. Form submits to `loginUser` server function
3. Server function calls Go backend API
4. On success: JWT token stored, user redirected to `/dashboard`

### Logout

1. User clicks logout button
2. `logout()` from AuthContext clears token
3. User redirected to `/login`

### Token Management

- Stored in `localStorage` as `accessToken`
- Automatically added to API requests via Axios interceptor
- Expired tokens trigger automatic logout

---

## 📝 Common Tasks

### Add a New Route

1. Create file in `src/routes/`:

```typescript
// src/routes/new-page.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/new-page')({
  component: NewPage,
})

function NewPage() {
  return <div>New Page Content</div>
}
```

2. Navigate to `/new-page`

### Add a New Server Function

1. Create in `src/server/`:

```typescript
// src/server/my.functions.ts
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MySchema = z.object({
  name: z.string(),
});

export const myFunction = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => MySchema.parse(data))
  .handler(async ({ data }) => {
    // Your logic here
    return { success: true };
  });
```

2. Use in component:

```typescript
import { myFunction } from "~/server/my.functions";

const result = await myFunction({ data: { name: "test" } });
```

### Add a New Context

1. Create in `src/contexts/`:

```typescript
// src/contexts/MyContext.tsx
import React, { createContext, useContext } from 'react'

interface MyContextType {
  value: string
}

const MyContext = createContext<MyContextType | undefined>(undefined)

export const MyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <MyContext.Provider value={{ value: 'test' }}>
      {children}
    </MyContext.Provider>
  )
}

export const useMyContext = () => {
  const context = useContext(MyContext)
  if (!context) throw new Error('useMyContext must be used within MyProvider')
  return context
}
```

2. Add to root layout:

```typescript
// src/routes/__root.tsx
import { MyProvider } from '~/contexts/MyContext'

<MyProvider>
  <Outlet />
</MyProvider>
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# TypeScript errors from tsc are expected due to Vite
# The dev server handles TypeScript correctly
# Check browser console for actual errors
```

### API Connection Issues

```bash
# Verify backend is running
curl http://localhost:8000/api/health

# Check VITE_API_BASE_URL in .env
cat .env
```

### Build Errors

```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Rebuild
npm run build
```

---

## 📚 Resources

### TanStack Ecosystem

- [TanStack Start Docs](https://tanstack.com/start)
- [TanStack Router Docs](https://tanstack.com/router)
- [TanStack Query Docs](https://tanstack.com/query) (if using)

### Related Technologies

- [Vite Documentation](https://vitejs.dev)
- [React 19 Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com)

### Project Documentation

- `README.md` - Full setup guide
- `DEPLOYMENT.md` - Production deployment
- `TESTING_GUIDE.md` - Testing checklist
- `MIGRATION_COMPLETE.md` - Migration details

---

## 💡 Tips & Best Practices

### Performance

- Use React.lazy() for code splitting
- Optimize images and assets
- Use TanStack Query for data caching (if needed)

### Code Organization

- Keep components small and focused
- Use TypeScript for type safety
- Follow existing naming conventions
- Document complex logic

### State Management

- Use Context for global state
- Use local state for component-specific data
- Consider TanStack Query for server state

### Error Handling

- Always handle async errors
- Show user-friendly error messages
- Log errors for debugging

---

## 🎓 Learning Path

1. **Start Here**: Read README.md
2. **Understand Routing**: Explore `src/routes/`
3. **Learn Server Functions**: Check `src/server/`
4. **Study Components**: Review `src/components/`
5. **Test Features**: Follow TESTING_GUIDE.md
6. **Deploy**: Read DEPLOYMENT.md

---

## 🤝 Getting Help

### Check Documentation

1. This QUICK_START.md
2. README.md for detailed setup
3. TESTING_GUIDE.md for testing
4. MIGRATION_COMPLETE.md for architecture

### Debug Steps

1. Check browser console for errors
2. Check terminal for build errors
3. Verify backend is running
4. Check environment variables
5. Clear cache and rebuild

### Common Solutions

- **Blank page**: Check browser console
- **404 errors**: Verify route file names
- **Auth issues**: Check token in localStorage
- **API errors**: Verify backend URL in .env

---

**Last Updated**: January 19, 2026  
**Version**: 1.0.0  
**Framework**: TanStack Start (Beta)
