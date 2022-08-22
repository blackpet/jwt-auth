import type {AxiosRequestConfig, AxiosResponse} from 'axios';
import axios from 'axios';
import JsCookies from 'js-cookie'
import {browser} from '$app/env'

const AUTHORIZATION = 'Authorization'

axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.put['Content-Type'] = 'application/json'
axios.defaults.headers.patch['Content-Type'] = 'application/json'
axios.defaults.headers.delete['Content-Type'] = 'application/json'

export default axios

const api = axios.create({
  baseURL: import.meta.env.VITE_API_RESOURCE,
  timeout: 10000, // 10s
})

function requestFulfilledInterceptor(config: AxiosRequestConfig) {
  let token
  // client-side 인 경우만 cookie 에서 추출하여 넣어주자!
  if (browser) {
    token = JsCookies.get('X-AUTH-TOKEN')
    console.log('requestFulfilledInterceptor token', config.headers, token);
    if (token) {
      config.headers![AUTHORIZATION] = 'Bearer ' + token
    }
  }
  return config
}

function responseFulfilledInterceptor(value: AxiosResponse) {
  console.log('responseFulfilledInterceptor value', value)
  return value
}

function responseRejectedInterceptor(error: any) {
  console.log('responseRejectedInterceptor err', error)
  return error

}

api.interceptors.request.use(requestFulfilledInterceptor)
api.interceptors.response.use(responseFulfilledInterceptor, responseRejectedInterceptor)



export {
  api,
}
