## Getting Started

```js
yarn apply
yarn
yarn postinstall_dll
cp .env.example .env

yarn start
// or: Execute backend.ts without compiling. backend process does not have hotload, devtools:
yarn cross-env BACKEND_SUBPROCESS=true yarn start

yarn yarn build
// enable webpack-bundle-analyzer
yarn cross-env OPEN_ANALYZER=true yarn build

// no packaging after build, quickly execute and debug [backend,preload,renderer].prod.js:
yarn cross-env DEBUG_PROD=true yarn build
yarn cross-env NODE_ENV=production DEBUG_PROD=true yarn start

// packaging https://electron-react-boilerplate.js.org/docs/packaging
yarn package --all
yarn cross-env DEBUG_PROD=true yarn package
// or build unpacked dir https://www.electron.build/cli
yarn cross-env DEBUG_PROD=true yarn dir
```

## Reference project

- [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate)
- [electron-with-server-example](https://github.com/jlongster/electron-with-server-example)
