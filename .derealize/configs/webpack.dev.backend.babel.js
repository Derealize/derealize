import path from 'path'
import webpack from 'webpack'
import { merge } from 'webpack-merge'
import baseConfig from './webpack.base'

export default merge(baseConfig, {
  watch: true,
  devtool: 'inline-source-map',
  mode: 'development',

  target: 'electron-main',

  entry: {
    backend: path.join(__dirname, '../../src/backend/backend.ts'),
  },

  output: {
    path: path.join(__dirname, '../../src'),
    filename: '[name].js',
    library: {
      type: 'commonjs2',
    },
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      STUDIO: process.env.STUDIO === 'true',
    }),
  ],

  node: {
    __dirname: false,
    __filename: false,
  },
})
