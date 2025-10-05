@echo off
echo Starting Ride Share Backend Server...
echo.

REM Kill any existing Node.js processes
echo Stopping any existing Node.js processes...
taskkill /f /im node.exe >nul 2>&1

REM Wait a moment for processes to stop
timeout /t 2 /nobreak >nul

REM Start the backend server
echo Starting backend server on port 5001...
cd backend
node server.js

pause

