#!/bin/bash
set -e

echo "==> Installing dependencies..."
cd UC-SmartHelp-main
npm install

echo "==> Building application..."
npm run build

echo "==> Build complete!"
