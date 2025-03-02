#!/bin/bash

# Script to migrate from npm to pnpm

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "pnpm is not installed. Installing pnpm..."
    npm install -g pnpm
fi

# Remove node_modules and lockfiles
echo "Cleaning up node_modules and lockfiles..."
rm -rf node_modules
find ./packages -name "node_modules" -type d -exec rm -rf {} +
find ./public_nodejs -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null

# Update workspace package.json files to use workspace: protocol
echo "Updating workspace package references in package.json files..."
find ./packages -name "package.json" -type f -exec sed -i '' 's/"@pp\/\([^"]*\)": "\*"/"@pp\/\1": "workspace:\*"/g' {} \;
find ./public_nodejs -name "package.json" -type f -exec sed -i '' 's/"@pp\/\([^"]*\)": "\*"/"@pp\/\1": "workspace:\*"/g' {} \; 2>/dev/null

# Install dependencies with pnpm
echo "Installing dependencies with pnpm..."
pnpm install

echo "Migration to pnpm completed successfully!" 