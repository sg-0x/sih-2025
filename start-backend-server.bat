@echo off
echo ========================================
echo STARTING BACKEND SERVER
echo ========================================

echo.
echo 1. Going to backend directory...
cd backend

echo.
echo 2. Creating .env file...
echo MONGODB_URI=mongodb+srv://sahildewani75_db_user:Sahil%%40123@cluster0.uowncgx.mongodb.net/disaster-prep?retryWrites=true^&w=majority^&appName=Cluster0 > .env
echo PORT=5001 >> .env

echo.
echo 3. Starting server on port 5001...
echo The server will start and you should see "Server running on http://localhost:5000"
echo.
npm start

pause
