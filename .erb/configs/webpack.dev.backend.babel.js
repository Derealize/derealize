import path from 'path'
import webpack from 'webpack'
import { merge } from 'webpack-merge'
import baseConfig from './webpack.base'

export default merge(baseConfig, {
  watch: true,
  devtool: 'inline-source-map',
  mode: 'development',

  // 如果使用'node'，则main进程ipcMain不可用。
  // 因为main进程new BrowserWindow没有spawn/fork进程，而是把当前进程attach到了browser
  target: 'electron-main',

  entry: path.join(__dirname, '../../src/backend/backend.ts'),

  output: {
    path: path.join(__dirname, '../../src/backend'),
    filename: 'backend.js',
    library: {
      type: 'commonjs2',
    },
  },

  // 任何 externals 都与 nodegit 不兼容，会让nodegit打包失效
  // externals: /.*\\tailwind\.config$/i,

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),
  ],

  node: {
    __dirname: false,
    __filename: false,
  },
})
