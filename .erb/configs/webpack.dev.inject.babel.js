import path from 'path'
import webpack from 'webpack'
import { merge } from 'webpack-merge'
import baseConfig from './webpack.base'

export default merge(baseConfig, {
  watch: true,
  devtool: 'inline-source-map',
  mode: process.env.NODE_ENV || 'development',

  target: 'web',

  entry: ['core-js', 'regenerator-runtime/runtime', path.join(__dirname, '../../src/inject.ts')],

  output: {
    path: path.join(__dirname, '../../src'),
    filename: 'inject.dev.js',
  },
})
