import { Dispatch } from 'redux'
// import axios from 'axios'
import api from '../utils/api'
import { ReposParams, RepoParams, RepoItem } from './types'
// import request from '../utils/request'
import request from '@/utils/request/index'

export interface ActionType {
  type: string;
  [propName: string]: any;
}

export const REQUEST_REPOS = 'REQUEST_REPOS'
export function requestRepos (data: ReposParams) {
  return {
    type: REQUEST_REPOS,
    data: data
  }
}

export const RECEIVE_REPOS = 'RECEIVE_REPOS'
export function receiveRepos (repos: any[], totalCount: number) {
  return {
    type: RECEIVE_REPOS,
    totalCount: totalCount,
    repos: repos
  }
}

// export const REQUEST_REPO = 'REQUEST_REPO'
// export function requestRepo (data: ReposParams) {
//   return {
//     type: REQUEST_REPO,
//     data: data
//   }
// }

export const RECEIVE_REPO = 'RECEIVE_REPO'
export function receiveRepo (repo: RepoItem) {
  return {
    type: RECEIVE_REPO,
    repo: repo
  }
}

export function fetchRepos (data: ReposParams, oldData?: ReposParams) {
  const params = Object.assign({}, oldData, data, {
    page: data.page ? data.page : 1
  })
  return (dispatch: Dispatch) => {
    dispatch(requestRepos(params))
    return request(api.repo.search, {
      params: params
    }).then((res) => {
      dispatch(receiveRepos(res.data.items, res.data.total_count))
    })
  }
}

export function fetchRepo (data: RepoParams) {
  return (dispatch: Dispatch) => {
    return request(api.repo.item, {
      params: data
    }).then((res) => {
      dispatch(receiveRepo(res.data))
    })
  }
}

// export const fetchRepo = (data: RepoParams) => {
//   return (dispatch: Dispatch) => {
//     return request(api.repo.item, {
//       params: data
//     }).then((res) => {
//       dispatch(receiveRepo(res.data))
//     })
//   }
// }
