import jwt, {JwtPayload, TokenExpiredError, VerifyErrors} from 'jsonwebtoken'
import {NextFunction, Request, Response} from 'express';

const ACCESS_TOKEN_DURATION_SEC = 10 // 20s
const REFRESH_TOKEN_DURATION_SEC = 20 // 1m

function generateToken(subject: string, issuer?: string) {
  const SECRET = process.env.TOKEN_SECRET as string

  const access = jwt.sign({
    sub: subject,
    iss: issuer,
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
  let token = req.headers.authorization?.substring(7)

  // console.log('auth middleware token', token, '\n==================req', req, '\n==================req.cookies', req.cookies)
  // sveltekit server-side request 인 경우 `X-AUTH-TOKEN` cookie 에서 가져와야 한다!
  if (!token && 'X-AUTH-TOKEN' in req.cookies) {
    token = req.cookies['X-AUTH-TOKEN']
    console.log('token from cookie!', token)
  }

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
    if (e instanceof TokenExpiredError) {
      res.status(403).json({error: e.message});
    } else {
      res.status(401).json({error: `Unauthorized: ${(e as VerifyErrors).message}`});
    }
  }
}

export {
  generateToken,
  verifyToken,
  authenticationMiddleware,
}
