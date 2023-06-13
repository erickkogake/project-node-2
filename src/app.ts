import fastify from "fastify"
import cookie from '@fastify/cookie'
import { transationsRoutes } from "./routes/transactions"

export const app = fastify()

app.register(cookie)
app.register(transationsRoutes, {
    prefix: 'transactions',
})
