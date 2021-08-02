import webpack from 'webpack'
import path from 'path'
import { merge } from 'webpack-merge'
import baseConfig from './webpack.base'
import { dependencies } from '../../package.json'

const dist = path.join(__dirname, '../dll')

export default merge(baseConfig, {
  context: path.join(__dirname, '../..'),

  devtool: 'eval',
  mode: 'development',

  target: 'electron-renderer',

  externals: ['fsevents', 'crypto-browserify'],

  module: require('./webpack.babel').default.module,

  entry: {
    renderer: Object.keys(dependencies || {}),
  },

  output: {
    library: 'renderer',
    path: dist,
    filename: '[name].dll.dev.js',
    libraryTarget: 'var',
  },

  plugins: [
    new webpack.DllPlugin({
      path: path.join(dist, '[name].json'),
      name: '[name]',
    }),

    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      DEBUG_PROD: false,
      START_MINIMIZED: false,
    }),

    new webpack.LoaderOptionsPlugin({
      debug: true,
      options: {
        context: path.join(__dirname, '../../src'),
        output: {
          path: path.join(__dirname, '../dll'),
        },
      },
    }),
  ],
})
