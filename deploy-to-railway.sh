#!/bin/bash

# Railway Deployment Script for Disaster Preparedness App

echo "🚀 Starting Railway deployment process..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Check if user is logged in
if ! railway whoami &> /dev/null; then
    echo "🔐 Please login to Railway:"
    railway login
fi

# Build the project locally first to check for errors
echo "🔨 Building project locally..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

echo "✅ Build successful!"

# Initialize Railway project if not already initialized
if [ ! -f "railway.json" ]; then
    echo "📋 Initializing Railway project..."
    railway init
fi

# Deploy to Railway
echo "🚀 Deploying to Railway..."
railway up

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your app should be available at: https://$(railway domain)"
    echo ""
    echo "📝 Next steps:"
    echo "1. Set up environment variables in Railway dashboard"
    echo "2. Configure your MongoDB Atlas connection"
    echo "3. Test your deployed application"
else
    echo "❌ Deployment failed. Check the logs above."
    exit 1
fi
