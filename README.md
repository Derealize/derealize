<div align='center'>

<img src="https://derealize.com/img/icon.png" alt="logo" width="100" />

### Derealize

&#x270D; tailwindcss editor play with the development running front-end project  
 [**Explore Release »**](https://derealize.com)

[report bug](https://github.com/Derealize/derealize/issues) ·
[feature voting](https://derealize-fider.herokuapp.com/) ·
[keep touch (Discord)](https://discord.gg/2sqy5QeZXK)

<!-- ![Test](https://github.com/Derealize/derealize/workflows/Test/badge.svg?branch=main) -->

![Build](https://github.com/Derealize/derealize/workflows/Build/badge.svg?branch=main)
![Dependencies](https://img.shields.io/david/Derealize/derealize)
![Dev Dependencies](https://img.shields.io/david/dev/Derealize/derealize)
![License](https://img.shields.io/github/license/Derealize/derealize)

</div>

![video](https://assets-derealize-com.onrender.com/hero.mp4)

## Why create this project?

Traditional tailwindcss editors (e.g. [windicss.org/play](https://windicss.org/play.html)) edits an html component that is separate from the front-end project. After each edit, you need to manually synchronize the html component to your front-end project. The modular nesting of a front-end project may be very complicated and uncertain. Until I saw [ui-devtools](https://www.ui-devtools.com) (thanks for the inspiration it gave). It play with the front-end project rather than html components. Unfortunately, its working model limits UI design to the hands of front-end engineers (can't avoid some professional command line knowledge). So I thought that if I could integrate the node/git environment in an electron application, people not familiar with any code knowledge could also edit the UI of real front-end projects with the help of tailwindcss and get into the CI/CD pipeline! It seems that this goal is a bit whimsical, I hope we can approach it.

## About Editor and Studio modes

Integrating node/git is costly, adding about 30M+ to the installer size and 110M+ to the application size. It is also not necessary for front-end engineers. So we built the editor version without node/git integration and recommend it to all front-end engineers who want to try to edit tailwindcss styles easily.

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

- [Chakra UI](https://chakra-ui.com/)
- [react-select](https://react-select.com/)
- [recast](https://github.com/benjamn/recast)
- [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate)
- [electron-with-server-example](https://github.com/jlongster/electron-with-server-example)
