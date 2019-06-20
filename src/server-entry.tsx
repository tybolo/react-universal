import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import { Store } from 'redux'
import { StaticRouter } from 'react-router-dom'
import { matchRoutes } from 'react-router-config'
import { Context } from 'koa'
import { ServerStyleSheet } from 'styled-components'

// import Component from '@/components/Index'
import Component from '@/router'
import { routes } from '@/router/routes'
import { configureStore } from '@/redux/store'

const generateStore = async (ctx: Context) => {
  const store = configureStore()
  const matches = matchRoutes(routes, ctx.req.url || '')

  const preFetches = matches.map(({ route }) => {
    return typeof route.fetch === 'function'
      ? route.fetch(store, ctx)
      : Promise.resolve(null)
  })

  await Promise.all(preFetches).catch((err) => {
    const conf = err.config
    const res = err.response
    console.log(conf.method + ' ' + conf.url + ' [' + res.status + '] ' + res.statusText)
  })

  return store
}

const generateContent = (ctx: Context, store: Store) => {
  // 提取styled-components的样式
  const sheet = new ServerStyleSheet()

  const content = renderToString(
    <Provider store={store}>
      <StaticRouter location={ctx.url} context={{}}>
        <Component />
      </StaticRouter>
    </Provider>
  )

  return {
    content,
    styles: sheet.getStyleTags()
  }
}

export default async (ctx: Context) => {
  const store = await generateStore(ctx)
  const { content, styles } = generateContent(ctx, store)
  const state = store.getState()
  const scripts = `<script>window.__REDUX_DATA__ = ${JSON.stringify(state || {})}</script>`

  return {
    content,
    scripts,
    styles
  }
}
