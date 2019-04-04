## Ensuring latest versions

!!! MUST LOCK VERSION NUMBERS

`npm install npm-check -g`

`npm-check -u -E`

**Current issues**

-   "@types/react-redux": "7.0.6" cause compile issues
-   Try to remove hack on next upgrade 'as React.ComponentType' in SecureRoute.tsx

## Babel Version Check

Babel: https://github.com/babel/babel-upgrade

`npm install babel-upgrade -g`

`babel-upgrade --write --install`

## Webpack Bundle Analyzer

`npm run build:stats`

`npx webpack-bundle-analyzer stats.json`
