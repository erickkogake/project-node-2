import { FastifyInstance } from "fastify"
import { knex } from "../database"
import crypto from "node:crypto"
import { z } from 'zod'
import { checkSessionId } from "../middlewares/caption-session-id"

export async function transationsRoutes(app: FastifyInstance) {
    app.post('/', async (req, res) => {
        // { title, amount, type: credit ou debit }

        const createTransactionsSchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit'])
        })

        const { title, amount, type } = createTransactionsSchema.parse(req.body)

        let sessionId = req.cookies.sessionId

        if (!sessionId) {
            sessionId = crypto.randomUUID()

            res.cookie('sessionId', sessionId, {
                path: '/',
                maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
            })

        }

        await knex('transaction')
            .insert({
                id: crypto.randomUUID(),
                title,
                amount: type === 'credit' ? amount : amount * -1,
                session_Id: sessionId,
            })

        return res.status(201).send()
    })

    app.get('/', { preHandler: [checkSessionId] }, async (req, res) => {
        const { sessionId } = req.cookies

        const valueTransactions = await knex('transaction')
            .where('session_id', sessionId)
            .select('*')

        return { valueTransactions }
    })

    app.get('/:id', { preHandler: [checkSessionId] }, async (req, res) => {
        const { sessionId } = req.cookies

        const getTransactionSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = getTransactionSchema.parse(req.params)

        const uniqueTransaction = await knex('transaction')
            .where({
                'id': id,
                'session_id': sessionId,
            })
            .select('*')

        return { uniqueTransaction }
    })

    app.get('/summary', async (req) => {
        const { sessionId } = req.cookies

        const summary = await knex('transaction')
            .where('session_id', sessionId)
            .sum('amount', { as: 'amount' })
            .first()

        return { summary }
    })
}