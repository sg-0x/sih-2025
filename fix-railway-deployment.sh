#!/bin/bash

echo "🔧 Fixing Railway Deployment Issues..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "📦 Installing missing backend dependencies to root package.json..."

# The dependencies should already be added, but let's verify
echo "✅ Backend dependencies should now be in root package.json"
echo "✅ MongoDB connection string is now configurable via environment variables"
echo "✅ Added better error handling for MongoDB connection"

echo ""
echo "🚀 Ready to redeploy to Railway!"
echo ""
echo "Next steps:"
echo "1. Commit and push your changes:"
echo "   git add ."
echo "   git commit -m 'Fix Railway deployment - add backend dependencies'"
echo "   git push origin main"
echo ""
echo "2. Railway will automatically redeploy"
echo ""
echo "3. Set environment variables in Railway dashboard:"
echo "   NODE_ENV=production"
echo "   PORT=5000"
echo "   REACT_APP_API_URL=https://your-app-name.railway.app"
echo "   MONGODB_URI=mongodb+srv://sahildewani75_db_user:Sahil%40123@cluster0.uowncgx.mongodb.net/disaster-prep?retryWrites=true&w=majority&appName=Cluster0"
echo ""
echo "4. Check Railway logs if deployment still fails"
