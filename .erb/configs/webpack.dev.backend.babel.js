import path from 'path'
import webpack from 'webpack'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'

export default {
  devtool: 'inline-source-map',
  watch: true,

  mode: 'development',

  // 如果使用'node'，则main进程ipcRenderer不可用。
  // 这是new BrowserWindow的特别之处，实际它没有spawn/fork进程，而是把当前进程attach到了browser
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
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),
    new CleanWebpackPlugin({
      // 即使是BeforeBuild，也需要编译成功才生效
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
