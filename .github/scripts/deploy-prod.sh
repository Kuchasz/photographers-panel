#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting production deployment process..."

echo "📂 Changing to production directory..."
cd domains/pyszstudio.pl/

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

echo "⚙️ Copying environment file..."
cp ../env-vars/pyszstudio.pl.env packages/server/.env

echo "📦 Moving server to final location..."
mv -f packages/server public_nodejs

echo "🔧 Removing old native packages..."
rm -rf node_modules/.bin/node-pre-gyp node_modules/.bin/node-gyp node_modules/sharp/ node_modules/sqlite3/

echo "🔧 Installing new native packages..."
npm install sharp@0.32.6 sqlite3@5.1.4

echo "🔄 Restarting web service..."
devil www restart pyszstudio.pl

echo "✅ Production deployment completed successfully!"
