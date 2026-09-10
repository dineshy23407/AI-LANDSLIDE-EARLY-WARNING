@echo off
echo ========================================================
echo  AI Landslide Early Warning System - SIH 2026
echo  Launching Full Stack Prototype (Backend + Frontend)
echo ========================================================
echo.

echo [1/2] Starting Flask REST API on http://127.0.0.1:5000 ...
start "Landslide Early Warning Backend" cmd /k "cd /d %~dp0backend && python app.py"

timeout /t 3 /nobreak >nul

echo [2/2] Starting React + Vite Dashboard on http://localhost:5173 ...
start "Landslide Early Warning Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================================
echo  Prototype is now running!
echo  - Frontend Dashboard: http://localhost:5173
echo  - Backend API:        http://127.0.0.1:5000/api/health
echo ========================================================
