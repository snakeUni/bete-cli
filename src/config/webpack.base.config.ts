import * as webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { paths } from './paths'
import { isEnvProduction } from './env'

const hasJsxRuntime = (() => {
  // 禁用新的 jsx
  if (process.env.DISABLE_NEW_JSX_TRANSFORM === 'true') {
    return false
  }

  try {
    require.resolve('react/jsx-runtime')
    return true
  } catch (error) {
    return false
  }
})()

// style files regexe
const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/
const sassRegex = /\.(scss|sass)$/
const sassModuleRegex = /\.module\.(scss|sass)$/

const getStyleLoaders = (options: any, preProcessor?: string) => {
  const loader = [
    'style-loader',
    { loader: 'css-loader', options },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [['postcss-preset-env']]
        }
      }
    }
  ]

  if (preProcessor) {
    loader.push(preProcessor)
  }

  return loader
}

export const baseConfig: webpack.Configuration = {
  entry: paths.appIndex,
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            include: paths.appSrc,
            loader: require.resolve('babel-loader'),
            options: {
              presets: [
                [
                  require.resolve('babel-preset-react-app'),
                  {
                    runtime: hasJsxRuntime ? 'automatic' : 'classic'
                  }
                ]
              ],
              babelrc: false
            }
          },
          {
            test: cssRegex,
            exclude: cssModuleRegex,
            use: getStyleLoaders({ importLoaders: 1 })
          },
          // css module
          {
            test: cssModuleRegex,
            use: getStyleLoaders({ importLoaders: 1, modules: true })
          },
          // sass, scss
          {
            test: sassRegex,
            exclude: sassModuleRegex,
            use: getStyleLoaders({ importLoaders: 3 }, 'sass-loader')
          },
          // scss module
          {
            test: sassModuleRegex,
            use: getStyleLoaders({ importLoaders: 3, modules: true }, 'sass-loader')
          },
          {
            test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
            loader: 'file-loader',
            options: {
              name: 'static/media/[name].[ext]'
            }
          },
          {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'file-loader',
            options: {
              limit: 3000,
              name: 'static/fonts/[name].[ext]'
            }
          },
          {
            test: /\.(png|jpe?g|gif|bpm|svg|ico)(\?.*)?$/,
            loader: 'url-loader',
            options: {
              limit: 3000,
              name: 'static/img/[name].[ext]'
            }
          }
          // ***** stop ****** Are you adding a new loader?
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin(
      Object.assign(
        {
          template: paths.appHtml
        },
        isEnvProduction
          ? {
              minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
              }
            }
          : undefined
      )
    )
  ]
}
