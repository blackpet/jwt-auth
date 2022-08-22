import express, {Request, Response} from 'express';

const router = express.Router()

router.get('/user', (req: Request, res: Response) => {
  const claims = res.locals['user'] // from authenticationMiddleware
  console.log('/user claims', claims)
  if (!claims) {
    throw new Error('Unauthorized')
  }

  res.json(claims)
})

export default router
