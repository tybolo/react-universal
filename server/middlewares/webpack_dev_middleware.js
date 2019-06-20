import webpack from 'webpack'
import devMiddleware from 'webpack-dev-middleware'
import config from 'build/webpack.config.base'

// const middleware = (compiler, opts) => {
//   const expressMiddleware = devMiddleware(compiler, opts)

//   const middleware = async function (ctx, next) {
//     await expressMiddleware(ctx.req, {
//       end: (content) => {
//         ctx.body = content
//       },
//       setHeader: (name, value) => {
//         ctx.set(name, value)
//       }
//     }, next)
//   }

//   return middleware
// }
const compiler = webpack(config)

export const expressMiddleware = devMiddleware(compiler, {
  publicPath: '/webpack-dev',
  ignored: /src/
})

const expressMiddlewareAdapter = async (ctx, next) => {
  await expressMiddleware(ctx.req, {
    end: (content) => {
      ctx.body = content
    },
    setHeader: (name, value) => {
      ctx.set(name, value)
    }
  }, next)
}

export default expressMiddlewareAdapter
