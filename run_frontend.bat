@echo off
echo ========================================================
echo  AI-Based Early Warning Landslide Monitoring System
echo  Frontend Dashboard - Smart India Hackathon 2026
echo ========================================================
echo.
cd /d %~dp0frontend
echo Launching React + Vite Dashboard on http://localhost:5173 ...
npm run dev
pause
