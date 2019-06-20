const path = require('path')

function resolvePath (pathname) {
  return path.resolve(__dirname, '../', pathname || '')
}

module.exports = {
  context: resolvePath(),
  build: resolvePath('build'),
  tsconfig: resolvePath('tsconfig.json'),
  public: resolvePath('public'),
  template: resolvePath('public/index.html'),

  clientSrc: resolvePath('src'),
  clientDist: resolvePath('dist/client'),
  clientEntry: resolvePath('src/index.tsx'),

  serverSrc: resolvePath('server'),
  serverDist: resolvePath('dist/server'),
  serverEntry: resolvePath('server/index.ts')
}
