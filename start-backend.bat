@echo off
echo Starting Ride Share Backend...
cd backend
echo Installing dependencies if needed...
call npm install
echo Starting backend server...
call npm run dev
pause




