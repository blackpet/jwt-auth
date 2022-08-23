import './config/env-config'
import express, {Request, Response} from 'express'
import cors from 'cors'
import {globalErrorHandler} from './config/error-handler';
import cookieParser from 'cookie-parser';
import {authenticationMiddleware} from './lib/authentication';
import ApiRouter from './routes/api-router';
import AuthRouter from './routes/auth-router';

const port = process.env.PORT || 5100
const app = express()

app.set('trust proxy', true)
app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  methods: '*',
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}))
app.use(express.json())
app.use(cookieParser())

// route
app.get('/hello', (req: Request, res: Response) => {
  res.json({message: 'hello API!'})
})

app.use('/api/v2/auth', AuthRouter)
app.use('/api/v2', authenticationMiddleware, ApiRouter)

// error handling:: must place at last
app.use(globalErrorHandler)

app.listen(port, () => console.log(`server listen on ${port}`))
