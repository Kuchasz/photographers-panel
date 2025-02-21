#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deployment process..."

echo "📂 Changing to staging directory..."
cd domains/staging.pyszstudio.pl/

echo "💾 Backing up existing directories..."
[ -d "public_nodejs/public/blogs" ] && mv public_nodejs/public/blogs images_backup && echo "  ✓ Backed up blogs directory" || true
[ -d "public_nodejs/databases" ] && mv public_nodejs/databases databases_backup && echo "  ✓ Backed up databases directory" || true

echo "🧹 Cleaning up existing files..."
rm -rf public_nodejs packages node_modules package-lock.json package.json

echo "📦 Unzipping new package..."
unzip -o -q ../artifacts/package.zip

echo "ℹ️ Node.js version:"
node --version

echo "📝 Moving server dist files..."
mv -f packages/server/dist/* packages/server/

echo "📁 Creating public directory and restoring backups..."
mkdir -p packages/server/public
[ -d "images_backup" ] && mv -f images_backup packages/server/public/blogs && echo "  ✓ Restored blogs directory" || true
[ -d "databases_backup" ] && mv -f databases_backup packages/server/databases && echo "  ✓ Restored databases directory" || true

echo "🔧 Removing problematic node-gyp..."
rm -rf node_modules/.bin/node-gyp

echo "⚙️ Copying environment file..."
cp ../env-vars/staging.pyszstudio.pl.env packages/server/.env

echo "📦 Moving server to final location..."
mv -f packages/server public_nodejs

echo "📥 Installing dependencies..."
echo "  ⚙️ Installing sharp..."
npm install -w @pp/server sharp@0.33.4
echo "  ⚙️ Installing sqlite3 for server..."
npm install -w @pp/server sqlite3@5.1.4
echo "  ⚙️ Installing sqlite3 for gallery..."
npm install -w @pp/gallery sqlite3@5.1.4

echo "🔄 Restarting web service..."
devil www restart staging.pyszstudio.pl

echo "✅ Deployment completed successfully!" 