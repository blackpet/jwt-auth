import {browser} from '$app/env'
import {API_RESOURCE} from '$env/static/private'
import type {AuthRequestInit, RequestMethod} from '$types/fetch';
import JsCookies from 'js-cookie';
import {redirect} from '@sveltejs/kit';

const AUTHORIZATION = 'Authorization'

class ClientFetch {
  #baseOptions?: AuthRequestInit
  #baseURL?: string = ''
  #defaultMethodHeaders = {
    post: {
      'Content-Type': 'application/json',
    },
    put: {
      'Content-Type': 'application/json',
    },
    patch: {
      'Content-Type': 'application/json',
    },
    delete: {
      'Content-Type': 'application/json',
    },
  }

  constructor(config?: AuthRequestInit) {
    config && this.setBaseOptions(config)
  }

  setBaseOptions(config: AuthRequestInit) {
    if (!config?.baseURL) {
      this.#baseOptions = {
        ...this.#baseOptions, ...config,
        headers: {...this.#baseOptions?.headers, ...config?.headers}
      }
    } else {
      const {baseURL, ...rest} = config
      this.#baseOptions = {
        ...this.#baseOptions, ...rest,
        headers: {...this.#baseOptions?.headers, ...rest?.headers}
      }
      this.#baseURL = baseURL
    }
  }

  async get(uri: string, option?: AuthRequestInit) {
    return await this.request('GET', uri, undefined, option)
  }

  async post(uri: string, body: any | null, option?: AuthRequestInit) {
    return await this.request('POST', uri, body, option)
  }

  async put(uri: string, body: any | null, option?: AuthRequestInit) {
    return await this.request('PUT', uri, body, option)
  }

  async patch(uri: string, body: any | null, option?: AuthRequestInit) {
    return await this.request('PATCH', uri, body, option)
  }

  async delete(uri: string, body: any | null, option?: AuthRequestInit) {
    return await this.request('DELETE', uri, body, option)
  }

  async request(method: string = 'POST', uri: string, body?: any | null, option?: AuthRequestInit): Promise<Response> {
    // auth token from cookie
    const token = JsCookies.get('X-AUTH-TOKEN')
    const AUTHORIZATION_HEADER = token && {[AUTHORIZATION]: `Bearer ${token}`}

    const _option = {
      ...this.#baseOptions,
      ...option,
      method,
      headers: {
        ...this.#defaultMethodHeaders.post,
        ...(this.#baseOptions?.headers ?? {}),
        ...(AUTHORIZATION_HEADER || {}),
        ...(option?.headers ?? {}),
      },
      ...(method !== 'GET' && {body: typeof body === 'object' ? JSON.stringify(body) : body})
    }
    const res = await fetch(this.#baseURL + uri, _option)

    // !!!!!!!!! ok !!!!!!!!!!
    if (res.ok) return res

    // 401 이면 refresh token expired!
    if(res.status === 401) {
      if (browser) {
        location.replace('/login?status=401')
      } else {
        redirect(307, '/login?status=401')
      }
    }
    // 401, 403 아니면 error!
    if (res.status !== 403) {
      return Promise.reject({status: res.status, statusText: res.statusText, ...(await res.json()),})
    }

    // refresh token
    const tokens = await this.refreshToken(res, (AUTHORIZATION_HEADER || {}));

    // re-try original request
    const res2 = await this[method.toLowerCase() as RequestMethod](uri, {
      headers: {'Authorization': `Bearer ${tokens.access}`},
    })

    return res2
  }

  async refreshToken(res: Response, AUTHORIZATION_HEADER: any) {
    // ------- 403: refresh token ---------
    const token = JsCookies.get('REFRESH-TOKEN')
    // refresh token!
    const refresh_res = await this.post('/auth/refresh', {token: token}, {
      headers: {...AUTHORIZATION_HEADER},
      credentials: 'include',
    })

    // invalid or expired refresh token!
    if (!refresh_res.ok) {

      if (refresh_res.status !== 401) return Promise.reject({status: res.status, statusText: res.statusText, ...(await res.json()),})

      // 401
      if (browser) {
        location.replace('/login?status=401')
      } else {
        redirect(307, '/login?status=401')
      }
    }

    const tokens = await refresh_res.json()
    return tokens;
  }
}


export let clientFetch = new ClientFetch()
clientFetch.setBaseOptions({
  baseURL: API_RESOURCE || import.meta.env.VITE_API_RESOURCE
})
