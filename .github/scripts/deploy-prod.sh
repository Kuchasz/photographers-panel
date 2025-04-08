#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting production deployment process..."

echo "📂 Changing to production directory..."
cd domains/pyszstudio.pl/

echo "💾 Backing up existing directories..."
[ -d "public_nodejs/databases" ] && mv public_nodejs/databases databases_backup && echo "  ✓ Backed up databases directory" || true

echo "🧹 Cleaning up existing files..."
rm -rf public_nodejs packages node_modules pnpm-lock.yaml package.json

echo "📦 Unzipping new package..."
unzip -o -q ../artifacts/package.zip

echo "ℹ️ Node.js version:"
node --version

echo "⚙️ Copying environment file..."
cp ../env-vars/pyszstudio.pl.env .env

echo "📥 Installing pnpm..."
npm install -g pnpm

echo "🔧 Installing dependencies..."
pnpm install

echo "📁 Setting up web package..."
mkdir -p public_nodejs/public
cp -r packages/web/dist/* public_nodejs/public/

echo "🔄 Restarting web service..."
devil www restart pyszstudio.pl

echo "✅ Production deployment completed successfully!"
