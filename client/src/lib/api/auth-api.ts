import {api} from '../http';
import type {LoginCredentialRequest, LoginTokenResponse, UserClaimsResponse} from '$types/user';

async function signin(request: LoginCredentialRequest): Promise<LoginTokenResponse> {
  const res = await api.post('/auth/login', request, {
    withCredentials: true,
  })
  if (res.data.access) api.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`
  return res.data
}

async function getUser(): Promise<UserClaimsResponse> {
  const res = await api.get('/v1/user')
  return res.data
}

export {
  signin,
  getUser,
}
