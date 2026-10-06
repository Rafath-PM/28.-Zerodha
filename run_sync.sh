#!/bin/bash
# Sync script for IPO Tracker Application
# Changes directory to project folder and runs the python scraper to update ipo_data.json

PROJECT_DIR="/Users/rafath/Antigravity Projects/28. Zerodha/ipo-tracker-app"

cd "$PROJECT_DIR" || exit 1
/usr/bin/python3 scrape_ipos.py >> sync.log 2>&1
cp ipo_data.json www/ipo_data.json 2>/dev/null
echo "Sync completed at $(date)" >> sync.log
