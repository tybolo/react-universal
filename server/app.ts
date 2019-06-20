import Koa from 'koa'
import serve from 'koa-static'
import koaBody from 'koa-body'
import path from 'path'
// import logger from 'koa-logger'
import router from './router'
// import httpProxy from './middlewares/http_proxy'

const app = new Koa()

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    console.log(err)
    ctx.status = 500
  }
})

// app.use(logger())
app.use(serve(path.resolve(__dirname, '../dist/client'), {
  defer: true // 在下游中间件之后执行
}))
// app.use(httpProxy)
app.use(router.routes())
// app.use(router.allowedMethods())
app.use(koaBody())

// if (NODE_ENV === 'production') {
//   app.listen(8080, () => {
//     console.log('app listening on port 8080!')
//   })
// }

export default app
