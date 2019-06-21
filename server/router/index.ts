import Router from 'koa-router'
import render from 'S/middlewares/render'
import { routes } from '@/router/routes'

import { postRepos } from 'S/controllers/repo'

const router = new Router()

const extractRoutes = (routes: any[]) => {
  routes.forEach((route) => {
    route.path && router.get(route.path, render)
    route.routes && extractRoutes(route.routes)
  })
}

// page
// router.get('/(.*)', render) // noMatch，这种匹配方式不能取到路由params的值
extractRoutes(routes)

// api
// router.get('/api/repos', getRepos)
router.post('/api/repos', postRepos)
// router.get('/api/repo/:username/:reponame', getRepo)

export default router
