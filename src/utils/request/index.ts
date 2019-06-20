import axios, { AxiosRequestConfig } from 'axios'
import api, { Api } from '../api'

interface Request {
  (api: Api, conf: AxiosRequestConfig, component?: any): Promise<any>;
}

// const config = {
//   // baseUrl: 'https://api.github.com',
//   baseUrl: 'http://localhost:8080/api',
//   timeout: 10000,
// }

axios.defaults.baseURL = 'http://localhost:8080/api'
axios.defaults.timeout = 10000

const request: Request = async (...rest) => {
  // console.log(TARGET_ENV)
  let req: any = null
  if (TARGET_ENV === 'client') {
    req = await import('./client')
  }
  if (TARGET_ENV === 'server') {
    req = await import('./server')
  }
  return req.default(...rest)
}

export {
  api
}
export default request
