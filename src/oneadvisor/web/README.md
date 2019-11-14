## Ensuring latest versions

!!! MUST LOCK VERSION NUMBERS

`npm install npm-check -g`

`npm-check -u -E`

**Current upgrade issues**

Upgrade to typescript 3.6 causing type conflicts with node types

## Babel Version Check

Babel: https://github.com/babel/babel-upgrade

`npm install babel-upgrade -g`

`babel-upgrade --write --install`

## Webpack Bundle Analyzer

`npm run build:stats`

`npx webpack-bundle-analyzer stats.json`
