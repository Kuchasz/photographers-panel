#!/bin/bash

# Exit on error
set -e

cd domains/staging.pyszstudio.pl/

# Backup existing directories if they exist
[ -d "public_nodejs/public/blogs" ] && mv public_nodejs/public/blogs images_backup || true
[ -d "public_nodejs/databases" ] && mv public_nodejs/databases databases_backup || true

# Clean up existing files
rm -rf public_nodejs packages node_modules package-lock.json package.json

# Unzip new package
unzip -o -q ../artifacts/package.zip

# Move server dist files
mv -f packages/server/dist/* packages/server/

# Create public directory and restore backups
mkdir -p packages/server/public
[ -d "images_backup" ] && mv -f images_backup packages/server/public/blogs || true
[ -d "databases_backup" ] && mv -f databases_backup packages/server/databases || true

# Remove problematic node-gyp
rm -rf node_modules/.bin/node-gyp

# Install dependencies
npm install -w @pp/server sharp@0.33.4
npm install -w @pp/server sqlite3@5.1.4
npm install -w @pp/gallery sqlite3@5.1.4

# Copy environment file
cp ../env-vars/staging.pyszstudio.pl.env packages/server/.env

# Move server to final location
mv -f packages/server public_nodejs

# Restart the web service
devil www restart staging.pyszstudio.pl 