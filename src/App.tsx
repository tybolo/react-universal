import 'nprogress/nprogress.css'
import '@/styles/antd.less'
import '@/styles/common.scss'
import '@/styles/style.scss'

import React from 'react'
import { hot } from 'react-hot-loader/root'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { configureStore } from './redux/store'
import Index from '@/router'

export const store = configureStore((window as MyWindow).__REDUX_DATA__)

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Index />
      </BrowserRouter>
    </Provider>
  )
}

// export default process.env.NODE_ENV === 'development'
//   ? hot(module)(App)
//   : App

export default hot(App)
