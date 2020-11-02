#!/bin/bash
cd api
yarn install
cd ../gallery
yarn install
cd ../gallery-server
yarn install
cd ../panel
yarn install
cd ../server
yarn install
cd ../site
yarn install
cd ..

cd server
node node_modules/.bin/tsc
node node_modules/.bin/tsc ../api
node node_modules/.bin/tsc ../gallery
node node_modules/.bin/tsc ../gallery-server
node node_modules/.bin/tsc ../panel
node node_modules/.bin/tsc ../site