#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deployment process..."

echo "📂 Changing to staging directory..."
cd domains/staging.pyszstudio.pl/

echo "💾 Backing up existing directories..."
[ -d "public_nodejs/databases" ] && mv public_nodejs/databases databases_backup && echo "  ✓ Backed up databases directory" || true

echo "🧹 Cleaning up existing files..."
rm -rf public_nodejs packages node_modules package-lock.json package.json

echo "📦 Unzipping new package..."
unzip -o -q ../artifacts/package.zip

echo "ℹ️ Node.js version:"
node --version

echo "⚙️ Copying environment file..."
cp ../env-vars/staging.pyszstudio.pl.env .env

echo "🔧 Installing dependencies..."
npm install

echo "📁 Setting up web package..."
mkdir -p public_nodejs/public
cp -r packages/web/dist/* public_nodejs/public/

echo "🔄 Restarting web service..."
devil www restart staging.pyszstudio.pl

echo "✅ Deployment completed successfully!" 