#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deployment process..."

echo "📂 Changing to test directory..."
cd domains/test.pyszstudio.pl/

echo "💾 Backing up existing directories..."
[ -d "public_nodejs/databases" ] && mv public_nodejs/databases databases_backup && echo "  ✓ Backed up databases directory" || true

echo "🧹 Cleaning up existing files..."
rm -rf public_nodejs node_modules pnpm-lock.yaml package.json

echo "📦 Unzipping new package..."
mkdir -p public_nodejs
unzip -o -q ../artifacts/next-standalone.zip -d public_nodejs/

echo "ℹ️ Node.js version:"
node --version

echo "⚙️ Copying environment file..."
cp ../env-vars/test.pyszstudio.pl.env .env

echo "📥 Installing pnpm..."
npm install -g pnpm

echo "🔧 Installing dependencies..."
pnpm install

echo "📁 Setting up application..."
rm -rf public_nodejs
cp -r * public_nodejs/

echo "🔄 Restarting web service..."
devil www restart test.pyszstudio.pl

echo "✅ Deployment completed successfully!" 