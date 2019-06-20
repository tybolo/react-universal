const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const postcssPresetEnv = require('postcss-preset-env')
const path = require('path')
const paths = require('./paths')
const config = require('./config')

const isEnvProduction = process.env.NODE_ENV === config.build.NODE_ENV

const getStyleloaders = (isEnvServer, useModules, preloader) => {
  // console.log(isEnvServer)
  if (isEnvServer && !useModules) {
    return ['ignore-loader']
  }

  const styleLoader = isEnvServer ? false : isEnvProduction
    ? { loader: MiniCssExtractPlugin.loader }
    : {
      loader: 'style-loader',
      options: {
        sourceMap: true,
      }
    }

  const loaders = [
    styleLoader,
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
        modules: useModules ? true : false,
        camelCase: useModules ? 'dashes' : false,
        localIdentName: '[name]_[local]_[hash:base64:5]',
        // 不知道为什么server和client输出的模块不一致，所以在服务端只取样式的标识符
        exportOnlyLocals: useModules && isEnvServer ? true : false,
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: true,
        ident: 'postcss',
        plugins: (loader) => [
          postcssPresetEnv({
            stage: 4
          }),
        ]
      }
    },
    preloader
  ].filter(Boolean)

  return loaders
}

module.exports = (targetEnv) => {
  const isEnvServer = targetEnv === 'server'

  return {
    mode: 'none',
    context: paths.context,
    entry: {
      index: paths.clientEntry
    },
    output: {
      path: paths.clientDist,
      publicPath: isEnvProduction
        ? config.build.publicPath
        : config.dev.publicPath,
      filename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].js'
        : 'static/js/[name].js',
      chunkFilename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].chunk.js'
        : 'static/js/[name].chunk.js',
    },
    resolve: {
      extensions: ['.js', 'jsx', '.ts', '.tsx', '.json'],
      // alias配置会使typescript模块检查出错，需要另外配置tsconfig的baseUrl和paths字段
      alias: {
        '@': paths.clientSrc,
        'S': paths.serverSrc,
        'build': paths.build,
      }
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            cacheCompression: isEnvProduction,
            plugins: [
              // antd模块的样式按需加载，服务器运行时会报错，所以仅在浏览器环境使用
              !isEnvServer && ["import", {
                "libraryName": "antd",
                "libraryDirectory": "es",   // default: lib
                "style": true
              }],
              // 防止styled-components在server和client生成的class名不一致
              'styled-components'
            ].filter(Boolean)
          }
        },
        {
          enforce: 'pre',
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          loader: 'eslint-loader',
          options: {
            emitError: true,    // 语法错误时照样输出
            emitWarning: true,  // 语法错误时照样输出
          }
        },
        {
          test: /\.css$/,
          exclude: [/\.m\.css$/],
          use: getStyleloaders(isEnvServer, false)
        },
        {
          test: /\.m\.css$/,
          use: getStyleloaders(isEnvServer, true)
        },
        {
          test: /\.(sass|scss)$/,
          exclude: [/\.m\.(sass|scss)$/],
          use: getStyleloaders(isEnvServer, false, {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          })
        },
        {
          test: /\.m\.(sass|scss)$/,
          use: getStyleloaders(isEnvServer, true, {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          })
        },
        {
          test: /\.less$/,
          use: getStyleloaders(isEnvServer, false, {
            loader: 'less-loader',
            options: {
              sourceMap: true,
              javascriptEnabled: true,
              modifyVars: {
                // 覆盖antd主题
                hack: `true; @import "${paths.clientSrc}/styles/antd.less";`
              }
            }
          })
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'static/img/[name].[hash:7].[ext]'
          }
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'static/media/[name].[hash:7].[ext]'
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'static/fonts/[name].[hash:7].[ext]'
          }
        },
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: paths.template,
        inject: true,
        minify: isEnvProduction && {
          removeComments: true,
          collapseWhitespace: true
        },
      }),

      new ForkTsCheckerWebpackPlugin({
        async: !isEnvProduction,
        useTypescriptIncrementalApi: true,
        watch: [paths.tsconfig, paths.clientSrc],
        // silent: true
      }),

      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        TARGET_ENV: JSON.stringify(targetEnv)
      })
    ],
    optimization: {
      minimize: isEnvProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
          parallel: true,
          cache: true,
          sourceMap: true,
        }),
        new OptimizeCSSAssetsPlugin(),
      ],
      runtimeChunk: true,
      splitChunks: {
        chunks: 'all',
        name: true
      }
    }
  }
}
