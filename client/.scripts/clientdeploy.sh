#!/bin/bash
set -e
set -x
echo "Deployment started..."

# Pull the latest version of the app
echo "change directory"
ls
cd ..


pwd
echo "change directory"



echo "Installing Dependencies..."
pnpm install

echo "Creating Production Build..."
# For ReactJS VueJS and Nuxt JS
pnpm run build

# npm run export
cd ..

echo "sdcvbdfgdgfcfghfghv"
echo "Deployment Finished!"