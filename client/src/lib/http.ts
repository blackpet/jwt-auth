import type {AxiosRequestConfig, AxiosResponse} from 'axios';
import axios from 'axios';
import JsCookies from 'js-cookie'
import {browser} from '$app/env'
import {debounce} from 'lodash';
import type {LoginTokenResponse} from '$types/user';

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

api.interceptors.request.use(requestFulfilledInterceptor)
api.interceptors.response.use(responseFulfilledInterceptor, responseRejectedInterceptor)


function requestFulfilledInterceptor(config: AxiosRequestConfig) {
  let token
  // client-side 인 경우만 cookie 에서 추출하여 넣어주자!
  console.log('requestFulfilledInterceptor', browser)
  if (browser) {
    token = JsCookies.get('X-AUTH-TOKEN');
    if (token) {
      config.headers![AUTHORIZATION] = 'Bearer ' + token
    }
  } else {
    console.log('ssr!!!', config.headers)
  }
  return config;
}

function responseFulfilledInterceptor(value: AxiosResponse) {
  console.log('responseFulfilledInterceptor value', value)
  return value
}

function responseRejectedInterceptor(error: any) {
  const config = error?.config
  console.log('responseRejectedInterceptor err status', error.response.status)

  // 401: Unauthorized
  if (error?.response?.status === 401) {
    // TODO: signout!
    if (browser) {
      location.replace('/login?status=401');
    }
    return Promise.reject(error)
  }
  // 403: Forbidden / expired token!!
  else if (error?.response?.status === 403) {
    const refresh = async (resolve: typeof Promise.resolve) => {
      try {
        // debounce 로 request 가 반복적으로 호출 되는 것을 막자!!
        const tokens = await debounceRenewTokenRequest()
        if (tokens?.access) {
          config.headers = {
            ...config.headers,
            withCredentials: true,
            [AUTHORIZATION]: 'Bearer ' + tokens.access
          }
        }

        // complete renewal token!! re-try original request!
        const res = await axios.request(config)
        return resolve(Promise.resolve(res.data))
      } catch {
        // TODO: signout!
        if (browser) {
          location.replace('/login?status=403');
        }
        return resolve(Promise.reject(error))
      }
    }; // refresh
    return new Promise(refresh);
  }
  return Promise.reject(error);

}

const debounceRenewTokenRequest = debounce(renewToken, 400, {leading: true, trailing: false})

async function renewToken(): Promise<LoginTokenResponse | undefined> {
  const _refresh = JsCookies.get('REFRESH-TOKEN')

  try {
    const res = await api.post('/auth/refresh',
      {token: _refresh},
      {headers: {
          withCredentials: true
      }}
    )
    console.log('renew token', res.data)
    return res.data

  } catch (error) {
    // TODO: logout 처리!
    console.error('token renewal failed!')
  }
}


export {
  api,
}
