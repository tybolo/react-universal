import app from './app'
import http from 'http'
import config from 'build/config'

const port = NODE_ENV === 'production' ? config.build.servePort : config.dev.servePort
const server = http.createServer()
let requestHandler = app.callback()

server.on('request', requestHandler)
server.listen(port, () => {
  console.log('app listening on port ' + port)
})

// check if HMR is enabled
if (module.hot) {
  // accept update of dependency
  module.hot.accept('./app', function () {
    // replace request handler of server
    server.removeListener('request', requestHandler)
    requestHandler = require('./app').default.callback()
    server.on('request', requestHandler)
  })
}
