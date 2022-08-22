import {getUser} from '$lib/api/auth-api';
import {error, type LoadEvent} from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load(event: LoadEvent) {
  const claims = await getUser()
  if (claims) return claims

  return error(404, 'Not found')
}
