const config = require('./config')
process.env.NODE_ENV = process.env.NODE_ENV || config.dev.NODE_ENV

const webpack = require('webpack')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const baseConfigFactory = require('./webpack.config.base')
const paths = require('./paths')

const NODE_ENV = process.env.NODE_ENV
const isEnvProduction = NODE_ENV === config.build.NODE_ENV
const baseConfig = baseConfigFactory('server')

module.exports = Object.assign({}, baseConfig, {
  mode: NODE_ENV,
  target: 'node',
  entry: isEnvProduction
    ? paths.serverEntry
    : [
      'webpack/hot/poll?1000',
      paths.serverEntry
    ],
  output: {
    // libraryTarget: 'commonjs2',
    path: paths.serverDist,
    filename: 'server.js',
  },
  externals: [
    (context, request, callback) => {
      if (/\.css$/.test(request)) {
        // console.log(request)
        return callback(null, '{}')
      }
      callback()
    },
    nodeExternals({
      whitelist: ['webpack/hot/poll?1000']
    })
  ],
  node: {
    __dirname: true
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
      NODE_ENV: JSON.stringify(NODE_ENV),
      TARGET_ENV: JSON.stringify('server')
    }),
    new ForkTsCheckerWebpackPlugin({
      async: !isEnvProduction,
      useTypescriptIncrementalApi: true,
      watch: [paths.tsconfig, paths.serverSrc],
      // silent: true
    }),
    // new webpack.IgnorePlugin({
    //   resourceRegExp: /\.css$/,
    // }),
    !isEnvProduction && new webpack.HotModuleReplacementPlugin(),
  ].filter(Boolean),
  optimization: {},
  devtool: isEnvProduction
    ? 'source-map'
    : 'eval-source-map',
})
