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
    ],
  },

  output: {
    path: path.join(__dirname, '../../src'),
    // https://github.com/webpack/webpack/issues/1114
    // renderer use web target now. but ref native module must use commonjs2
    // libraryTarget: 'commonjs2',
  },

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    modules: [path.join(__dirname, '../../src'), 'node_modules'],
  },
}
