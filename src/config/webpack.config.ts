import path from 'path'
import * as webpack from 'webpack'
import { paths } from './paths'

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

const baseConfig: webpack.Configuration = {
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
          }
          // ***** stop ****** Are you adding a new loader?
        ]
      }
    ]
  }
}
