# Deployment Guide

## 1. Environment Variables (Vercel)

When deploying to Vercel, you must set the following environment variable in the **Project Settings > Environment Variables** section:

- **Key**: `NEXT_PUBLIC_API_URL`
- **Value**: `https://tech-server-4l38.onrender.com/api`

> **Note**: The `.env.local` file is only for local development. Vercel does not use it during the build process regarding public variables unless checked in (which is discouraged for secrets, though this is public). It is best practice to set it in the Vercel dashboard.

## 2. Backend CORS Configuration (Render)

Your backend on Render must allow requests from your Vercel domain.

1. Go to your **Render Dashboard**.
2. Select the **tech-server** service.
3. Go to **Environment**.
4. Add or Update `CORS_ORIGIN`:
   - **Value**: `https://your-frontend-app.vercel.app` (Replace with your actual Vercel domain once deployed).
   - You can also allow multiple origins by separating them with a comma if your backend supports it, or temporarily use `*` for testing (not recommended for production).

## 3. Local Development

To run the app locally connected to the live backend, ensure `.env.local` exists in the root directory:

```bash
NEXT_PUBLIC_API_URL=https://tech-server-4l38.onrender.com/api
```

Run the development server:
```bash
npm run dev
```
