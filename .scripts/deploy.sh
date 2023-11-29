#!/bin/bash
set -e
chmod +x "$(basename "$0")"
echo "Deployment started..."

# Pull the latest version of the app
echo "change directory"
ls
cd ..

git fetch
git merge origin/main -m "Merge remote-tracking branch into main"

echo "New changes copied to server !"
ls
echo "change directory"
cd client

echo "Installing Dependencies..."
pnpm install

echo "Creating Production Build..."
# For ReactJS VueJS and Nuxt JS
pnpm run build

# For NextJS
# npm run export
cd ..


echo "Deployment Finished!"