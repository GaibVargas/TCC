import * as dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const hostSchema = z.object({
  PORT: z
    .string()
    .default('3333')
    .transform(v => parseInt(v, 10))
    .refine(v => !isNaN(v) && v >= 0 && v <= 65535, { message: 'PORT must be a number between 0 and 65535' }),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  REDIRECT_URL: z.string().url(),
})

const envSchema = z.object({
  host: hostSchema,
})

const parsedEnv = envSchema.safeParse({
  host: {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    REDIRECT_URL: process.env.REDIRECT_URL,
  },
})

if (!parsedEnv.success) {
  console.error('Invalid environment variables:', parsedEnv.error.format())
  process.exit(1)
}

export const config = parsedEnv.data

export function isDev(): boolean {
  return config.host.NODE_ENV === 'development'
}