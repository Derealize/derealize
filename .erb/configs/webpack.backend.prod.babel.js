import path from 'path'
import webpack from 'webpack'
import { merge } from 'webpack-merge'
import TerserPlugin from 'terser-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import baseConfig from './webpack.base'
import CheckNodeEnv from '../scripts/CheckNodeEnv'
import DeleteSourceMaps from '../scripts/DeleteSourceMaps'

CheckNodeEnv('production')
DeleteSourceMaps()

const devtoolsConfig =
  process.env.DEBUG_PROD === 'true'
    ? {
        devtool: 'source-map',
      }
    : {}

export default merge(baseConfig, {
  ...devtoolsConfig,

  mode: 'production',

  target: 'node',

  entry: ['core-js', 'regenerator-runtime/runtime', require.resolve('../../src/backend/backend.ts')],

  output: {
    path: path.join(__dirname, '../../'),
    filename: './src/backend/backend.prod.js',
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

    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
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
})
