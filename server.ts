import 'dotenv/config'

import Koa from 'koa'
import Logger from 'koa-logger'
import Cors from '@koa/cors'

import apiRoutes from './routes/api'
import { PORT } from './lib/constants/env'

const app = new Koa()

app.use(Logger())
app.use(Cors())

const router = apiRoutes()

app.use(router.routes()).use(router.allowedMethods())

app.listen(PORT, function () {
    console.log('==> 🌎  Listening on port %s. Visit http://localhost:%s/', PORT, PORT)
})
