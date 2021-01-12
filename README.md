# TIPS

用 yarn，不要挂代理
<https://electron-react-boilerplate.js.org/docs/installation-debugging-solutions/>

todo:

```json
"husky": {
  "hooks": {
    "pre-commit": "lint-staged"
  }
}
```

# NodeGit

fork/BrowserWindow main 进程时暂时无解决的问题：
https://github.com/nodegit/nodegit/issues/1335
只能手动修改 src/node_modules/nodegit/dist/nodegit.js:19
"../build/Debug/nodegit.node" 改为 "../build/Release/nodegit.node"
todo:这个问题可能只存在于 win 平台

实测 nodegit 执行 electron-rebuild 没有任何区别
实测不使用 fork/BrowserWindow 直接 main 进程引用 nodegit 没有问题
