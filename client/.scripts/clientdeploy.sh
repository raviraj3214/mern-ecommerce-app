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
npm install

echo "Creating Production Build..."
# For ReactJS VueJS and Nuxt JS
npm run build

# npm run export
cd ..

echo "sdcvbdfgdgfcfghbcvdfcgvhbjhbjnmkjnfghv"
echo "Deployment Finished!"