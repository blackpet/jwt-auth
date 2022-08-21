import jwt, {JwtPayload, VerifyErrors} from 'jsonwebtoken'
import {v4 as uuid} from 'uuid'
import {NextFunction, Request, Response} from 'express';

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

// express middleware for authentication
async function authenticationMiddleware(req: Request, res: Response, next: NextFunction) {
  // get Bearer token in the `Authentication` header, skip 'Bearer ' prefix
  const token = req.headers.authorization?.substring(7)

  if (!token) {
    console.error('Unauthorized: no token exists')
    res.status(401).json({error: 'Unauthorized'})
    return
  }

  try {
    const claims = await verifyToken(token)
    res.locals['user'] = claims

    next()
  } catch (e) {
    console.error('Unauthorized: token verification failed')
    res.status(401).json({error: `Unauthorized: ${(e as VerifyErrors).message}`})
    return
  }
}

export {
  generateToken,
  verifyToken,
  authenticationMiddleware,
}
