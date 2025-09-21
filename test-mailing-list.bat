@echo off
echo ========================================
echo TESTING MAILING LIST FUNCTIONALITY
echo ========================================

echo.
echo 1. Creating mailing_list collection...
cd backend
node create-mailing-list.js

echo.
echo 2. Testing subscription API...
curl -X POST http://localhost:5000/api/mailing-list/subscribe -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\"}"

echo.
echo 3. Checking subscribers...
curl -X GET http://localhost:5000/api/mailing-list/subscribers

echo.
echo Test completed! Check your MongoDB Atlas for the mailing_list collection.
pause
