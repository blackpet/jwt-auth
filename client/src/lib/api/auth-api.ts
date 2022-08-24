import type {LoginCredentialRequest, LoginTokenResponse, UserClaimsResponse} from '$types/user';
import JsCookies from 'js-cookie';

async function signin(request: LoginCredentialRequest): Promise<LoginTokenResponse> {
  // const res = await v1.post('/login', request, {
  //   withCredentials: true,
  // })
  const res = await fetch('http://localhost:5100/api/v2/auth/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(request),
    credentials: 'include',
  })
  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message)
  }
  console.log('client/signin', data)
  // if ('access' in data) v1.defaults.headers.common['Authorization'] = `Bearer ${data.access}`
  return data
}

async function getUser(): Promise<UserClaimsResponse> {
  // const res = await v2.get('/user')
  const res = await fetch('http://localhost:5100/api/v2/user', {
    headers: {'Authorization': `Bearer ${JsCookies.get('X-AUTH-TOKEN')}`},
  })
  return await res.json()
}

export {
  signin,
  getUser,
}
