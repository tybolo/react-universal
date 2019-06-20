import { Middleware } from 'koa'
import http, { IncomingHttpHeaders, ClientRequest, IncomingMessage } from 'http'
import https from 'https'
// import { IncomingHttpHeaders } from 'http'
import httpRequest from 'request'

export const request2 = (
  url: string,
  options?: httpRequest.CoreOptions
): Promise<{
  rq: httpRequest.Request;
  rs?: httpRequest.Response;
  rsHeaders?: IncomingHttpHeaders;
  setHeaders: (headers: IncomingHttpHeaders) => void;
}> => {
  return new Promise((resolve) => {
    const rq = httpRequest(url, Object.assign({
      agent: false
    }, options))
    let headers = {}

    rq.on('response', (rs) => {
      Object.assign(rs.headers, {
        'Connection': 'keep-alive'
      }, headers)
    })

    rq.on('error', (err) => {
      console.log(err)
      throw err
    })

    resolve({
      rq,
      setHeaders: (hds) => {
        headers = hds
      }
    })
    // rq.end()
  })
}

export const request = (
  url: string,
  options: any = {}
  // retryCount: number = 0
): Promise<{
  rq: ClientRequest;
  rs: IncomingMessage;
  rsHeaders: IncomingHttpHeaders;
}> => {
  return new Promise((resolve, reject) => {
    let realHttp: typeof http | typeof https = http

    if ((/^https:\/\//).test(url)) realHttp = https

    options = Object.assign({}, options)

    const rq = realHttp.request(url, options, (rs) => {
      // console.log(url, rs.statusCode, rs.statusMessage)
      // if (!rs.statusCode || rs.statusCode >= 300) return
      const rsHeaders: IncomingHttpHeaders = {}

      rs.rawHeaders.forEach((item, i) => {
        if (i % 2 === 0) {
          rsHeaders[item] = rs.rawHeaders[i + 1]
        }
      })
      resolve({
        rq,
        rs,
        rsHeaders
      })
    })

    rq.on('error', (e) => {
      reject(e)
      console.error(`请求遇到问题: ${e.message}`)
    })

    rq.on('timeout', () => {
      // rq.abort()
      console.log('timeout', url)
      // reject(new Error('timeout'))
      // if (retryCount > 3) {
      //   reject(new Error('timeout'))
      // } else {
      //   request(url, options, ++retryCount).then(resolve).catch(reject)
      // }
    })

    rq.end()
  })
}

const httpProxy: Middleware = async (ctx, next) => {
  await next()

  if (ctx.status === 404 || ctx.status === 405) {
    const { rs, rsHeaders } = await request('http://localhost:8081' + ctx.path + ctx.search, {
      headers: ctx.headers
    })

    ctx.respond = false
    ctx.res.writeHead(rs.statusCode || ctx.status, rsHeaders)

    rs.pipe(ctx.res)
  }
}

export default httpProxy
