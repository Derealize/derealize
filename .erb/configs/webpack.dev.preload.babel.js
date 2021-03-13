import path from 'path'
import webpack from 'webpack'
import { merge } from 'webpack-merge'
import baseConfig from './webpack.base'

export default merge(baseConfig, {
  watch: true,
  devtool: 'inline-source-map',
  mode: 'development',

  target: 'electron-renderer',

  entry: {
    preload: ['core-js', 'regenerator-runtime/runtime', path.join(__dirname, '../../src/preload.ts')],
    preload_inject: ['core-js', 'regenerator-runtime/runtime', path.join(__dirname, '../../src/preload_inject.ts')],
  },

  output: {
    path: path.join(__dirname, '../../src'),
    filename: '[name].js',
    libraryTarget: 'commonjs2', // ref native module must use commonjs2
  },

  node: {
    __dirname: false,
    __filename: false,
  },
})
