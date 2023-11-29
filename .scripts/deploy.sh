#!/bin/bash
set -e

echo "Deployment started..."

# Pull the latest version of the app
echo "change directory"
cd ..

git pull origin main
echo "New changes copied to server !"

echo "change directory"
cd client

echo "Installing Dependencies..."
pnpm install --yes

echo "Creating Production Build..."
# For ReactJS VueJS and Nuxt JS
pnpm run build

# For NextJS
# npm run export

echo "Deployment Finished!"