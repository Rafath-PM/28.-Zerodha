#!/bin/bash
# Setup Script to install the IPO sync task to crontab

SYNC_SCRIPT="/Users/rafath/Antigravity Projects/28. Zerodha/ipo-tracker-app/run_sync.sh"

if [ ! -f "$SYNC_SCRIPT" ]; then
  echo "Error: Sync script not found at $SYNC_SCRIPT"
  exit 1
fi

# Append cron job (6:00 PM daily)
(crontab -l 2>/dev/null | grep -v "run_sync.sh" ; echo "0 18 * * * \"$SYNC_SCRIPT\"") | crontab -

echo "=========================================================="
echo "✅ Cron job successfully scheduled!"
echo "The IPO Tracker database will update automatically every day at 6:00 PM."
echo "=========================================================="
echo "You can check your current cron jobs with: crontab -l"
