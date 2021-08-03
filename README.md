<div align='center'>

<img src="https://derealize.com/img/icon.png" alt="logo" width="100" />

### Derealize

&#x270D; tailwindcss editor play with the development running front-end project  
 [**Explore Release »**](https://derealize.com)

[report bug](https://github.com/Derealize/derealize/issues) ·
[feature voting](https://derealize-fider.herokuapp.com/) ·
[keep touch (Discord)](https://discord.gg/2sqy5QeZXK)

  <!-- <a href="https://chrome.google.com/webstore/detail/socode-search/hlkgijncpebndijijbcakkcefmpniacd">browser extension</a>· -->

<!-- ![Test](https://github.com/Derealize/derealize/workflows/Test/badge.svg?branch=main) -->

![Build](https://github.com/Derealize/derealize/workflows/Build/badge.svg?branch=main)
![Dependencies](https://img.shields.io/david/Derealize/derealize)
![Dev Dependencies](https://img.shields.io/david/dev/Derealize/derealize)
![License](https://img.shields.io/github/license/Derealize/derealize)

</div>

## Why create this project?

Traditional tailwindcss editors (e.g. [windicss.org/play](https://windicss.org/play.html)) is editing a separate html component separated from the front-end project. After each edit, you need to manually synchronize the html component to your front-end project. The modular nesting of front-end projects may be very complicated and uncertain. Until I saw [ui-devtools](https://www.ui-devtools.com) (thanks for the inspiration it gave). Unfortunately, its mode of work limits UI design to the hands of front-end engineers (can't avoid some professional command line knowledge). So I thought that if I can integrate the node/git environment in the electron application, we can allow people who are not familiar with any code knowledge to edit the UI of the real front-end project with the help of tailwindcss and access the CI/CD pipeline! It seems that this goal is a bit whimsical, I hope we can approach it.

## Getting Started

```js
yarn apply // apply editor code
// or
yarn apply:studio // apply studio code

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
// or build unpacked dir
yarn cross-env DEBUG_PROD=true yarn dir
```

## Reference

- [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate)
- [electron-with-server-example](https://github.com/jlongster/electron-with-server-example)
