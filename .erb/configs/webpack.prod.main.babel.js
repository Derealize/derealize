import path from 'path'
import webpack from 'webpack'
import { merge } from 'webpack-merge'
import TerserPlugin from 'terser-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import baseConfig from './webpack.base'
import DeleteSourceMaps from '../scripts/DeleteSourceMaps'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import { dependencies as externals } from '../../src/package.json'

DeleteSourceMaps()
const isDebug = process.env.DEBUG_PROD === 'true'

export default merge(baseConfig, {
  devtool: isDebug ? 'source-map' : false,

  // https://www.webpackjs.com/concepts/mode/
  // production 包含的 UglifyJsPlugin 有 bug，或其它配置引起的诡异问题。
  // 不配置 node会 failback 'production'
  // mode: 'production',
  mode: 'none',

  // 如果使用'node'，则main进程 ipcMain 不可用。
  // new BrowserWindow实际没有spawn/fork 一个node进程，而是把当前进程attach到了browser
  target: 'electron-main',

  entry: {
    main: path.join(__dirname, '../../src/main.ts'),
    backend: path.join(__dirname, '../../src/backend/backend.ts'),
    react_transformer: path.join(__dirname, '../../src/backend/react_transformer.ts'),
  },

  output: {
    path: path.resolve(__dirname, '../../src'),
    filename: '[name].prod.js',
    library: {
      type: 'commonjs2',
    },
  },

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
    ],
  },

  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.OPEN_ANALYZER === 'true' ? 'server' : 'disabled',
      openAnalyzer: process.env.OPEN_ANALYZER === 'true',
    }),

    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),

    new webpack.EnvironmentPlugin({
      NODE_ENV: JSON.stringify('production'),
      DEBUG_PROD: false,
      START_MINIMIZED: false,
    }),

    new CleanWebpackPlugin({
      // 坑！**/*.node 会把 node_modules 里的 *.node 文件删除
      // 即使是BeforeBuild，也需要编译成功才生效
      cleanOnceBeforeBuildPatterns: ['main.prod.js', 'backend.prod.js'],
    }),
  ],

  /**
   * Disables webpack processing of __dirname and __filename.
   * If you run the bundle in node.js it falls back to these values of node.js.
   * https://github.com/webpack/webpack/issues/2010
   */
  node: {
    __dirname: false,
    __filename: false,
  },
})
