import jwt from 'jsonwebtoken'
import {v4 as uuid} from 'uuid'

const SECRET = 'secret'
const ACCESS_TOKEN_DURATION_SEC = 30 // 30s
const REFRESH_TOKEN_DURATION_SEC = 60 // 1m

function generateToken(userId: string) {
  const subject = uuid()
  const token = jwt.sign({
    sub: subject,
    iss: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + ACCESS_TOKEN_DURATION_SEC
  }, SECRET)

  const refresh = jwt.sign({
    sub: subject,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + REFRESH_TOKEN_DURATION_SEC
  }, SECRET)

  return {token, refresh}
}

export {
  generateToken,
}
