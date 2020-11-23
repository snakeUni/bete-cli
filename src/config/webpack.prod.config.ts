import * as webpack from 'webpack'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { paths } from './paths'

export const prodConfig: webpack.Configuration = {
  mode: 'production',
  output: {
    path: paths.appBuild,
    chunkFilename: 'chunk/[name].chunk.js',
    filename: 'js/[name].js',
    publicPath: '/'
  },
  plugins: [
    new CleanWebpackPlugin({ verbose: false }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css'
    })
  ]
}
