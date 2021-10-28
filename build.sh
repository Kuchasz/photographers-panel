#!/bin/bash
# cd api
# yarn install
# cd ../gallery
# yarn install
# cd ../gallery-server
# yarn install
# cd ../panel
# yarn install
# cd ../server
# yarn install
# cd ../site
# yarn install
# cd ..

# cd api
# yarn run build
# cd ../utils
# yarn run build
cd site
# rimraf dist
yarn run build:prod
cd ../panel
# rimraf dist
yarn run build:prod
cd ../gallery-server
# rimraf dist
yarn run build
cd ../gallery
yarn run build

# cd ../api
# yarn install
# cd ../gallery
# yarn install
# cd ../gallery-server
# yarn install
# cd ../panel
# yarn install
cd ../server
yarn install
# cd ../site
# yarn install
# cd ..


# cd server
# echo "BUILD: server"
# node node_modules/.bin/tsc --rootDir . --outDir dist
# echo "BUILD: api"
# node node_modules/.bin/tsc --rootDir ../api --outDir ../api/dist
# # node node_modules/.bin/tsc ../gallery
# echo "BUILD: gallery-server"
# node node_modules/.bin/tsc --rootDir ../gallery-server --outDir ../gallery-server/dist
# node node_modules/.bin/tsc ../panel
# node node_modules/.bin/tsc ../site