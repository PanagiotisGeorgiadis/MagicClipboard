# Setup script for preparing everything after a fresh clone of the repo
pushd ./extension-views/background/
yarn && yarn build-prod
popd

pushd ./extension-views/content_scripts/
yarn && yarn build-prod
popd

pushd ./extension-views/popup/
yarn && yarn build-prod
popd