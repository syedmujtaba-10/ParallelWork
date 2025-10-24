# Deployment Guide - Flight Booking System

## Backend Deployment to Render

### Issue Fixed
The original render.yaml had an incorrect configuration for the monorepo structure. The build was failing because:
- `dist/` folder was excluded from git (as it should be)
- Render wasn't setting the correct root directory for the backend
- The build command wasn't running properly

### Solution Applied
Updated `render.yaml` with:
```yaml
rootDir: backend  # Set backend as the root directory for this service
buildCommand: npm install && npm run build
startCommand: npm start
healthCheckPath: /health
```

### Environment Variables Required

You need to configure these in Render Dashboard:

1. **MONGODB_URI** - Your MongoDB Atlas connection string
2. **JWT_SECRET** - A secure random string
3. **OPENAI_API_KEY** - Your OpenAI API key  
4. **CORS_ORIGIN** - Your Vercel frontend URL

### Deployment Steps

1. **Push changes to GitHub:**
   ```bash
   git add render.yaml DEPLOYMENT.md
   git commit -m "fix: Update render.yaml for monorepo deployment"
   git push origin master
   ```

2. **In Render Dashboard:**
   - Go to your service settings
   - Verify Root Directory is set to: `backend`
   - Or create new service with render.yaml blueprint

3. **Set Environment Variables in Render**

4. **Deploy and monitor logs**

### Verifying Deployment

Test health endpoint:
```bash
curl https://your-backend-url.onrender.com/health
```

---

See full guide in project documentation.
