import type {ServerLoadEvent} from '@sveltejs/kit';

type AuthRequestInit = RequestInit & {baseURL?: string}

class AuthFetch {
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
    return await fetch(this.#baseURL + uri, {...this.#baseOptions, ...option})
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

  async request({request, setHeaders}: ServerLoadEvent, method: string = 'POST', uri: string, body?: any | null, option?: AuthRequestInit) {
    return await fetch(this.#baseURL + uri, {
      method: 'POST',
      ...this.#baseOptions,
      ...option,
      headers: {...this.#defaultMethodHeaders.post, ...(this.#baseOptions?.headers ?? {}), ...(option?.headers ?? {})},
      body: typeof body === 'object' ? JSON.stringify(body) : body
    })
  }
}

export let authFetch = new AuthFetch()
