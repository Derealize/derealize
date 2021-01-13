import path from 'path'
import webpack from 'webpack'
import { merge } from 'webpack-merge'
import TerserPlugin from 'terser-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import baseConfig from './webpack.base'
import DeleteSourceMaps from '../scripts/DeleteSourceMaps'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'

DeleteSourceMaps()
const isDebug = process.env.DEBUG_PROD === 'true'

export default merge(baseConfig, {
  devtool: isDebug ? 'source-map' : false,

  mode: 'production',

  target: 'electron-main',

  entry: {
    main: './src/main.ts',
    backend: './src/backend/backend.ts',
  },

  output: {
    path: path.resolve(__dirname, '../../src'),
    filename: '[name].prod.js',
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

    /**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     *
     * NODE_ENV should be production so that modules do not perform certain
     * development checks
     */

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),

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
})
