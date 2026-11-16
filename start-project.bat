@echo off
title IntelliDB Launcher
echo ========================================================
echo   Launching IntelliDB (PERN + Google Gemini AI)
echo ========================================================
echo.

echo 1. Starting Backend Server on port 5000...
start cmd /k "title IntelliDB Backend && cd server && npm start"

timeout /t 2 /nobreak >nul

echo 2. Starting Frontend Client on port 5173...
start cmd /k "title IntelliDB Frontend && cd client && npm run dev"

echo.
echo ========================================================
echo   IntelliDB is launching!
echo   Open your browser at: http://localhost:5173
echo ========================================================
pause
