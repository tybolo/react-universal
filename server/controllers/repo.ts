// import request from '../../src/utils/request'
import { Middleware } from 'koa'
import axios from 'axios'

export const postRepos: Middleware = async (ctx, next) => {
  await next()
  console.log('sd')
  const data = await axios.get('https://api.github.com/search/repositories', {
    params: ctx.query
  })
  await axios.post('http://localhost:8081/api/repos', {
    data: data.data
  })

  ctx.set('Content-Type', 'application/json')
  ctx.body = JSON.stringify(data.data)
}

// export const getRepos: Middleware = async (ctx, next) => {
//   await next()

//   const repos = await axios.get('http://localhost:8081/api/repos', {
//     params: ctx.query
//   })

//   ctx.set('Access-Control-Allow-Origin', '*')
//   ctx.set('Content-Type', 'application/json; charset=utf-8')
//   ctx.body = JSON.stringify(repos.data)
// }

// export const getRepo: Middleware = async (ctx, next) => {
//   await next()

//   const repos = await axios.get('http://localhost:8081/api/repo', {
//     params: {
//       username: ctx.params.username,
//       reponame: ctx.params.reponame
//     }
//   })

//   ctx.set('Access-Control-Allow-Origin', '*')
//   ctx.set('Content-Type', 'application/json; charset=utf-8')
//   ctx.body = JSON.stringify(repos.data)
// }
