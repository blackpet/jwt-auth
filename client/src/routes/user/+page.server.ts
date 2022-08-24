import {getUser} from '$lib/api/auth-api';
import {error, redirect} from '@sveltejs/kit';
import type {LoadEvent, ServerLoadEvent} from '@sveltejs/kit';
import {browser} from '$app/env';
import JsCookies from 'js-cookie';
import Cookie from 'cookie';

/** @type {import('./$types').PageServerLoad} */
export async function load({request, setHeaders}: ServerLoadEvent) {
  let uri = 'http://localhost:5100/api/v2/user';
  const cookie = Cookie.parse(request.headers.get('cookie')!)
  const AUTHORIZATION_HEADER = {'Authorization': `Bearer ${cookie['X-AUTH-TOKEN']}`}
  const res = await fetch(uri, {
    headers: AUTHORIZATION_HEADER,
  })
  console.log('+page.server.js res', '\n=============status', res.status, res.ok);

  // request occur error!!
  if (res.status !== 200) {
    if (res.status === 403) {
      console.log('================================== Forbidden!! (expired token) ==============================')
      // refresh token!
      const refresh_res = await fetch('http://localhost:5100/api/v2/auth/refresh', {
        method: 'POST',
        headers: {...AUTHORIZATION_HEADER, 'Content-Type': 'application/json'},
        body: JSON.stringify({token: cookie['REFRESH-TOKEN']}),
        credentials: 'include',
      })
      console.log('refresh_res res', '\n=============status', refresh_res.status, refresh_res.ok);

      if (refresh_res.status !== 200) {
        if (refresh_res.status === 401) {
          throw redirect(307, '/login?status=401');
        } else {
          throw error(500, refresh_res.statusText)
        }
      }

      const tokens = await refresh_res.json();
      console.log('----refresh tokens-----', tokens)
      setHeaders({
        'set-cookie': [
          Cookie.serialize('X-AUTH-TOKEN', tokens.access, {path: '/'}),
          Cookie.serialize('REFRESH-TOKEN', tokens.refresh, {path: '/'})
        ]
      })

      // re-try original request
      const res = await fetch(uri, {
        headers: {'Authorization': `Bearer ${tokens.access}`},
      })
      const claims = await res.json();
      if (claims) return claims
    } // 403

    // 403 아니면 error!
    throw error(500, res.statusText)
  } // !res.ok


  const claims = await res.json();
  // const claims = await getUser()
  if (claims) return claims

  // throw error(404, 'Not found')
  throw redirect(307, '/login')
}
