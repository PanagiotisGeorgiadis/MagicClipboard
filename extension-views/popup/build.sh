yarn build
rm -rf ../../chrome-extension/popup
cp -r ./dist ../../chrome-extension/popup
rm -rf ./dist