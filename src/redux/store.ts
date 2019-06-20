import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import reducer from './reducers'

// const store = createStore(
//   reducer,
//   applyMiddleware(
//     thunkMiddleware
//   )
// )

// (store.dispatch as ThunkDispatch<State, void, AnyAction>)(fetchRepos({
//   q: 'react'
// }))

// console.log(store.getState())
// store.subscribe(() =>
//   console.log(store.getState())
// )

export function configureStore (initialState: any = {}) {
  return createStore(reducer, initialState, applyMiddleware(thunkMiddleware))
  // return createStore(reducer, initialState, applyMiddleware(thunkMiddleware))
}

// export default store
