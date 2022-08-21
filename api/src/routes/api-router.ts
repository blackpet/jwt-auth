import express, {Request, Response} from 'express';
import {generateToken} from '../lib/authentication';

const router = express.Router()

router.get('/hello', (req: Request, res: Response) => {
  res.json({message: 'hello API!'})
})

router.post('/login', (req: Request, res: Response) => {
  const data = req.body

  // TODO: validate credential
  if (data.userId !== 'admin') {
    res.status(401).json({message: 'invalid credential!'})
    return
  }

  const tokens = generateToken(data.userId)

  res.cookie('foo', 'bar')
  res.cookie('X-AUTH-TOKEN', tokens.access)
  res.cookie('REFRESH-TOKEN', tokens.refresh)

  res.json(tokens)
})

export default router
