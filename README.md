# TIPS

npm install --global --production windows-build-tools
最好用 node 安装包的 [chocolatey 脚本](https://github.com/nodejs/node/edit/master/tools/msvs/install_tools/install_tools.bat)，完整性更好

用 yarn，不要挂代理
<https://electron-react-boilerplate.js.org/docs/installation-debugging-solutions/>
rm -rf node_modules
rm yarn.lock src/yarn.lock
yarn cache clean
yarn
yarn electron-rebuild
yarn start

webpack 配置文件原则关于 NODE_ENV 的原则：

- .dev 文件必然是 'development'
- .prod 文件必然是 'production'，但可以带 DEBUG_PROD 布尔值 (是否生成 sourcemap)
- 其它默认为'development'，可配置为'production' (隐含 DEBUG_PROD)

小坑：重新执行 'yarn start' 调试的时候 Backend Browser 刚启动不会执行新版 dev.js，需要 ctrl+r 刷新一下。CleanWebpackPlugin 解决不了这问题

electron-builder 第一次运行需要下载 nsis、winCodeSign，自动下载很可能失败，可以[手动下载](https://github.com/electron-userland/electron-builder/issues/1859)

# Scripts

yarn start
yarn cross-env PORT=8564 yarn start

backend 稳定，不需要 debug 的话:
yarn cross-env DEV_SUB_PROCESS=true yarn start

yarn cross-env OPEN_ANALYZER=true yarn build
yarn cross-env DEBUG_PROD=true yarn build
build 后可快速调试 [backend,preload,renderer].prod.js:
yarn cross-env NODE_ENV=production DEBUG_PROD=true yarn start

yarn cross-env DEBUG_PROD=true yarn package
yarn cross-env DEBUG_PROD=true yarn dist

# NodeGit

fork/BrowserWindow main 进程时暂时无解决的问题：
https://github.com/nodegit/nodegit/issues/1335
只能手动修改 src/node_modules/nodegit/dist/nodegit.js:19
"../build/Debug/nodegit.node" 改为 "../build/Release/nodegit.node"
todo:这个问题可能只存在于 win 平台

实测 nodegit 执行 electron-rebuild 没有任何区别
实测不使用 fork/BrowserWindow 直接 main 进程引用 nodegit 没有问题

# Other Issus

erb 文档有不少错误，./app 应该是 ./src
以下方式调试 package 应该是扯蛋的
yarn cross-env DEBUG_PROD=true yarn build
yarn cross-env DEBUG_PROD=true yarn start

可以用 electron-builder build --dir 仅编译，不打包安装程序
查看依赖包是不是 native 包，直接看源码是不是纯 js 就行

解压 app.asat
npm install -g asar
asar extract app.asar 文件夹

# server-process

[关于阻塞 UI 线程](https://github.com/electron/electron/issues/12098)：
[方案](https://github.com/jlongster/electron-with-server-example) 即使 5.x 版本真的解决了 block 渲染线程的问题（可以用 git/npm 测试），把主要的 node 线程任务拆分出 elretorn 主线程依然是非常有必要的。elretorn 除了 UI 以外还有很多工作：任务栏菜单、快捷键、通知...还有 npm/git 任务崩溃的时候...
与 webpack [集成方案参考](https://github.com/jlongster/electron-with-server-example/issues/6#issuecomment-611617665)：

# todo

cd src && yarn add nodegit
no template named 'remove_cv_t' in namespace 'std'; did you mean 'remove_cv'?
等待这个 pull request 发布到 0.28.0-alpha.1 版本
https://github.com/nodegit/nodegit/pull/1810
https://github.com/nodegit/nodegit/blob/master/package.json
