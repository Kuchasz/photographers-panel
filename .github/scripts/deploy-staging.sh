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

echo "⚙️ Copying environment file..."
cp ../env-vars/staging.pyszstudio.pl.env packages/server/.env

echo "📦 Moving server to final location..."
mv -f packages/server public_nodejs

echo "🔧 Removing problematic node-gyp..."
rm -rf node_modules/.bin/node-gyp

echo "📥 Installing dependencies..."
echo "  ⚙️ Installing node-addon-api..."
npm install -w @pp/server node-addon-api@8.3.1
npm install -w @pp/gallery node-addon-api@8.3.1
echo "  ⚙️ Installing node-gyp..."
npm install -w @pp/server node-gyp@11.1.0
npm install -w @pp/gallery node-gyp@11.1.0
echo "  ⚙️ Installing sharp..."
npm install -w @pp/server sharp@0.33.4
echo "  ⚙️ Installing sqlite3..."
npm install -w @pp/server sqlite3@5.1.4
npm install -w @pp/gallery sqlite3@5.1.4

echo "🔄 Restarting web service..."
devil www restart staging.pyszstudio.pl

echo "✅ Deployment completed successfully!" 