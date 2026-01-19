# IntroHub TanStack Start - Deployment Guide

This guide covers deploying your IntroHub TanStack Start application to various platforms.

## 📋 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Production build tested locally
- [ ] Backend API accessible from deployment platform
- [ ] CORS configured on backend for production domain
- [ ] SSL/HTTPS enabled
- [ ] Error tracking configured (optional)

## 🔧 Environment Variables

Required environment variables for production:

```env
VITE_API_BASE_URL=https://api.yourapp.com/api
VITE_API_TIMEOUT=30000
```

## 🏗️ Building for Production

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Test production build locally
npm run preview
```

The build creates:

- `.output/server/` - Server bundle
- `.output/public/` - Static assets
- Optimized and minified code

## 🚀 Deployment Platforms

### 1. Vercel (Recommended)

**Pros:** Zero-config, automatic deployments, edge network, great DX

**Steps:**

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Deploy:

```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add `VITE_API_BASE_URL`

4. Configure custom domain (optional):
   - Go to Project Settings → Domains
   - Add your domain

**vercel.json** (optional):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".output/public",
  "framework": null
}
```

### 2. Netlify

**Pros:** Easy deployment, good free tier, form handling, serverless functions

**Steps:**

1. Install Netlify CLI:

```bash
npm i -g netlify-cli
```

2. Deploy:

```bash
netlify deploy --prod
```

3. Or connect GitHub repository:
   - Go to Netlify dashboard
   - Click "New site from Git"
   - Connect repository
   - Configure build settings

**netlify.toml**:

```toml
[build]
  command = "npm run build"
  publish = ".output/public"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. Cloudflare Pages

**Pros:** Fast global CDN, generous free tier, Workers integration

**Steps:**

1. Connect GitHub repository:
   - Go to Cloudflare Pages dashboard
   - Click "Create a project"
   - Connect repository

2. Configure build settings:
   - Build command: `npm run build`
   - Build output directory: `.output/public`
   - Root directory: `frontend-tanstack`

3. Set environment variables:
   - Add `VITE_API_BASE_URL` in project settings

### 4. Railway

**Pros:** Full-stack deployment, database hosting, easy scaling

**Steps:**

1. Install Railway CLI:

```bash
npm i -g @railway/cli
```

2. Login and deploy:

```bash
railway login
railway init
railway up
```

3. Or use GitHub integration:
   - Connect repository in Railway dashboard
   - Configure build settings
   - Add environment variables

**railway.json**:

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npm run start",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### 5. Fly.io

**Pros:** Global deployment, custom regions, Docker support

**Steps:**

1. Install Fly CLI:

```bash
curl -L https://fly.io/install.sh | sh
```

2. Login and launch:

```bash
fly auth login
fly launch
```

3. Deploy:

```bash
fly deploy
```

**fly.toml**:

```toml
app = "introhub"

[build]
  builder = "heroku/buildpacks:20"

[env]
  PORT = "8080"

[[services]]
  internal_port = 8080
  protocol = "tcp"

  [[services.ports]]
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443
```

## 🔐 Security Considerations

### 1. Environment Variables

Never commit sensitive data:

```bash
# .gitignore
.env
.env.local
.env.production
```

### 2. CORS Configuration

Configure backend CORS for production domain:

```go
// backend/internal/api/middleware/cors.go
allowedOrigins := []string{
    "https://yourapp.com",
    "https://www.yourapp.com",
}
```

### 3. API Security

- Use HTTPS for all API calls
- Implement rate limiting
- Validate all inputs
- Use secure token storage
- Implement CSRF protection

### 4. Content Security Policy

Add CSP headers in production:

```typescript
// In root route head config
{
  meta: [
    {
      "http-equiv": "Content-Security-Policy",
      content:
        "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
    },
  ];
}
```

## 📊 Monitoring & Analytics

### Error Tracking

**Sentry Integration:**

```bash
npm install @sentry/react
```

```typescript
// src/routes/__root.tsx
import * as Sentry from "@sentry/react";

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: "YOUR_SENTRY_DSN",
    environment: "production",
  });
}
```

### Analytics

**Google Analytics:**

```typescript
// Add to root route head
{
  scripts: [
    {
      src: "https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID",
      async: true,
    },
    {
      children: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'GA_MEASUREMENT_ID');
      `,
    },
  ];
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions

**.github/workflows/deploy.yml**:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm ci
        working-directory: ./frontend-tanstack

      - name: Build
        run: npm run build
        working-directory: ./frontend-tanstack
        env:
          VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./frontend-tanstack
```

## 🧪 Testing Production Build

Before deploying, test the production build locally:

```bash
# Build
npm run build

# Preview
npm run preview

# Test checklist:
# - [ ] All routes work
# - [ ] Authentication flow works
# - [ ] API calls succeed
# - [ ] Assets load correctly
# - [ ] No console errors
# - [ ] Performance is good
```

## 📈 Performance Optimization

### 1. Code Splitting

TanStack Start automatically code-splits by route. Verify in build output:

```bash
npm run build
# Check .output/public/assets/ for split chunks
```

### 2. Asset Optimization

- Images: Use WebP format
- Fonts: Subset and preload
- CSS: Purge unused styles (Tailwind does this automatically)

### 3. Caching Strategy

Configure cache headers:

```typescript
// In server functions or API routes
setResponseHeaders(
  new Headers({
    "Cache-Control": "public, max-age=31536000, immutable",
  }),
);
```

## 🔍 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules .output
npm install
npm run build
```

### Environment Variables Not Working

- Ensure variables start with `VITE_`
- Restart dev server after changing .env
- Check deployment platform has variables set

### 404 on Refresh

Configure platform to serve index.html for all routes:

- Vercel: Automatic
- Netlify: Use `_redirects` or `netlify.toml`
- Others: Configure server to serve SPA

### API CORS Errors

Update backend CORS configuration:

```go
allowedOrigins := []string{
    "https://yourapp.com",
}
```

## 📞 Support

For deployment issues:

1. Check platform-specific documentation
2. Review build logs
3. Test production build locally
4. Contact platform support

---

**Last Updated:** 2026-01-19  
**TanStack Start Version:** v0 (Release Candidate)
