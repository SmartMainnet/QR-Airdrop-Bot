import type { Middleware } from 'grammy'
import type { Update } from '@grammyjs/types'
import type { Context } from '#root/bot/context.js'
import { updateHandledCounter } from '#root/metrics.js'

export function getUpdateInfo(ctx: Context): Omit<Update, 'update_id'> {
  const { update_id, ...update } = ctx.update

  return update
}

export function logHandle(id: string): Middleware<Context> {
  return (ctx, next) => {
    updateHandledCounter.inc({
      from_id: ctx.from?.id,
      chat_id: ctx.chat?.id,
      handler_id: id,
    });

    ctx.logger.info({
      msg: `Handle "${id}"`,
      ...(id.startsWith('unhandled') ? { update: getUpdateInfo(ctx) } : {}),
    })

    return next()
  }
}
