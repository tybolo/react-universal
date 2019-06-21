import React from 'react'
import { Context } from 'koa'
import { Store, AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import Layout from '@/components/base/Layout'
import Home from '@/components/base/Home'
import NoMatch from '@/components/base/404'
import Repos from '@/containers/Repos'
import RepoDetails from '@/containers/Repo'

import { State } from '@/redux/types'
import { fetchRepo, fetchRepos } from '@/redux/actions'

export interface RouteConf {
  component: React.ComponentType<any>;
  fetch?: (store: Store, ctx: Context) => Promise<any>;
  routes?: RouteConf[];
  [key: string]: any;
}

const routes: RouteConf[] = [
  {
    path: '/',
    component: Layout,
    // exact: true,
    routes: [
      {
        path: '/',
        component: Home,
        exact: true
      },
      {
        path: '/search/:q',
        component: Repos,
        fetch: (store, ctx) => {
          return (store.dispatch as ThunkDispatch<State, void, AnyAction>)(fetchRepos({
            q: ctx.params.q
          }))
        }
      },
      {
        path: '/repos/:user/:repo',
        component: RepoDetails,
        fetch: (store, ctx) => {
          const username = ctx.params.user
          const reponame = ctx.params.repo
          return (store.dispatch as ThunkDispatch<State, void, AnyAction>)(fetchRepo({ username, reponame }))
        }
      }
    ]
  },
  {
    component: NoMatch
  }
]

export {
  routes
}
