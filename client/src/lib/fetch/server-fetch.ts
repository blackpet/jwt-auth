import {API_RESOURCE} from '$env/static/private'
import type {ServerLoadEvent} from '@sveltejs/kit';
import {error, redirect} from '@sveltejs/kit';
import Cookie from 'cookie';
import type {AuthRequestInit, PostRequestMethod, RequestMethod} from '$types/fetch';

const AUTHORIZATION = 'Authorization'

class ServerFetch {
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
      this.#baseOptions = config
    } else {
      const {baseURL, ...rest} = config
      this.#baseOptions = rest
      this.#baseURL = baseURL
    }
  }

  async get(event: ServerLoadEvent, uri: string, option?: AuthRequestInit) {
    return await this.request(event, 'GET', uri, undefined, option)
  }

  async post(event: ServerLoadEvent, uri: string, body: any | null, option?: AuthRequestInit) {
    return await this.request(event, 'POST', uri, body, option)
  }

  async put(event: ServerLoadEvent, uri: string, body: any | null, option?: AuthRequestInit) {
    return await this.request(event, 'PUT', uri, body, option)
  }

  async patch(event: ServerLoadEvent, uri: string, body: any | null, option?: AuthRequestInit) {
    return await this.request(event, 'PATCH', uri, body, option)
  }

  async delete(event: ServerLoadEvent, uri: string, body: any | null, option?: AuthRequestInit) {
    return await this.request(event, 'DELETE', uri, body, option)
  }

  async request(event: ServerLoadEvent, method: string = 'POST', uri: string, body?: any | null, option?: AuthRequestInit): Promise<Response> {
    const {request} = event
    // auth token from cookie
    const cookie = Cookie.parse(request.headers.get('cookie') ?? '')
    const AUTHORIZATION_HEADER = cookie?.['X-AUTH-TOKEN'] && {[AUTHORIZATION]: `Bearer ${cookie['X-AUTH-TOKEN']}`}

    const _option = {
      ...this.#baseOptions,
      ...option,
      method,
      headers: {
        ...this.#defaultMethodHeaders[method.toLowerCase() as PostRequestMethod],
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
    if(res.status === 401) throw redirect(307, '/login?status=401')
    // 401, 403 아니면 error!
    if (res.status !== 403) throw error(res.status, res.statusText)

    // refresh token
    const tokens = await this.refreshToken(event, res, (AUTHORIZATION_HEADER || {}));

    // re-try original request
    const res2 = await this[method.toLowerCase() as RequestMethod](event, uri, {
      headers: {'Authorization': `Bearer ${tokens.access}`},
    })

    return res2
  }

  async refreshToken(event: ServerLoadEvent, res: Response, AUTHORIZATION_HEADER: any) {
    const {request, setHeaders} = event


    // ------- 403: refresh token ---------
    const cookie = Cookie.parse(request.headers.get('cookie') ?? '')
    // refresh token!
    const refresh_res = await this.post(event, '/auth/refresh', {token: cookie['REFRESH-TOKEN']}, {
      headers: {...AUTHORIZATION_HEADER},
      credentials: 'include',
    })

    // invalid or expired refresh token!
    if (!refresh_res.ok) {
      // remove tokens
      setHeaders({
        'set-cookie': [
          Cookie.serialize('X-AUTH-TOKEN', 'deleted', {path: '/', expires: new Date(1970, 0, 1)}),
          Cookie.serialize('REFRESH-TOKEN', 'deleted', {path: '/', expires: new Date(1970, 0, 1)})
        ]
      })

      if (refresh_res.status !== 401) throw error(500, refresh_res.statusText)
      throw redirect(307, '/login?status=401')
    }

    const tokens = await refresh_res.json()
    setHeaders({
      'set-cookie': [
        Cookie.serialize('X-AUTH-TOKEN', tokens.access, {path: '/'}),
        Cookie.serialize('REFRESH-TOKEN', tokens.refresh, {path: '/'})
      ]
    })

    return tokens;
  }
}


export let serverFetch = new ServerFetch()
serverFetch.setBaseOptions({
  baseURL: API_RESOURCE
})
