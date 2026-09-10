@echo off
echo ========================================================
echo  AI-Based Early Warning Landslide Monitoring System
echo  Backend Server - Smart India Hackathon 2026
echo ========================================================
echo.
cd /d %~dp0backend
python -m pip install -r requirements.txt
echo Starting Flask REST API on http://127.0.0.1:5000 ...
python app.py
pause
