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

  mode: 'none',

  target: 'electron-main',

  entry: {
    main: path.join(__dirname, '../../src/main.ts'),
    backend: path.join(__dirname, '../../src/backend/backend.ts'),
  },

  output: {
    path: path.resolve(__dirname, '../../src'),
    filename: '[name].prod.js',
    library: {
      type: 'commonjs2',
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
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.OPEN_ANALYZER === 'true' ? 'server' : 'disabled',
      openAnalyzer: process.env.OPEN_ANALYZER === 'true',
    }),

    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),

    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      DEBUG_PROD: false,
      STUDIO: process.env.STUDIO === 'true',
      START_MINIMIZED: false,
      SENTRYDNS: process.env.SENTRYDNS,
    }),

    new CleanWebpackPlugin({
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
