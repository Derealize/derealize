import path from 'path'
import webpack from 'webpack'
import { merge } from 'webpack-merge'
import TerserPlugin from 'terser-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import baseConfig from './webpack.base'

const isDebug = process.env.DEBUG_PROD === 'true'

export default merge(baseConfig, {
  devtool: isDebug ? 'source-map' : false,
  mode: 'none',

  target: 'electron-renderer',

  entry: {
    preload: path.join(__dirname, '../../src/preload.ts'),
    'preload-inject': path.join(__dirname, '../../src/preload-inject.ts'),
  },

  output: {
    path: path.join(__dirname, '../../src'),
    filename: '[name].prod.js',
    library: {
      type: 'commonjs2', // ref native module must use commonjs2
    },
  },

  optimization: {
    minimize: !isDebug,
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
    ],
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      DEBUG_PROD: isDebug,
      STUDIO: process.env.STUDIO === 'true',
      SENTRYDNS: null,
    }),

    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['preload.prod.js', 'preload-inject.prod.js'],
    }),
  ],

  node: {
    __dirname: false,
    __filename: false,
  },
})
