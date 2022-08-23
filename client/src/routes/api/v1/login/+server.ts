import type {RequestEvent} from '@sveltejs/kit';
import {v2} from '$lib/http';
// import {generateToken} from '$lib/auth';
import Cookie from 'cookie'

/**
 * @deprecated node server 로 이사감!
 * POST /api/login
 * @param request
 * @constructor
 */
export async function POST({request, setHeaders}: RequestEvent) {
  const data = await request.json()
  console.log('server/login POST json data', data)

  const res = await v2.post('/auth/login', data, {
    withCredentials: true
  })
  if ('access' in res.data) {
    v2.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`
    console.log(v2.defaults.headers)

    setHeaders({
      'set-cookie': [
        Cookie.serialize('X-AUTH-TOKEN', res.data.access, {path: '/'}),
        Cookie.serialize('REFRESH-TOKEN', res.data.refresh, {path: '/'}),
      ]
    })
  }

  console.log('server/login POST res', res.data);


  const response = new Response(JSON.stringify(res.data))
  return response
}
