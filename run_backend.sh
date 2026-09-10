#!/bin/bash
echo "========================================================"
echo " AI-Based Early Warning Landslide Monitoring System"
echo " Backend Server - Smart India Hackathon 2026"
echo "========================================================"
cd "$(dirname "$0")/backend"
python3 -m pip install -r requirements.txt
python3 app.py
