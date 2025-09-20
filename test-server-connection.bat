@echo off
echo ========================================
echo TESTING SERVER CONNECTION
echo ========================================

echo.
echo 1. Testing if server is accessible...
curl -X GET http://localhost:5001/api/mailing-list/subscribers

echo.
echo 2. If the above failed, starting server...
cd backend
echo Starting server on port 5001...
start /B npm start

echo.
echo 3. Waiting for server to start...
timeout /t 8 /nobreak >nul

echo.
echo 4. Testing subscription again...
curl -X POST http://localhost:5001/api/mailing-list/subscribe -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\"}"

echo.
echo 5. Testing with another email...
curl -X POST http://localhost:5001/api/mailing-list/subscribe -H "Content-Type: application/json" -d "{\"email\":\"user@test.com\"}"

echo.
echo 6. Checking all subscribers...
curl -X GET http://localhost:5001/api/mailing-list/subscribers

echo.
echo ========================================
echo If you see JSON responses above, the server is working.
echo If you see connection errors, the server needs to be started.
echo ========================================
pause
