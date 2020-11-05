yarn build
rm -rf ../../chrome-extension/background
cp -r ./dist ../../chrome-extension/background
rm -rf ./dist