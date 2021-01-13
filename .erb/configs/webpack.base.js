import path from 'path'
import webpack from 'webpack'
import { dependencies as externals } from '../../src/package.json'

export default {
  externals: [...Object.keys(externals || {})],

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
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

  output: {
    path: path.join(__dirname, '../../src'),
    // https://github.com/webpack/webpack/issues/1114
    // libraryTarget: 'commonjs2', // bcs renderer use web target now
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.node'],
    // modules: [path.join(__dirname, '../src'), 'node_modules'],
  },
}
