# JWT-AUTHENTICATION
Sveltekit 과 Express 를 이용한 JWT 인증 프로젝트

# Structure
- `client` Sveltekit
- `API server` Express

# Features
- `client` Login
  - [x] error message #1
  - [x] ~~axios request interceptor: append `Authentication` header~~
    - `auth-fetch` middleware with native fetch
  - [x] ~~axios response interceptor:~~ 
    - `auth-fetch` middleware with native fetch
    - [x] accessToken expired, re-generate Token with refreshToken
    - [x] re-try original request with renewed Token
- `server` Login Process
  - [x] validate credential #1
  - [x] generate accessToken, refreshToken
  - [x] authentication middleware 
  - [x] authorized router (`/api/user`)
  - [x] token refresh router
- `sveltekit` custom `auth-fetch` middleware instead of ~~authorize hooks~~ 
