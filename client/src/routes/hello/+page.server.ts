import type {ServerLoadEvent} from '@sveltejs/kit';
import {hello_server} from '../../lib/api/auth-api';

/** @type {import('./$types').PageServerLoad} */
export async function load(event: ServerLoadEvent) {
  return Object.fromEntries(Object.entries(await hello_server(event)).map(([k, v]) => [`server_${k}`, v]))
}
