#!/bin/bash
set -e
set -x
echo "Deployment started..."

# Pull the latest version of the app
echo "change directory"
ls
cd ..

git fetch
git merge origin/main -m "Merge remote-tracking branch into main"

echo "New changes copied to server !"


echo "sdcvbdfgdgfcfghbcvdfcgvhbjhbjnmkjnfghv"
echo "Deployment Finished!"