import * as dotenv from 'dotenv'
import util from 'node:util'
import { z } from 'zod'

dotenv.config()

const hostSchema = z.object({
  PORT: z
    .string()
    .default('3333')
    .transform((v) => parseInt(v, 10))
    .refine((v) => !isNaN(v) && v >= 0 && v <= 65535, {
      message: 'PORT must be a number between 0 and 65535',
    }),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  REDIRECT_URL: z.string().url(),
})

const dbSchema = z.object({
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_HOST_PORT: z
    .string()
    .transform((v) => parseInt(v, 10))
    .refine((v) => !isNaN(v) && v >= 0 && v <= 65535, {
      message: 'PORT must be a number between 0 and 65535',
    }),
  DATABASE_URL: z.string(),
})

const authSchema = z.object({
  ACCESS_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRATION: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_EXPIRATION: z.string(),
})

const envSchema = z.object({
  host: hostSchema,
  db: dbSchema,
  auth: authSchema,
})

const parsedEnv = envSchema.safeParse({
  host: {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    REDIRECT_URL: process.env.REDIRECT_URL,
  },
  db: {
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRES_DB: process.env.POSTGRES_DB,
    POSTGRES_HOST: process.env.POSTGRES_HOST,
    POSTGRES_HOST_PORT: process.env.POSTGRES_HOST_PORT,
    DATABASE_URL: process.env.DATABASE_URL,
  },
  auth: {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRATION: process.env.ACCESS_TOKEN_EXPIRATION,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRATION: process.env.REFRESH_TOKEN_EXPIRATION,
  },
})

if (!parsedEnv.success) {
  console.error(
    'Invalid environment variables:',
    util.inspect(parsedEnv.error.format(), { depth: null, colors: true }),
  )
  process.exit(1)
}

export const config = parsedEnv.data

export function isDev(): boolean {
  return config.host.NODE_ENV === 'development'
}
