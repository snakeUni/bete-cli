import * as webpack from 'webpack'
import { paths } from './paths'

export const devConfig: webpack.Configuration = {
  mode: 'development',
  output: {
    path: paths.appBuild,
    chunkFilename: 'chunk/[name].chunk.js',
    filename: 'js/[name].js',
    publicPath: '/'
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
}
