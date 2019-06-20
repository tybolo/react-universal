import axios from 'axios'
import { Middleware } from 'koa'
import path from 'path'
import fs from 'fs'
import generateContent from '@/server-entry'

let html = ''

async function getHTML () {
  if (html) return html
  if (NODE_ENV === 'production') {
    html = fs.readFileSync(path.resolve(__dirname, '../../dist/client/index.html'), 'utf-8')
  } else {
    // 方式一
    const res = await axios.get('http://localhost:3000/index.html')
    html = res.data

    // 方式二
    // // 获取webpack-dev-middleware存在内存的文件路径，并读取
    // const filename = expressMiddleware.getFilenameFromUrl('/webpack-dev/index.html')
    // html = expressMiddleware.fileSystem.readFileSync(filename, 'utf-8')
  }
  return html
}

async function mergeLayout (snippets: { [key: string]: string}) {
  const html = await getHTML()
  const placeholderRegex = /<!--!(.*?)-->/g

  let doc = html.replace(
    placeholderRegex,
    (match, key: 'content' | 'heads' | 'scripts') => {
      return snippets[key] || ''
    }
  )

  return doc
}

const middleware: Middleware = async (ctx, next) => {
  await next()

  if (ctx.status === 404 && ctx.headers.accept.indexOf('text/html') >= 0) {
    const { content, scripts, styles } = await generateContent(ctx)
    ctx.body = await mergeLayout({
      content,
      scripts,
      heads: styles
    })
  }
}

export default middleware
