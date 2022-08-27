import type {LoginCredentialRequest, LoginTokenResponse} from '$types/user';
import {clientFetch} from '../fetch/client-fetch';
import type {ServerLoadEvent} from '@sveltejs/kit';
import {serverFetch} from '../fetch/server-fetch';

async function signin(request: LoginCredentialRequest): Promise<LoginTokenResponse> {
  const res = await clientFetch.post('/auth/login', request, {credentials: 'include',})
  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message)
  }
  console.log('client/signin', data)
  // if ('access' in data) v1.defaults.headers.common['Authorization'] = `Bearer ${data.access}`
  return data
}

async function hello_client(): Promise<any> {
  const res = await clientFetch.get('/hello')
  let data = await res.json()

  return data
}

async function hello_server(event: ServerLoadEvent): Promise<any> {
  const res = await serverFetch.get(event, '/hello')
  let data = await res.json()

  return data
}

export {
  signin,
  hello_client,
  hello_server,
}
