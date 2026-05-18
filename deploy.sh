#!/usr/bin/env bash
# SPR Open Data Portal — deploy script for Ubuntu.
# Pulls latest code, rebuilds (including Excel re-conversion), reloads PM2.
#
# Usage: ./deploy.sh
# Triggered by: manual run OR /api/rebuild webhook from WordPress.

set -euo pipefail

APP_DIR="${APP_DIR:-/home/spr/spr-portal}"
LOG_FILE="${LOG_FILE:-$APP_DIR/deploy.log}"
PM2_NAME="${PM2_NAME:-spr-portal}"

cd "$APP_DIR"

echo "━━━ Deploy started: $(date -Iseconds) ━━━" | tee -a "$LOG_FILE"

# 1. Pull latest code
echo "→ git pull" | tee -a "$LOG_FILE"
git fetch --quiet origin
git reset --hard origin/main 2>&1 | tee -a "$LOG_FILE"

# 2. Install deps if package.json/package-lock.json changed
if ! git diff --quiet HEAD@{1} HEAD -- package.json package-lock.json 2>/dev/null; then
  echo "→ npm ci (dependencies changed)" | tee -a "$LOG_FILE"
  npm ci 2>&1 | tee -a "$LOG_FILE"
else
  echo "→ skip npm ci (no dep changes)" | tee -a "$LOG_FILE"
fi

# 3. Build (prebuild auto-converts Excel from WP)
echo "→ npm run build" | tee -a "$LOG_FILE"
npm run build 2>&1 | tee -a "$LOG_FILE"

# 4. Reload PM2 (zero-downtime)
echo "→ pm2 reload $PM2_NAME" | tee -a "$LOG_FILE"
pm2 reload "$PM2_NAME" --update-env 2>&1 | tee -a "$LOG_FILE"

echo "✓ Deploy complete: $(date -Iseconds)" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"
