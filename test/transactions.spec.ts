import { afterAll, beforeAll, test } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { describe } from 'node:test'


describe('Transactions route', () => {

    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    test('User can do a transaction', async () => {
        await request(app.server) //o node sempre está rodando um servidor, precisamos colocar como parâmetro um server do node.
            .post('/transactions')
            .send({
                title: 'New transaction',
                amount: 500,
                type: 'credit'
            }).expect(201)
    })

})