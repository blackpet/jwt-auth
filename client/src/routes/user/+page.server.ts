import type {ServerLoadEvent} from '@sveltejs/kit';
import {redirect} from '@sveltejs/kit';
import {authFetch} from '$lib/fetch/auth-fetch';

/** @type {import('./$types').PageServerLoad} */
export async function load(event: ServerLoadEvent) {
  const res = await authFetch.get(event, '/user')
  const claims = await res.json();
  if (claims) return claims

  // throw error(404, 'Not found')
  throw redirect(307, '/login')
}
