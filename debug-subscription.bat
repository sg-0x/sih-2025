@echo off
echo ========================================
echo DEBUGGING SUBSCRIPTION ISSUE
echo ========================================

echo.
echo 1. Checking if server is running on port 5001...
netstat -ano | findstr :5001
if %errorlevel% neq 0 (
    echo ❌ Server is NOT running on port 5001
    echo Starting server...
    cd backend
    start /B npm start
    echo Waiting for server to start...
    timeout /t 5 /nobreak >nul
) else (
    echo ✅ Server is running on port 5001
)

echo.
echo 2. Testing subscription API directly...
curl -X POST http://localhost:5000/api/mailing-list/subscribe -H "Content-Type: application/json" -d "{\"email\":\"debug@test.com\"}"

echo.
echo 3. Testing with a different email...
curl -X POST http://localhost:5000/api/mailing-list/subscribe -H "Content-Type: application/json" -d "{\"email\":\"test2@example.com\"}"

echo.
echo 4. Checking subscribers...
curl -X GET http://localhost:5000/api/mailing-list/subscribers

echo.
echo 5. Checking server logs...
echo Look at the server console for any error messages.

echo.
echo ========================================
echo DEBUGGING COMPLETE
echo ========================================
echo.
echo If the API calls work but the frontend doesn't:
echo 1. Check browser console for errors
echo 2. Make sure frontend is running on port 3000
echo 3. Check if there are CORS issues
echo.
pause
