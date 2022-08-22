import type {RequestEvent, ResolveOptions} from '@sveltejs/kit';

export async function handle(
  {event, resolve}: {event: RequestEvent, resolve: (event: RequestEvent, opts?: ResolveOptions) => Promise<Response>}
): Promise<Response> {

  const response = await resolve(event);
  // const token = Cookies.parse(response?.headers?.get('set-cookie') ?? '')
  // console.log('-=-=-=-=-=-=-=-=- token\n', token)
  //
  // console.log('============ 0\nrequest.header', event?.request.headers)
  // console.log('============ 1\nhooks handle: response', response)
  // console.log('============ 2\nrequest.locals', event.locals)

  return response
}
