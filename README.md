# JWT-AUTHENTICATION
Sveltekit 과 Express 를 이용한 JWT 인증 프로젝트

# Structure
- Sveltekit
- Express

# Features
- [ ] [client] Login
  - [x] error message #1
- [ ] [server] Login Process
  - [x] validate credential #1
  - [x] generate accessToken, refreshToken
- [ ] [sveltekit] authorize hooks
  - [ ] validate token
  - [ ] accessToken expired, re-generate Token with refreshToken
  - [ ] persist unauthorized request with renewed Token
