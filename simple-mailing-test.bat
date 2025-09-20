@echo off
echo ========================================
echo SIMPLE MAILING LIST TEST
echo ========================================

echo.
echo 1. Starting server on port 5001...
cd backend
start /B npm start

echo.
echo 2. Waiting for server to start...
timeout /t 5 /nobreak >nul

echo.
echo 3. Testing subscription API...
curl -X POST http://localhost:5001/api/mailing-list/subscribe -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\"}"

echo.
echo 4. Testing with another email...
curl -X POST http://localhost:5001/api/mailing-list/subscribe -H "Content-Type: application/json" -d "{\"email\":\"user@test.com\"}"

echo.
echo 5. Checking subscribers...
curl -X GET http://localhost:5001/api/mailing-list/subscribers

echo.
echo Test completed! Check the server console for MongoDB connection status.
echo If MongoDB fails, emails will be stored in memory as fallback.
pause
