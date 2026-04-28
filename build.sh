#!/bin/bash
set -e

echo "==> Installing dependencies..."
cd UC-SmartHelp-main

# Clean npm cache and remove lock files to fix optional dependency issues
rm -rf node_modules package-lock.json
npm cache clean --force

# Install dependencies fresh
npm install --production=false

echo "==> Building application..."
npm run build

echo "==> Build complete!"
