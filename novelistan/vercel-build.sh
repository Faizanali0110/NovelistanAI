#!/bin/bash
# Build script for Vercel deployment

# Fix for Rollup module issue on Linux
export ROLLUP_SKIP_NODEJS_NATIVE=1

# Clean install to avoid dependency issues
rm -rf node_modules
rm -f package-lock.json

# Install dependencies
npm install

# Build the application
npm run build
