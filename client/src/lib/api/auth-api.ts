import type {LoginCredentialRequest, LoginTokenResponse} from '$types/user';
import {clientFetch} from '../fetch/client-fetch';
import type {ServerLoadEvent} from '@sveltejs/kit';
import {authFetch} from '../fetch/auth-fetch';

async function signin(request: LoginCredentialRequest): Promise<LoginTokenResponse> {
  // const res = await fetch('http://localhost:5100/api/v2/auth/login', {
  //   method: 'POST',
  //   headers: {'Content-Type': 'application/json'},
  //   body: JSON.stringify(request),
  //   credentials: 'include',
  // })
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
  console.log('hello_client res', res)
  let data = await res.json()
  console.log('hello_client', data)

  return data
}

async function hello_server(event: ServerLoadEvent): Promise<any> {
  const res = await authFetch.get(event, '/hello')
  let data = await res.json()
  console.log('hello_server', data)

  return data
}

export {
  signin,
  hello_client,
  hello_server,
}
