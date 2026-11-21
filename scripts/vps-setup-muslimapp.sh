#!/usr/bin/env bash
set -euo pipefail

STAGE_DIR="/home/administrator/muslimapp-staging"
WEB_ROOT="/var/www/muslimapp"

echo "--> Creating web root at $WEB_ROOT..."
mkdir -p "$WEB_ROOT/downloads"
cp -r "$STAGE_DIR"/* "$WEB_ROOT"/
chown -R administrator:www-data "$WEB_ROOT"
chmod -R 755 "$WEB_ROOT"

echo "--> Installing Nginx configuration for nurulislam.mabdullayev.dev..."
cp "$STAGE_DIR/nginx-muslimapp.conf" /etc/nginx/sites-available/muslimapp
ln -sf /etc/nginx/sites-available/muslimapp /etc/nginx/sites-enabled/muslimapp

echo "--> Testing & reloading Nginx..."
nginx -t
systemctl reload nginx

echo "--> Done! Check: https://nurulislam.mabdullayev.dev/version.json"
