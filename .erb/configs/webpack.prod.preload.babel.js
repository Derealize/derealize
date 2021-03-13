import path from 'path'
import webpack from 'webpack'
import { merge } from 'webpack-merge'
import baseConfig from './webpack.base'
import TerserPlugin from 'terser-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'

const isDebug = process.env.DEBUG_PROD === 'true'

export default merge(baseConfig, {
  devtool: isDebug ? 'source-map' : false,
  mode: 'none',

  target: 'electron-renderer',

  entry: {
    preload: ['core-js', 'regenerator-runtime/runtime', path.join(__dirname, '../../src/preload.ts')],
    preload_inject: ['core-js', 'regenerator-runtime/runtime', path.join(__dirname, '../../src/preload_inject.ts')],
  },

  output: {
    path: path.join(__dirname, '../../src'),
    filename: '[name].prod.js',
    libraryTarget: 'commonjs2', // ref native module must use commonjs2
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
    new CleanWebpackPlugin({
      // 即使是BeforeBuild，也需要编译成功才生效
      cleanOnceBeforeBuildPatterns: ['preload.prod.js', 'preload_inject.prod.js'],
    }),
  ],

  node: {
    __dirname: false,
    __filename: false,
  },
})
