import express from 'express'
import env from './config/env.js'
import errorHandler from './middlewares/error-handler.js'
import './cronejobs/crone-jobs.js'
import router from './router.js'
import { StatusModel } from './models/statuses.js'
import { getModmeToken } from './services/modme/get-token.js'

const app = express()
const { PORT } = env

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/okk', async (req, res) => {
    const token = await getModmeToken()

    return res.json(token)
})

app.use('/', router)


app.use(errorHandler)

app.listen(PORT, () => console.log(`Server is running ${PORT}`))