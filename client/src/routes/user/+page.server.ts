import type {ServerLoadEvent} from '@sveltejs/kit';
import {redirect} from '@sveltejs/kit';
import {serverFetch} from '$lib/fetch/server-fetch';

/** @type {import('./$types').PageServerLoad} */
export async function load(event: ServerLoadEvent) {
  const res = await serverFetch.get(event, '/user')
  const claims = await res.json();
  if (claims) return claims

  // throw error(404, 'Not found')
  throw redirect(307, '/login')
}
