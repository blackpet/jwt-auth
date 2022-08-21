import HttpException from './exception/http-exception';
import {NextFunction, Request, Response} from 'express';

function globalErrorHandler(error: HttpException, req: Request, res: Response, next: NextFunction) {
  // @ts-ignore
  req.error = error
  console.error('=========================== server error ========================\n',
    error,
    '\n=========================== // server error ========================')

  const status = error.status || 500
  const message = error.message || 'something went wrong'

  res.status(status).send({status, message})
}

export {
  globalErrorHandler,
}
