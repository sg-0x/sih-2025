# Railway Deployment Guide

## Prerequisites
1. GitHub account with your code pushed to a repository
2. Railway account (sign up at https://railway.app)
3. MongoDB Atlas account (for database)

## Step 1: Prepare Your Repository
1. Make sure all your code is pushed to GitHub
2. Ensure the `railway.toml` file is in your root directory
3. Verify your `package.json` has the `start:production` script

## Step 2: Deploy to Railway

### Option A: Connect GitHub Repository
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway will automatically detect it's a Node.js app

### Option B: Deploy from CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

## Step 3: Configure Environment Variables

In your Railway project dashboard, go to Variables and add:

```
NODE_ENV=production
PORT=5000
REACT_APP_API_URL=https://your-app-name.railway.app
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/disaster-prep?retryWrites=true&w=majority
```

**Important**: Replace the MongoDB URI with your actual MongoDB Atlas connection string.

## Step 4: Configure Custom Domain (Optional)

1. In Railway dashboard, go to Settings
2. Add a custom domain
3. Update your `REACT_APP_API_URL` environment variable to match

## Step 5: Test Your Deployment

1. Visit your Railway app URL
2. Test the main functionality:
   - User registration/login
   - Creating alerts
   - Drill announcements
   - File uploads
   - Real-time notifications

## Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check that all dependencies are in `package.json`
   - Ensure `npm run build` works locally

2. **API Connection Issues**
   - Verify `REACT_APP_API_URL` is set correctly
   - Check CORS configuration in backend

3. **Database Connection Issues**
   - Verify MongoDB URI is correct
   - Check MongoDB Atlas network access settings

4. **File Upload Issues**
   - Railway has ephemeral file system
   - Consider using cloud storage (AWS S3, Cloudinary) for production

### Logs and Debugging:
```bash
# View logs
railway logs

# Connect to your deployment
railway shell
```

## Production Considerations

1. **File Storage**: Consider migrating file uploads to cloud storage
2. **Database**: MongoDB Atlas is already cloud-hosted ✓
3. **SSL**: Railway provides SSL certificates automatically ✓
4. **Scaling**: Railway can auto-scale based on traffic
5. **Monitoring**: Use Railway's built-in metrics

## Cost Estimation

- Railway: $5/month for hobby plan (includes 1GB RAM, 1GB disk)
- MongoDB Atlas: Free tier available (512MB storage)
- Total: ~$5/month for basic deployment

## Next Steps

1. Set up monitoring and alerts
2. Configure backup strategies
3. Set up CI/CD pipeline
4. Consider implementing caching
5. Add rate limiting for API endpoints
