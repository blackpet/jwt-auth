import {v1, v2} from '../http';
import type {LoginCredentialRequest, LoginTokenResponse, UserClaimsResponse} from '$types/user';

async function signin(request: LoginCredentialRequest): Promise<LoginTokenResponse> {
  const res = await v1.post('/login', request, {
    withCredentials: true,
  })
  console.log('client/signin', res.data)
  if ('access' in res.data) v1.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`
  return res.data
}

async function getUser(): Promise<UserClaimsResponse> {
  const res = await v2.get('/user')
  return res.data
}

export {
  signin,
  getUser,
}
