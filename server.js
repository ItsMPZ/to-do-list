import express from 'express'
const app = express()
import dotenv from 'dotenv'
dotenv.config()
import 'express-async-errors'
import morgan from 'morgan'

import { dirname } from 'path'
import { fileURLToPath } from 'url'
import path from 'path'

import helmet from 'helmet'
import xss from 'xss-clean'
import mongoSanitize from 'express-mongo-sanitize'

//
import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'
import authenticateUserMiddleware from './middleware/auth.js'


//db
import connectDB from './db/connect.js'

//routers
import authRouter from './routes/authRoutes.js'
import taskRouter from "./routes/taskRouter.js"
import userRouter from "./routes/userRouter.js"


if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'))
}

const __dirname = dirname(fileURLToPath(import.meta.url))

//middlewares
// only when ready to deploy
app.use(express.static(path.resolve(__dirname, './client/build')))

app.use(express.json())
app.use(helmet())
app.use(xss())
app.use(mongoSanitize())

//routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/tasks', authenticateUserMiddleware, taskRouter)
app.use('/api/v1/users', userRouter)

// only when ready to deploy
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/build', 'index.html'))
})

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

//starting server
const port = process.env.PORT || 5000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(port, () => {
        console.log(`Server is listening on port ${port}...`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()