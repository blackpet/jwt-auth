import jwt, {JwtPayload, VerifyErrors} from 'jsonwebtoken'
import {v4 as uuid} from 'uuid'

const ACCESS_TOKEN_DURATION_SEC = 30 // 30s
const REFRESH_TOKEN_DURATION_SEC = 60 // 1m

function generateToken(userId: string) {
  const SECRET = process.env.TOKEN_SECRET as string

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

  console.log('generateToken!!', {access, refresh})

  return {access, refresh}
}

function verifyToken(token: string): Promise<JwtPayload | string | undefined> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.TOKEN_SECRET as string, (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
      if (err) {
        console.debug('Unauthorized: token verification falied\n', err)
        return reject(err)
      } else {
        return resolve(decoded)
      }
    });
  })
}

export {
  generateToken,
  verifyToken,
}
