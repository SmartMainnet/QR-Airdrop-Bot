import { Composer, InlineKeyboard, InlineQueryResultBuilder } from 'grammy'
import { logHandle } from '../helpers/logging.js'
import type { Context } from '../context.js'
import { config } from '#root/config.js'

const composer = new Composer<Context>()

composer.inlineQuery(
  /.*/,
  logHandle('inline-query-invite'),
  async (ctx: Context) => {
    const user = ctx.from!

    if (String(ctx.match) === String(user.id)) {
      const inlineQuery = InlineQueryResultBuilder.article(
        String(user.id),
        `Приглашение на ${config.REWARD.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1,')} QR`,
        {
          thumbnail_url: 'https://i.ibb.co/SxL94Sm/QR-Logo-Blue.png',
          description:
            `Вы получите ${config.REWARD.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1,')} QR за кождого кто активирует его по вашей ссылке!`,
          reply_markup: new InlineKeyboard().url(
            `Получить ${config.REWARD.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1,')} QR`,
            `https://t.me/${ctx.me.username}?start=${user.id}`
          ),
        }
      ).text(
        `🎁 <b>Приглашение на ${config.REWARD.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1,')} $QR</b>\n\n<b>$QR</b> — это мем-токен на TON, посвящённый QR-коду. Мы стремимся собрать сплочённое комьюнити и постоянно радовать вас новыми активностями!`
      )

      await ctx.answerInlineQuery([inlineQuery], {
        cache_time: config.INLINE_QUERY_CACHE_TIME,
      })
    }
  }
)

export { composer as inviteFeature }
