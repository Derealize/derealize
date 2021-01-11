import path from 'path'
import webpack from 'webpack'

export default {
  devtool: 'inline-source-map',
  watch: true,

  mode: 'development',

  // 只要使用 new BrowserWindow 就是 electron-renderer 环境
  target: 'electron-main',

  entry: path.resolve(__dirname, '../../src/backend/backend.ts'),

  output: {
    path: path.resolve(__dirname, '../../src/backend'),
    filename: 'backend.dev.js',
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
}
