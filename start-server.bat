@echo off
echo ========================================
echo STARTING SERVER ON PORT 5001
echo ========================================

echo.
echo Installing nodemailer...
cd backend
npm install nodemailer

echo.
echo Creating .env file...
echo EMAIL_USER=your-email@gmail.com > .env
echo EMAIL_PASS=your-app-password >> .env
echo MONGODB_URI=mongodb+srv://sahildewani75_db_user:Sahil%%40123@cluster0.uowncgx.mongodb.net/disaster-prep?retryWrites=true^&w=majority^&appName=Cluster0 >> .env
echo PORT=5001 >> .env

echo.
echo Starting server on port 5001...
npm start

pause
