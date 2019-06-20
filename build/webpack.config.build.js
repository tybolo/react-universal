const config = require('./config')
process.env.NODE_ENV = process.env.NODE_ENV || config.build.NODE_ENV

const webpackMerge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const baseConfigFactory = require('./webpack.config.base')
const paths = require('./paths')

const NODE_ENV = process.env.NODE_ENV
const baseConfig = baseConfigFactory('client')

module.exports = webpackMerge(baseConfig, {
  mode: NODE_ENV,
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
    }),
    new CopyWebpackPlugin([{
      from: paths.public,
      to: paths.clientDist
    }])
  ],
  devtool: config.build.devtool,
  performance: false,
})
