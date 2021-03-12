import path from 'path'
import fs from 'fs'
import webpack from 'webpack'
import chalk from 'chalk'
import { merge } from 'webpack-merge'
import { spawn, execSync } from 'child_process'
import baseConfig from './webpack.base'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'

const isDev = process.env.NODE_ENV === 'development'

export default merge(baseConfig, {
  watch: true,
  devtool: isDev ? 'inline-source-map' : false,
  mode: process.env.NODE_ENV || 'development',

  target: 'electron-renderer',

  entry: {
    preload: ['core-js', 'regenerator-runtime/runtime', path.join(__dirname, '../../src/preload.ts')],
    preload_inject: ['core-js', 'regenerator-runtime/runtime', path.join(__dirname, '../../src/preload_inject.ts')],
  },

  output: {
    path: path.join(__dirname, isDev ? '../../src' : '../../src/dist'),
    filename: isDev ? '[name].dev.js' : '[name].prod.js',
    libraryTarget: 'commonjs2', // ref native module must use commonjs2
  },

  optimization: {
    minimize: !isDev,
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
    ],
  },

  plugins: [
    new CleanWebpackPlugin({
      // 即使是BeforeBuild，也需要编译成功才生效
      cleanOnceBeforeBuildPatterns: ['preload.prod.js', 'preload_inject.prod.js'],
    }),
  ],

  node: {
    __dirname: false,
    __filename: false,
  },
})
