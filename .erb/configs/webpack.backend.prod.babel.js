import path from 'path'
import webpack from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import TerserPlugin from 'terser-webpack-plugin'
import CheckNodeEnv from '../scripts/CheckNodeEnv'
import DeleteSourceMaps from '../scripts/DeleteSourceMaps'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'

CheckNodeEnv('production')
DeleteSourceMaps()

const devtoolsConfig =
  process.env.DEBUG_PROD === 'true'
    ? {
        devtool: 'source-map',
      }
    : {}

export default {
  ...devtoolsConfig,

  mode: 'production',

  target: 'electron-main',

  entry: path.resolve(__dirname, '../../src/backend/backend.ts'),

  output: {
    path: path.resolve(__dirname, '../../src/backend'),
    filename: 'backend.prod.js',
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

    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      DEBUG_PROD: false,
      START_MINIMIZED: false,
    }),

    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['backend.dev.js', '**/*.node'],
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
