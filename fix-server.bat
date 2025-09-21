@echo off
echo ========================================
echo FIXING SERVER ISSUES
echo ========================================

echo.
echo 1. Killing processes on port 5000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do (
    echo Killing process %%a
    taskkill /f /pid %%a 2>nul
)

echo.
echo 2. Installing nodemailer...
cd backend
npm install nodemailer

echo.
echo 3. Creating .env file...
echo # Email Configuration for Mailing List > .env
echo EMAIL_USER=your-email@gmail.com >> .env
echo EMAIL_PASS=your-app-password >> .env
echo. >> .env
echo # MongoDB Configuration >> .env
echo MONGODB_URI=mongodb+srv://sahildewani75_db_user:Sahil%%40123@cluster0.uowncgx.mongodb.net/disaster-prep?retryWrites=true^&w=majority^&appName=Cluster0 >> .env
echo. >> .env
echo # Server Configuration >> .env
echo PORT=5000 >> .env

echo.
echo 4. Starting server...
npm start

pause
