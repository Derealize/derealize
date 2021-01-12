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

暂时没有解决的问题
https://github.com/nodegit/nodegit/issues/1335
只能手动修改 src/node_modules/nodegit/dist/nodegit.js:19
"../build/Debug/nodegit.node" 修改为 "../build/Release/nodegit.node"

实测 nodegit 执行 electron-rebuild 没有任何区别
