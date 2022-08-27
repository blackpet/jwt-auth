import {hello_client} from '../../lib/api/auth-api';

/** @type {import('./$types').PageLoad} */
export async function load({data}: {data: any}) {
  const clientData = Object.fromEntries(Object.entries(await hello_client()).map(([k, v]) => [`client_${k}`, v]))
  console.log('2. +page.ts data', data)
  return {...data, ...clientData}
}
