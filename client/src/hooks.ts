import type {RequestEvent, ResolveOptions} from '@sveltejs/kit';
import Cookie from 'cookie'
import {clientFetch} from '$lib/fetch/client-fetch';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle(
  {event, resolve}: {event: RequestEvent, resolve: (event: RequestEvent, opts?: ResolveOptions) => Promise<Response>}
): Promise<Response> {
  const request = event.request
  const cookie = Cookie.parse(request.headers.get('cookie') ?? '')
  cookie?.['X-AUTH-TOKEN'] && clientFetch.setBaseOptions({
    headers: {'Authorization': `Bearer ${cookie['X-AUTH-TOKEN']}`}
  })

  const response = await resolve(event);

  return response;
}

/** @type {import('@sveltejs/kit').HandleError} */
export function handleError({error, event}: { error: Error & { frame?: string }; event: RequestEvent }) {
  console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%% handleError %%%%%%%%%%%%%%%%%%%%%%')
  console.log('error', error)
  // console.log('event', event)
  console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%% // handleError %%%%%%%%%%%%%%%%%%%%%%')

}
