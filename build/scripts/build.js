process.env.NODE_ENV = 'production'

const webpack = require('webpack')
const serverConfig = require('../webpack.config.server')
const clientConfig = require('../webpack.config.build')
const { errHandler } = require('../utils')

const clientCompiler = webpack(clientConfig)
clientCompiler.run((err, stats) => {
  errHandler(err, stats)
  const serverCompiler = webpack(serverConfig)
  serverCompiler.run(errHandler)
})
