import type {RequestEvent} from '@sveltejs/kit';
import {v2} from '$lib/http';
import Cookie from 'cookie'
import type {AxiosError} from 'axios';

/**
 * @deprecated node server 로 이사감!
 * POST /api/login
 * @param request
 * @constructor
 */
export async function POST({request, setHeaders}: RequestEvent) {
  const data = await request.json()
  console.log('server/login POST json data', data, )

  try {
    const res = await v2.post('/auth/login', data, {
      withCredentials: true
    })
    if ('access' in res.data) {
      // (sveltekit) server side `Authorization` header
      v2.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`

      // response cookie to client
      setHeaders({
        'set-cookie': [
          Cookie.serialize('X-AUTH-TOKEN', res.data.access, {path: '/'}),
          Cookie.serialize('REFRESH-TOKEN', res.data.refresh, {path: '/'}),
        ]
      })
    }

    console.log('server/login POST res', res.data);

    return new Response(JSON.stringify(res.data))
  } catch (e) {
    console.error('login error!!!!', (e as AxiosError).response)
    const {status, statusText, data} = (e as AxiosError).response!

    return new Response(JSON.stringify(data),{status, statusText})
  }
}
