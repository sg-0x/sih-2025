@echo off
echo ========================================
echo SETTING UP DATABASE AND STARTING SERVER
echo ========================================

echo.
echo 1. Creating .env file...
cd backend
echo MONGODB_URI=mongodb+srv://sahildewani75_db_user:Sahil%%40123@cluster0.uowncgx.mongodb.net/disaster-prep?retryWrites=true^&w=majority^&appName=Cluster0 > .env
echo PORT=5001 >> .env

echo.
echo 2. Testing MongoDB connection and creating database...
node test-mongodb.js

echo.
echo 3. Starting server on port 5001...
npm start

pause
