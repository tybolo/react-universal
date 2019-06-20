const config = require('./config')
process.env.NODE_ENV = process.env.NODE_ENV || config.dev.NODE_ENV

const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const baseConfigFactory = require('./webpack.config.base')

const NODE_ENV = process.env.NODE_ENV
const baseConfig = baseConfigFactory('client')

module.exports = webpackMerge(baseConfig, {
  mode: NODE_ENV,
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  devtool: config.dev.devtool,
  devServer: {
    hot: true,
    inline: true,
    host: config.dev.host,
    port: config.dev.port,
    open: config.dev.autoOpenBrowser,
    publicPath: '/',
    contentBase: false,
    overlay: true,  // 是否在页面显示错误信息
    quiet: false,   // 是否在命令行控制台打印打包信息
    // clientLogLevel: 'warning',
    historyApiFallback: true,
    before: (app, server) => {
      // 服务端渲染时防止热加载功能因跨域问题失效
      app.all('*', function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*')
        next()
      })
    },
    watchOptions: {
      // poll: 600,
      aggregateTimeout: 600,
      ignored: [/server/],
    }
  },
})
