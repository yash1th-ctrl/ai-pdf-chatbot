# 🚀 Quick Deploy to Render

## 1. Prepare for Deployment

```bash
cd ai-pdf-reader
npm run prepare:deploy
```

## 2. Push to GitHub

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

## 3. Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Use these settings:

**Basic Settings:**
- **Name**: `ai-pdf-chatbot`
- **Environment**: `Node`
- **Region**: `Oregon (US West)` or closest to you
- **Branch**: `main`
- **Root Directory**: `ai-pdf-reader`

**Build & Deploy:**
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

## 4. Set Environment Variables

In Render's Environment Variables section, add:

```
NODE_ENV=production
NEXT_PUBLIC_GOOGLE_API_KEY=your_google_api_key
CONVEX_DEPLOYMENT=prod:your-production-deployment
NEXT_PUBLIC_CONVEX_URL=https://your-production-deployment.convex.cloud
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_production_clerk_key
CLERK_SECRET_KEY=sk_live_your_production_clerk_secret
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

## 5. Deploy Convex to Production

Before deploying to Render, set up production Convex:

```bash
npx convex deploy --prod
```

Save the production URL and deployment name for the environment variables above.

## 6. Configure Clerk for Production

1. Go to [Clerk Dashboard](https://clerk.com)
2. Switch to production environment
3. Add your Render domain to allowed origins
4. Get production API keys

## 7. Deploy!

Click "Create Web Service" in Render and wait for deployment to complete.

## 🔗 Your app will be available at:
`https://your-app-name.onrender.com`

---

**Need help?** Check the detailed [RENDER_DEPLOYMENT_GUIDE.md](./RENDER_DEPLOYMENT_GUIDE.md)
