import type {RequestEvent} from '@sveltejs/kit';
// import {generateToken} from '$lib/auth';

/**
 * @deprecated node server 로 이사감!
 * POST /api/login
 * @param request
 * @constructor
 */
// export async function POST({request, setHeaders}: RequestEvent) {
//   const data = await request.json()
//   console.log('json data', data)
//
//   // validate credential
//   if (data.userId !== 'admin') {
//     return new Response(JSON.stringify({message: 'invalid credential!'}), {status: 401})
//   }
//
//   const tokens = generateToken(data.userId)
//
//   setHeaders({
//     'set-cookie': `token=${tokens.token}; path=/;,refresh=${tokens.refresh}; path=/;`,
//   })
//
//   const response = new Response(JSON.stringify(tokens))
//   return response
// }
