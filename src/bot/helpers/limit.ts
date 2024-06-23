import { limit } from '@grammyjs/ratelimiter'
import { RedisType } from '@grammyjs/ratelimiter/out/typesAndDefaults.js'
import { Context } from '../context.js'

export const limitMiddleware = limit<Context, RedisType>({
  limit: 1,
  timeFrame: 15000,
  alwaysReply: true,
  onLimitExceeded: async (ctx: Context) => {
    await ctx.answerCallbackQuery(ctx.t('check_limit', { seconds: 15 }))
  },
})
