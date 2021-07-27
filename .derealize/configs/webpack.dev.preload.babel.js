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
    preload: path.join(__dirname, '../../src/preload.ts'),
    'preload-inject': path.join(__dirname, '../../src/preload-inject.ts'),
  },

  output: {
    path: path.join(__dirname, '../../src'),
    filename: '[name].js',
    library: {
      type: 'commonjs2',
    },
  },

  node: {
    __dirname: false,
    __filename: false,
  },
})
