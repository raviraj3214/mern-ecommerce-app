#!/bin/bash
set -e
echo "Deployment started..."
git update-index --add --chmod=+x deploy.sh

# Pull the latest version of the app
echo "change directory"
ls
cd ..

git fetch
git merge origin/main -m "Merge remote-tracking branch into main"

echo "New changes copied to server !"
pwd
echo "change directory"
cd client
pwd


echo "Installing Dependencies..."
npm install

echo "Creating Production Build..."
# For ReactJS VueJS and Nuxt JS
npm run build

# npm run export
cd ..

echo "sdcvbdfgdgfcfghbcvhbjnmkjnfghv"
echo "Deployment Finished!"