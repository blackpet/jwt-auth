import './config/env-config'
import express from 'express'
import cors from 'cors'
import {globalErrorHandler} from './config/error-handler';
import ApiRouter from './routes/api-router';
import cookieParser from 'cookie-parser';

const port = process.env.PORT || 5100
const app = express()

app.set('trust proxy', true)
app.use(cors({
  origin: 'http://localhost:5173',
  methods: '*',
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}))
app.use(express.json())
app.use(cookieParser())

// route
app.use('/api', ApiRouter)

// error handling:: must place at last
app.use(globalErrorHandler)

app.listen(port, () => console.log(`server listen on ${port}`))
