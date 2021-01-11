import path from 'path'
import webpack from 'webpack'
import { merge } from 'webpack-merge'
import TerserPlugin from 'terser-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import baseConfig from './webpack.base'
import CheckNodeEnv from '../scripts/CheckNodeEnv'
import DeleteSourceMaps from '../scripts/DeleteSourceMaps'

if (process.env.NODE_ENV === 'production') {
  CheckNodeEnv('development')
}

export default merge(baseConfig, {
  devtool: 'inline-source-map',
  watch: true,

  mode: 'development',

  target: 'node',

  entry: require.resolve('../../src/backend/backend.ts'),

  output: {
    path: path.join(__dirname, '../../'),
    filename: './src/backend/backend.dev.js',
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),
    new webpack.LoaderOptionsPlugin({
      debug: true,
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
