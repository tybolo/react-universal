module.exports = {
  dev: {
    NODE_ENV: 'development',
    devtool: 'eval-source-map',
    publicPath: 'http://localhost:3000/', // 开发环境帮助server获得正确的资源地址
    host: 'localhost',
    port: 3000,
    autoOpenBrowser: false,
    servePort: 8080
  },
  build: {
    NODE_ENV: 'production',
    devtool: 'source-map',
    publicPath: '/',
    servePort: 8081
  }
}
