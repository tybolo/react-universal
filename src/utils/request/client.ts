import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import { message } from 'antd'
import { Api } from '@/utils/api'
import nprogress from 'nprogress'

interface Resolve {
  (res: AxiosResponse): any;
}

interface Reject {
  (err: any): any;
}

interface Cache {
  [propName: string]: () => void;
}

const waiting: Cache = {}
const pending: {
  [propName: string]: any[];
} = {}

const globalLoading = {
  count: 0,
  start: function () {
    !this.count++ && nprogress.start()
  },
  done: function () {
    !--this.count && nprogress.done()
  }
}

function emit (
  url: string,
  method: string,
  conf: AxiosRequestConfig,
  resolve: Resolve,
  reject: Reject,
  callback?: () => void
) {
  axios[method as 'post'](url, conf)
    .then((res) => {
      resolve(res)
    })
    .catch((err) => {
      if (err.response) {
        message.error(err.response.status + ' - ' + err.response.statusText)
        reject(err.response)
        return
      } else if (err.message) {
        message.error(err.message)
      }
      reject(err) // eslint-disable-line prefer-promise-reject-errors
    })
    .finally(() => {
      typeof callback === 'function' && callback()
    })
}

// axios.defaults.baseURL = 'https://api.github.com'

// axios.interceptors.request.use(function (config) {
//   return config
// }, function (error) {
//   return Promise.reject(error)
// })

// axios.interceptors.response.use(function (response) {
//   return response
// }, function (err) {
//   return Promise.reject(err)
// })
console.log('useing ' + TARGET_ENV)
export default function request (api: Api, conf: AxiosRequestConfig, component?: any) {
  const onChangeSpinState = component && (component.onChangeSpinState || (component.props && component.props.onChangeSpinState))
  const url = api.url.replace(/\$\{(.*?)\}/g, (match, key) => conf.params[key])
  const cancelId = `[${api.method}] ${api.url}`
  let localLoading = typeof onChangeSpinState === 'function'

  if (localLoading && (!pending[cancelId] || !pending[cancelId].length)) {
    onChangeSpinState(true)
  }

  return new Promise((resolve: Resolve, reject) => {
    const t = setTimeout(() => {
      // 防止pending状态重复请求
      pending[cancelId] = pending[cancelId] || []
      typeof pending[cancelId][0] === 'function' && pending[cancelId][0]()
      conf.cancelToken = new axios.CancelToken((c) => {
        pending[cancelId].push(c)
      })

      // 发起请求
      globalLoading.start()
      emit(url, api.method, conf, resolve, reject, () => {
        delete waiting[cancelId]
        pending[cancelId].shift()
        localLoading && !pending[cancelId].length && onChangeSpinState(false)
        globalLoading.done()
      })
    }, 200)

    // 防止快速连续发起请求，只需发出最后一个请求
    typeof waiting[cancelId] === 'function' && waiting[cancelId]()
    waiting[cancelId] = () => {
      clearTimeout(t)
      reject('canceled') // eslint-disable-line prefer-promise-reject-errors
    }
  })
}

// export default (api: Api, conf: AxiosRequestConfig, component?: any) => {
//   const url = api.url.replace(/\$\{(.*?)\}/g, (match, key) => {
//     return conf.params[key] || ''
//   })

//   return typeof window !== 'undefined'
//     ? request(api, conf, component)
//     : axios[api.method as 'post'](url, conf)
// }

// interface Request {
//   (a: string, b: string): void;
// }

// const request: Request = (a, b) => {
//   console.log('client', a, b)
// }

// export default request
