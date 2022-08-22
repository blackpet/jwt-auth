import {api} from '../http';
import type {LoginCredentialRequest, LoginTokenResponse, UserClaimsResponse} from '$types/user';

async function signin(request: LoginCredentialRequest): Promise<LoginTokenResponse> {
  const res = await api.post('/login', request, {
    withCredentials: true,
  })
  return res.data
}

async function getUser(): Promise<UserClaimsResponse> {
  const res = await api.get('/user')
  return res.data
}

export {
  signin,
  getUser,
}
