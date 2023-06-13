import "dotenv/config"
import { z } from "zod"

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('production'), //enum pode ser alguma das variáveis
    DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
    DATABASE_URL: z.string(),
    PORT: z.coerce.number().default(3333), // coerce é transforma qualquer dado, no caso transformamos em number()
})

const _env = envSchema.safeParse(process.env)

if(_env.success === false){
    console.error('😢 Invalid environment variables', _env.error.format())

    throw new Error('Invalid environment variable')
}

export const env = _env.data