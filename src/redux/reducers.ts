import { combineReducers } from 'redux'
import { REQUEST_REPOS, RECEIVE_REPOS, RECEIVE_REPO } from './actions'
import { Repos } from './types'

function repos (
  state: Repos = {
    isFetching: false,
    data: {
      q: '',
      page: 1,
      'per_page': 12
    },
    totalCount: 0,
    item: {
      id: '',
      name: ''
    },
    items: []
  },
  action: any
) {
  switch (action.type) {
    case REQUEST_REPOS:
      return Object.assign({}, state, {
        isFetching: true,
        data: Object.assign({}, state.data, action.data)
      })

    case RECEIVE_REPOS:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.repos,
        totalCount: action.totalCount
      })

    case RECEIVE_REPO:
      return Object.assign({}, state, {
        item: action.repo
      })

    default:
      return state
  }
}

export default combineReducers({
  repos
})
