import { Api } from '../api'
import axios, { AxiosRequestConfig } from 'axios'

// export default (a: string, b: string) => {
//   console.log('server', a, b)
// }

console.log('useing ' + TARGET_ENV)
export default (api: Api, conf: AxiosRequestConfig) => {
  const url = api.url.replace(/\$\{(.*?)\}/g, (match, key) => {
    return conf.params[key] || ''
  })
  console.log(conf)
  return axios[api.method as 'post'](url, conf)
}
