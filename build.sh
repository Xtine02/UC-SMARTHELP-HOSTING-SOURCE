#!/bin/bash
set -e

echo "==> Entering UC-SmartHelp-main directory..."
cd UC-SmartHelp-main

echo "==> Cleaning npm cache..."
rm -rf node_modules
rm -f package-lock.json
npm cache clean --force

echo "==> Installing dependencies (skipping postinstall)..."
npm install --production=false --ignore-scripts

echo "==> Running build..."
npm run build

echo "==> Build complete!"
