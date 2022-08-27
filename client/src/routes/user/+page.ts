import {clientFetch} from '../../lib/fetch/client-fetch';

/** @type {import('./$types').PageLoad} */
export async function load({data}: {data: any}) {
  console.log('user/+page.ts data', data)
  const res = await clientFetch.get('/user')
  const clientData = await res.json()
  return {server: data, client: clientData}
}
