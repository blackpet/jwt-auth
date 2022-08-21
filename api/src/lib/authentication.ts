import jwt from 'jsonwebtoken'
import {v4 as uuid} from 'uuid'

const ACCESS_TOKEN_DURATION_SEC = 30 // 30s
const REFRESH_TOKEN_DURATION_SEC = 60 // 1m
const SECRET = process.env.TOKEN_SECRET as string

function generateToken(userId: string) {
  console.log('generateToken!! secret', process.env.TOKEN_SECRET)
  const subject = uuid()
  const access = jwt.sign({
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

  return {access, refresh}
}

export {
  generateToken,
}
