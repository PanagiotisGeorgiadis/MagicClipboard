yarn build
rm -rf ../../chrome-extension/content_scripts
cp -r ./dist ../../chrome-extension/content_scripts
rm -rf ./dist
