import {getUser} from '$lib/api/auth-api';
import {error, redirect} from '@sveltejs/kit';
import type {LoadEvent, ServerLoadEvent} from '@sveltejs/kit';
import {browser} from '$app/env';

/** @type {import('./$types').PageLoad} */
export async function load(event: LoadEvent | ServerLoadEvent) {
  if (!browser) {
    console.log('+page.js event.request', (event as ServerLoadEvent).request);
  }
  const claims = await getUser()
  if (claims) return claims

  // throw error(404, 'Not found')
  throw redirect(307, '/login')
}
