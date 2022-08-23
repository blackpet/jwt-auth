import express, {Request, Response} from 'express';
import {generateToken, verifyToken} from '../lib/authentication';
import {JwtPayload, VerifyErrors} from 'jsonwebtoken';
import {v4 as uuid} from 'uuid';

const router = express.Router()

router.post('/login', (req: Request, res: Response) => {
  const data = req.body

  // TODO: validate credential
  if (data.userId !== 'admin') {
    res.status(401).json({message: '[/auth/login] invalid credential!'})
    return
  }

  // TODO: user's unique id!!
  const subject = uuid()
  const tokens = generateToken(subject, data.userId)

  res.cookie('X-AUTH-TOKEN', tokens.access)
  res.cookie('REFRESH-TOKEN', tokens.refresh)

  res.json(tokens)
})

router.post('/refresh', async (req: Request, res: Response) => {
  const access = req.headers.authorization?.substring(7)
  const refresh = req.body.token
  console.log('access', access)
  console.log('refresh', refresh)

  try {
    const claims: JwtPayload = (await verifyToken(refresh)) as JwtPayload
    console.log('refresh claims', claims)

    // TODO: retrieve user from db!!
    const issuer = 'admin'
    const newTokens = generateToken(claims.sub as string, issuer)

    res.cookie('X-AUTH-TOKEN', newTokens.access)
    res.cookie('REFRESH-TOKEN', newTokens.refresh)

    res.json(newTokens)
  } catch (e) {
    res.status(401).json({error: `[/auth/refresh] Unauthorized: ${(e as VerifyErrors).message}`})
    return
  }
})

export default router