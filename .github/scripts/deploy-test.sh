#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deployment process..."

echo "📂 Changing to test directory..."
cd domains/test.pyszstudio.pl/

echo "💾 Backing up existing directories..."
[ -d "public_nodejs/databases" ] && mv public_nodejs/databases databases_backup && echo "  ✓ Backed up databases directory" || true

# Backup uploads directory
if [ -d "public_nodejs/public/uploads" ]; then
  echo "💾 Backing up uploads directory..."
  rm -rf ../backups/uploads_backup
  mkdir -p ../backups/uploads_backup
  cp -r public_nodejs/public/uploads/* ../backups/uploads_backup/
  echo "  ✓ Backed up uploads directory"
fi

echo "🧹 Cleaning up existing files..."
rm -rf public_nodejs

echo "📦 Unzipping new package..."
mkdir -p public_nodejs
unzip -o -q ../artifacts/next-standalone.zip -d public_nodejs/

# Restore uploads backup
if [ -d "../backups/uploads_backup" ]; then
  echo "♻️ Restoring uploads directory..."
  mkdir -p public_nodejs/public/uploads
  cp -r ../backups/uploads_backup/* public_nodejs/public/uploads/
  echo "  ✓ Restored uploads directory"
fi

cd public_nodejs

echo "⚙️ Setting up Node.js and pnpm..."
mkdir -p ~/bin && ln -fs /usr/local/bin/node22 ~/bin/node && ln -fs /usr/local/bin/npm22 ~/bin/npm && source $HOME/.bash_profile

echo "ℹ️ Node.js version:"
node --version

echo "⚙️ Copying environment file..."
cp ../../env-vars/test.pyszstudio.pl.env .env

echo "🔧 Installing dependencies..."
pnpm install
npm install --cpu=wasm32 sharp

echo "🔄 Restarting web service..."
devil www restart test.pyszstudio.pl

echo "✅ Test deployment completed successfully!" 