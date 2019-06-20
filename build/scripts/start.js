process.env.NODE_ENV = 'development'

const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const serverConfig = require('../webpack.config.server')
const clientConfig = require('../webpack.config.dev')
const config = require('../config')
const { ChildProcess, errHandler, statsOptions } = require('../utils')

// 自动打包浏览器运行环境，运行dev-server
// const browserProcess = new ChildProcess('npm run client:dev', 'client', 'blue')

// 监听服务器环境打包后的代码变化，重启服务器
// const serverProcess = new ChildProcess('npm run server:dev', 'server', 'green')
const serverProcess = new ChildProcess('node --inspect ./dist/server/server.js', 'server', 'blue')

// 自动打包服务器运行环境
const compiler = webpack(serverConfig)
compiler.watch({
  // poll: 600,
  aggregateTimeout: 600,
  ignored: [/node_modules/],
}, (err, stats) => {
  errHandler(err, stats)

  serverProcess && serverProcess.run()
  // browserProcess && browserProcess.run()
})

// 自动打包浏览器运行环境，运行dev-server
const clientCompiler = webpack(clientConfig)
const devServerOptions = Object.assign({}, clientConfig.devServer, {
  stats: statsOptions,
})
const devServer = new WebpackDevServer(clientCompiler, devServerOptions)

devServer.listen(config.dev.port, config.dev.host, () => {
  console.log('Starting server on http://localhost:3000')
})
