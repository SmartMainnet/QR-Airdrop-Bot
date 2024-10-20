import process from 'node:process'
import z from 'zod'
import { parseEnv, port } from 'znv'
import { API_CONSTANTS } from 'grammy'

try {
  process.loadEnvFile()
} catch {
  // No .env file found
}

function createConfigFromEnvironment(environment: NodeJS.ProcessEnv) {
  const config = parseEnv(environment, {
    NODE_ENV: z.enum(['development', 'production']),
    MONGODB_URI: z.string(),
    LOG_LEVEL: z
      .enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent'])
      .default('info'),
    BOT_MODE: {
      schema: z.enum(['polling', 'webhook']),
      defaults: {
        production: 'webhook' as const,
        development: 'polling' as const,
      },
    },
    BOT_TOKEN: z.string(),
    BOT_WEBHOOK: z.string().default(''),
    BOT_WEBHOOK_SECRET: z.string().default(''),
    BOT_SERVER_HOST: z.string().default('0.0.0.0'),
    BOT_SERVER_PORT: port().default(80),
    BOT_ALLOWED_UPDATES: z.array(z.enum(API_CONSTANTS.ALL_UPDATE_TYPES)).default([]),
    BOT_ADMINS: z.array(z.number()).default([]),
    INLINE_QUERY_CACHE_TIME: z.number().default(1),
    REWARD: z.number(),
    PHOTO: z
      .string()
      .default(
        'AgACAgIAAxkBAAMnZnI5UOmUWcsJAlrh3MCC5XQ3TQsAAqvbMRvH85BLKDGWA1ICNQIBAAMCAAN5AAM1BA'
      ),
    TONAPI_URL: z.string().default('https://tonapi.io/v2'),
    TONAPI_KEY: z
      .string()
      .default(
        'AFPJTKEBPOX3AIYAAAAKA2HWOTRNJP5MUCV5DMDCZAAOCPSAYEYS3CILNQVLF2HWKED6USY'
      ),
    LEADERBOARD: z.string().default('https://next-leaderboard.vercel.app'),
  })

  if (config.BOT_MODE === 'webhook') {
    // validate webhook url in webhook mode
    z.string()
      .url()
      .parse(config.BOT_WEBHOOK, {
        path: ['BOT_WEBHOOK'],
      })
    // validate webhook secret in webhook mode
    z.string()
      .min(1)
      .parse(config.BOT_WEBHOOK_SECRET, {
        path: ['BOT_WEBHOOK_SECRET'],
      })
  }

  return {
    ...config,
    isDev: process.env.NODE_ENV === 'development',
    isProd: process.env.NODE_ENV === 'production',
  }
}

export type Config = ReturnType<typeof createConfigFromEnvironment>

export const config = createConfigFromEnvironment(process.env)
