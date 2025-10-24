# Deployment Guide

This guide will help you deploy the Flight Booking System with backend on Render and frontend on Vercel.

## Prerequisites

- GitHub account with this repository pushed
- Render account (https://render.com)
- Vercel account (https://vercel.com)
- MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)
- OpenAI API key (https://platform.openai.com)

---

## Part 1: Setup MongoDB Atlas

1. **Create MongoDB Cluster**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up or log in
   - Click "Build a Database"
   - Choose "M0 Free" tier
   - Select your preferred region
   - Click "Create"

2. **Configure Database Access**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and password (save these!)
   - Set user privileges to "Read and write to any database"
   - Click "Add User"

3. **Configure Network Access**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

4. **Get Connection String**
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `flight-booking`
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/flight-booking?retryWrites=true&w=majority`

5. **Seed the Database**
   ```bash
   # In your local terminal
   cd database
   npm install

   # Create .env file with your MongoDB URI
   echo "MONGODB_URI=your_mongodb_connection_string" > .env

   # Run seed scripts
   npm run seed:all
   ```

---

## Part 2: Deploy Backend to Render

### Option A: Using Render Dashboard (Recommended)

1. **Create Web Service**
   - Go to https://dashboard.render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repository

2. **Configure Service**
   - **Name**: `flight-booking-backend`
   - **Region**: Choose closest to you
   - **Branch**: `master`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

3. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable"

   Add these variables:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=<your_mongodb_atlas_connection_string>
   JWT_SECRET=<generate_random_string_here>
   OPENAI_API_KEY=<your_openai_api_key>
   ```

   **Generate JWT_SECRET**: Use a random string generator or run:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Once deployed, you'll get a URL like: `https://flight-booking-backend.onrender.com`
   - **Save this URL!** You'll need it for frontend

5. **Test Backend**
   Visit: `https://your-backend-url.onrender.com/api/chat/status`

   Should return:
   ```json
   {
     "success": true,
     "agents": {...}
   }
   ```

### Option B: Using render.yaml (Alternative)

1. Push the `render.yaml` file to your repository
2. In Render dashboard: "New +" → "Blueprint"
3. Select your repository
4. Render will detect `render.yaml` and configure automatically
5. Add environment variables in the dashboard

---

## Part 3: Deploy Frontend to Vercel

1. **Deploy to Vercel**
   - Go to https://vercel.com
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Select your repository

2. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

3. **Add Environment Variables**
   Click "Environment Variables"

   Add:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
   ```

   **Important**: Replace `your-backend-url` with your actual Render backend URL!

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment (2-5 minutes)
   - You'll get a URL like: `https://your-project.vercel.app`

5. **Test Frontend**
   - Visit your Vercel URL
   - Try registering a new account
   - Try logging in
   - Test the chat interface

---

## Part 4: Update Backend CORS

After frontend is deployed, update backend CORS to allow your Vercel domain:

1. Go to Render dashboard → Your backend service
2. Go to "Environment" tab
3. Add new environment variable:
   ```
   FRONTEND_URL=https://your-project.vercel.app
   ```
4. The backend code already handles this in `src/server.ts`

---

## Part 5: Verify Full Stack

1. **Test Authentication**
   - Register: `https://your-frontend.vercel.app/register`
   - Login: `https://your-frontend.vercel.app/login`

2. **Test Chat**
   - Go to: `https://your-frontend.vercel.app/chat`
   - Try: "Book a flight to New York"
   - Try: "Check my booking status"

3. **Test Bookings**
   - Go to: `https://your-frontend.vercel.app/bookings`
   - Verify your bookings appear

---

## Troubleshooting

### Backend Issues

**Build fails on Render:**
- Check build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript compiles locally: `cd backend && npm run build`

**Backend crashes:**
- Check logs in Render dashboard
- Verify all environment variables are set
- Check MongoDB connection string is correct

**CORS errors:**
- Verify `FRONTEND_URL` environment variable
- Check CORS configuration in `backend/src/server.ts`

### Frontend Issues

**Build fails on Vercel:**
- Check build logs in Vercel dashboard
- Verify Next.js builds locally: `cd frontend && npm run build`

**API calls fail:**
- Check `NEXT_PUBLIC_API_URL` is set correctly
- Verify backend is running
- Check browser console for errors

**Authentication doesn't work:**
- Check JWT_SECRET is set on backend
- Verify MongoDB is accessible
- Check browser localStorage for token

### Database Issues

**Can't connect to MongoDB:**
- Verify IP whitelist includes 0.0.0.0/0
- Check connection string format
- Verify username/password are correct
- Ensure database user has correct permissions

**Seed data missing:**
- Run seed scripts locally first
- Check MongoDB Atlas → Collections
- Verify `flight-booking` database exists

---

## Environment Variables Summary

### Backend (Render)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/flight-booking
JWT_SECRET=your_random_secret_here
OPENAI_API_KEY=sk-...
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (Vercel)
```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

---

## Post-Deployment

### Update README URLs
Update your main README.md with:
- Live demo URL (Vercel frontend)
- API documentation URL (Render backend)

### Monitor Logs
- **Render**: Dashboard → Your Service → Logs
- **Vercel**: Dashboard → Your Project → Deployments → View Logs

### Set Up Custom Domains (Optional)
- **Vercel**: Settings → Domains
- **Render**: Settings → Custom Domain

---

## Costs

- **MongoDB Atlas**: Free (M0 tier)
- **Render**: Free tier (goes to sleep after inactivity)
- **Vercel**: Free tier (hobby use)
- **OpenAI**: Pay per use (API calls)

**Note**: Render free tier services sleep after 15 minutes of inactivity. First request after sleep takes 30-60 seconds to wake up.

---

## Success Checklist

- [ ] MongoDB Atlas cluster created and seeded
- [ ] Backend deployed to Render
- [ ] Backend environment variables configured
- [ ] Backend API responding at `/api/chat/status`
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variable set
- [ ] Can register new user
- [ ] Can login
- [ ] Can send chat messages
- [ ] Can view bookings
- [ ] CORS configured correctly

---

🎉 **Congratulations!** Your flight booking system is now live!

- Frontend: https://your-project.vercel.app
- Backend: https://your-backend.onrender.com
