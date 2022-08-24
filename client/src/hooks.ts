import type {RequestEvent, ResolveOptions} from '@sveltejs/kit';
import Cookie from 'cookie'
import {v2} from './lib/http';

export async function handle(
  {event, resolve}: {event: RequestEvent, resolve: (event: RequestEvent, opts?: ResolveOptions) => Promise<Response>}
): Promise<Response> {

  const response = await resolve(event);
  // console.log(v2.defaults.headers)

  // const token = Cookie.parse(event.request?.headers?.get('cookie') ?? '')
  // console.log('-=-=-=-=-=-=-=-=- hooks token\n', token, '\naccess', token['X-AUTH-TOKEN'])
  // if ('X-AUTH-TOKEN' in token) {
  //   api.defaults.headers.common['Authorization'] = `Bearer ${token['X-AUTH-TOKEN']}`
  // }
  //
  // console.log('============ 0\nrequest.header', event?.request.headers)
  // console.log('============ 1\nhooks handle: response', response)
  // console.log('============ 2\nrequest.locals', event.locals)

  return response;
}

/** @type {import('@sveltejs/kit').HandleError} */
export function handleError({error, event}: { error: Error & { frame?: string }; event: RequestEvent }) {
  console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%% handleError %%%%%%%%%%%%%%%%%%%%%%')
  console.log('error', error)
  // console.log('event', event)
  console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%% // handleError %%%%%%%%%%%%%%%%%%%%%%')

}
