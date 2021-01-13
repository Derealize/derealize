# TIPS

用 yarn，不要挂代理
<https://electron-react-boilerplate.js.org/docs/installation-debugging-solutions/>

npm install --global --production windows-build-tools
最好用 node 安装包的 chocolatey 脚本，完整性更好

# NodeGit

fork/BrowserWindow main 进程时暂时无解决的问题：
https://github.com/nodegit/nodegit/issues/1335
只能手动修改 src/node_modules/nodegit/dist/nodegit.js:19
"../build/Debug/nodegit.node" 改为 "../build/Release/nodegit.node"
todo:这个问题可能只存在于 win 平台

实测 nodegit 执行 electron-rebuild 没有任何区别
实测不使用 fork/BrowserWindow 直接 main 进程引用 nodegit 没有问题

# Scripts

yarn start
yarn cross-env PORT=8564 yarn start
yarn cross-env DEV_PROCESS=true yarn start

OPEN_ANALYZER=true yarn build
yarn cross-env DEBUG_PROD=true yarn package

# Issus

erb 文档有不少错误，./app 应该是 ./src
以下方式调试 package 应该是扯蛋的
yarn cross-env DEBUG_PROD=true yarn build
yarn cross-env DEBUG_PROD=true yarn start
可以用 electron-builder build --dir 仅编译，不打包安装程序

查看依赖包是不是 native 包，直接看源码是不是纯 js 就行

解压 app.asat
npm install -g asar
asar extract 压缩文件 文件夹

# server-process

[关于阻塞 UI 线程](https://github.com/electron/electron/issues/12098)：
[方案](https://github.com/jlongster/electron-with-server-example) 即使 5.x 版本真的解决了 block 渲染线程的问题（可以用 git/npm 测试），把主要的 node 线程任务拆分出 elretorn 主线程依然是非常有必要的。elretorn 除了 UI 以外还有很多工作：任务栏菜单、快捷键、通知...还有 npm/git 任务崩溃的时候...
与 webpack [集成方案参考](https://github.com/jlongster/electron-with-server-example/issues/6#issuecomment-611617665)：
