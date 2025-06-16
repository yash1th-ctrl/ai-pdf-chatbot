# 🚀 Render Deployment Guide for AI PDF Chatbot

## 📋 Prerequisites

Before deploying to Render, ensure you have:

1. **GitHub Repository**: Your code pushed to GitHub
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **Production Environment Variables**: Ready for configuration

## 🔧 Step-by-Step Deployment Process

### Step 1: Prepare Production Convex Deployment

1. **Create Production Convex Deployment**:
   ```bash
   cd ai-pdf-reader
   npx convex deploy --prod
   ```

2. **Note the Production URLs**:
   - Save the production Convex URL (e.g., `https://your-prod-deployment.convex.cloud`)
   - Save the deployment name (e.g., `prod:your-deployment-name`)

### Step 2: Set Up Production Clerk Environment

1. **Go to Clerk Dashboard**: [clerk.com](https://clerk.com)
2. **Create Production Instance** or **Switch to Production**
3. **Get Production Keys**:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_live_`)
   - `CLERK_SECRET_KEY` (starts with `sk_live_`)
4. **Configure Production Domain** in Clerk settings

### Step 3: Deploy to Render

1. **Connect GitHub Repository**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `ai-pdf-reader` folder as root directory

2. **Configure Build Settings**:
   - **Name**: `ai-pdf-chatbot`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `ai-pdf-reader`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

3. **Set Environment Variables**:
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

### Step 4: Configure Domain and SSL

1. **Custom Domain** (Optional):
   - Add your custom domain in Render settings
   - Update Clerk allowed origins

2. **SSL Certificate**:
   - Render provides automatic SSL certificates
   - Ensure HTTPS is enabled

## 🔐 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `NEXT_PUBLIC_GOOGLE_API_KEY` | Google Gemini API key | `AIzaSy...` |
| `CONVEX_DEPLOYMENT` | Production Convex deployment | `prod:your-deployment` |
| `NEXT_PUBLIC_CONVEX_URL` | Production Convex URL | `https://your-deployment.convex.cloud` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | `pk_live_...` |
| `CLERK_SECRET_KEY` | Clerk secret key | `sk_live_...` |

## 🚨 Important Security Notes

1. **Never commit production secrets** to version control
2. **Use production Clerk keys** for live deployment
3. **Set up proper CORS** in your APIs
4. **Enable Clerk production mode** before going live

## 🔍 Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Check build logs for specific errors

2. **Environment Variable Issues**:
   - Ensure all required variables are set
   - Check for typos in variable names
   - Verify Convex and Clerk URLs are correct

3. **Authentication Issues**:
   - Update Clerk allowed origins with your Render URL
   - Ensure production Clerk keys are used
   - Check middleware configuration

4. **Convex Connection Issues**:
   - Verify production Convex deployment is active
   - Check Convex URL format
   - Ensure Convex functions are deployed

## 📞 Support

If you encounter issues:
1. Check Render build logs
2. Review Convex dashboard for errors
3. Verify Clerk configuration
4. Test API endpoints individually

## 🎉 Post-Deployment Checklist

- [ ] Application loads successfully
- [ ] Authentication works (sign in/up)
- [ ] PDF upload functionality works
- [ ] AI chat responses are generated
- [ ] File storage is working
- [ ] All pages are accessible
- [ ] Mobile responsiveness is maintained

Your AI PDF Chatbot should now be live on Render! 🚀
