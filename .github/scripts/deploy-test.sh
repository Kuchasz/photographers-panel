#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deployment process..."

echo "📂 Changing to test directory..."
cd domains/test.pyszstudio.pl/

echo "💾 Backing up existing directories..."
[ -d "public_nodejs/databases" ] && mv public_nodejs/databases databases_backup && echo "  ✓ Backed up databases directory" || true

echo "🧹 Cleaning up existing files..."
rm -rf public_nodejs

echo "📦 Unzipping new package..."
mkdir -p public_nodejs
unzip -o -q ../artifacts/next-standalone.zip -d public_nodejs/

cd public_nodejs

echo "⚙️ Setting up Node.js and pnpm..."
mkdir -p ~/bin && ln -fs /usr/local/bin/node22 ~/bin/node && ln -fs /usr/local/bin/npm22 ~/bin/npm && source $HOME/.bash_profile

echo "ℹ️ Node.js version:"
node --version

echo "⚙️ Copying environment file..."
cp ../../env-vars/test.pyszstudio.pl.env .env

# echo "📥 Installing pnpm..."
# npm install -g pnpm

echo "🔧 Installing dependencies..."
pnpm install --ignore-scripts=false
pnpm rebuild sharp
# npm install sharp@0.32.6

echo "🔄 Restarting web service..."
devil www restart test.pyszstudio.pl

echo "✅ Deployment completed successfully!" 