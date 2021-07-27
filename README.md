## Scripts

```js
yarn standby:base
yarn
yarn postinstall_dll
yarn start
yarn cross-env PORT=8564 yarn start

// 不编译 backend.ts 直接执行. 无 hotload、devtools debug:
yarn cross-env BACKEND_SUBPROCESS=true yarn start

yarn cross-env OPEN_ANALYZER=true yarn build

// build 后不安装快速调试执行 [backend,preload,renderer].prod.js:
yarn cross-env DEBUG_PROD=true yarn build
yarn cross-env NODE_ENV=production DEBUG_PROD=true yarn start

// [packaging](https://electron-react-boilerplate.js.org/docs/packaging)
yarn package --all
yarn cross-env DEBUG_PROD=true yarn package

// [Build unpacked dir](https://www.electron.build/cli)
yarn cross-env DEBUG_PROD=true yarn dir

// Macos local build
CSC_LINK=https://cdn.socode.pro/derealize.p12 CSC_KEY_PASSWORD=z565656z# yarn package:with_runtime --mac
```

webpack 配置文件关于 NODE_ENV 的原则：

- .dev 文件必然是 'development'
- .prod 文件必然是 'production'，但可以带 DEBUG_PROD 布尔值。调试编译文件，生成 sourcemap 等
- 无后缀默认为'development'，可配置'NODE_ENV=production'。隐含 DEBUG_PROD, 不编译安装快速调试

小坑：重新执行 'yarn start' 调试的时候 Backend Browser 刚启动不会执行新版 dev.js，需要 ctrl+r 刷新一下。CleanWebpackPlugin 解决不了这问题

electron-builder 第一次运行需要下载 nsis、winCodeSign，自动下载很可能失败，可以[手动下载](https://github.com/electron-userland/electron-builder/issues/1859)

## NodeGit

fork/BrowserWindow main 进程时暂时无解决的问题：
https://github.com/nodegit/nodegit/issues/1335
只能手动修改 src/node_modules/nodegit/dist/nodegit.js:19
"../build/Debug/nodegit.node" 改为 "../build/Release/nodegit.node"
todo:这个问题可能只存在于 win 平台

实测 nodegit 执行 electron-rebuild 没有任何区别
实测不使用 fork/BrowserWindow 直接 main 进程引用 nodegit 没有问题

必须安装 vs2017 C++ 编译器并且配置 msvs_version=2017

404 https://axonodegit.s3.amazonaws.com/nodegit/nodegit/nodegit-v0.28.0-alpha.9-electron-v12.0-win32-x64.tar.gz
并不是致命错误，只是开发者没有上传预构建包，需要自己本地编译。

https://stackoverflow.com/a/65892589
electron-rebuild 由历史原因存在，在新版 electron 下可以被 electron-builder 替代

编译错误信息有乱码这 win 平台可以用 'chcp 65001 && yarn ...' 强制 utf8

## Other Issus

erb 文档有不少错误，./app 应该是 ./src

可以用 electron-builder build --dir 仅编译，不打包安装程序

查看依赖包是不是 native 包，直接看源码是不是纯 js 就行

```js
解压 app.asat
npm install -g asar
asar extract app.asar 文件夹
```

css-loader 不要升级 6.x，和目前的 webpack 配置有冲突加载图片失败，不深究，后面很快会探索 esbuild。

部分 electron-builder 依赖包下载失败可以手动下载 zip/7z 文件放在以下目录
macOS: ~/Library/Caches/electron-builder
Linux: ~/.cache/electron-builder
windows: %LOCALAPPDATA%\electron-builder\cache

## server-process

- [关于阻塞 UI 线程](https://github.com/electron/electron/issues/12098)
- [方案](https://github.com/jlongster/electron-with-server-example) 即使 5.x 版本真的解决了 block 渲染线程的问题（可以用 git/npm 测试），把主要的 node 线程任务拆分出 elretorn 主线程依然是非常有必要的。elretorn 除了 UI 以外还有很多工作：任务栏菜单、快捷键、通知...还有 npm/git 任务崩溃的时候...
- 与 webpack [集成方案参考](https://github.com/jlongster/electron-with-server-example/issues/6#issuecomment-611617665)

## azure pipeline selfhost windows

agent 要升级到最新版。(自动安装)[https://dev.azure.com/derealize/_settings/agentpools?poolId=12&view=agents]很慢，不如 ./config.cmd remove 后重新安装
yarn 必须在 pipeline.yml 里 npm i -g yarn 安装。azure 的 host 无需安装。
cache 模块需要 tar 命令，azure 的 host 无需安装（不知到是如何实现的）。可以手动安装 tar 程序后设置 path 环境变量。
不要使用 GunWin32 的 (tar)[http://gnuwin32.sourceforge.net/packages/gtar.htm]，版本太旧，出现莫名问题。(新版本)[https://ftp.wayne.edu/gnu/tar/]又没有 release for win，只有源码。可以使用这个(libarchive)[https://github.com/libarchive/libarchive/releases]代替。
