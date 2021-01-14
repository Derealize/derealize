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

export default {
  // externals: isDebug ? [] : [...Object.keys(externals || {})],
  externals: [...Object.keys(externals || {})],

  devtool: isDebug ? 'source-map' : false,

  // https://www.webpackjs.com/concepts/mode/
  // production 包含的 UglifyJsPlugin 有 bug，或其它配置引起的诡异问题。
  // 不配置 node会 failback 'production'
  // mode: 'production',
  mode: 'none',

  // 如果使用'node'，则main进程ipcRenderer不可用。
  // 这是new BrowserWindow的特别之处，实际它没有spawn/fork进程，而是把当前进程attach到了browser
  target: 'electron-main',

  entry: {
    main: './src/main.ts',
    backend: './src/backend/backend.ts',
  },

  output: {
    path: path.resolve(__dirname, '../../src'),
    filename: '[name].prod.js',
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.node$/,
        use: 'node-loader',
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.json', '.ts', '.node'],
  },

  optimization: {
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

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),

    new webpack.EnvironmentPlugin({
      DEBUG_PROD: false,
      START_MINIMIZED: false,
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
}
