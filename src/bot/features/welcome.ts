import { Composer } from 'grammy'
import { limitMiddleware, logHandle } from '../helpers/index.js'
import {
  checkSubscriptions,
  openAirdropCheck,
  openAirdropInfo,
} from '../utils/index.js'
import {
  createUser,
  getDocumentByReferralUserId,
  getUserByUserId,
  newReferral,
  setReferralComplied,
} from '../../../mongo/methods/index.js'
import type { Context } from '../context.js'
import { config } from '#root/config.js'

const composer = new Composer<Context>()
const feature = composer.chatType('private')

feature.command('start', logHandle('command-start'), async ctx => {
  const user = ctx.from
  const referrerId = Number(ctx.match)

  await createUser(user)

  if (referrerId) {
    if (user.id === referrerId) {
      return await ctx.reply(ctx.t('invite.self'))
    }

    const referrer = await getUserByUserId(referrerId)

    if (!referrer) {
      return await ctx.reply(ctx.t('invite.nonexistent'))
    }

    const document = await getDocumentByReferralUserId(user.id)

    if (!document) {
      await newReferral(referrerId, user.id)

      const fullName = `${user.first_name}${
        user.last_name ? ` ${user.last_name}` : ''
      }`

      await ctx.api.sendMessage(
        referrerId,
        ctx.t('referral.new', {
          link: `tg://user?id=${user.id}`,
          full_name: fullName,
        })
      )

      await openAirdropCheck(ctx)
    } else if (!document.complied) {
      await openAirdropCheck(ctx)
    } else {
      await openAirdropInfo(ctx)
    }
  } else {
    const document = await getDocumentByReferralUserId(user.id)

    if (!document) {
      await ctx.reply(ctx.t('welcome'))
    } else if (!document.complied) {
      await openAirdropCheck(ctx)
    } else {
      await openAirdropInfo(ctx)
    }
  }
})

feature.callbackQuery(
  'check_subscriptions',
  limitMiddleware,
  logHandle('keyboard-check-subscriptions'),
  async ctx => {
    const { callback_query } = ctx.update
    const user = callback_query.from

    const document = await getDocumentByReferralUserId(user.id)

    if (document?.complied) {
      return await ctx.editMessageText(ctx.t('airdrop.already'))
    }

    const check = await checkSubscriptions(ctx, user)

    if (check) {
      await ctx.answerCallbackQuery(ctx.t('alert.you_subscribed'))
      const document = await setReferralComplied(user.id)

      const fullName = `${user.first_name}${
        user.last_name ? ` ${user.last_name}` : ''
      }`

      await ctx.api.sendMessage(
        document.referrer_user_id,
        ctx.t('referral.complied', {
          link: `tg://user?id=${user.id}`,
          full_name: fullName,
          amount: config.REWARD,
        })
      )
      await openAirdropInfo(ctx)
    } else {
      await ctx.answerCallbackQuery(ctx.t('alert.you_not_subscribed'))
    }
  }
)

feature.callbackQuery(
  'update_airdrop_info',
  logHandle('keyboard-update-airdrop-info'),
  async ctx => {
    await openAirdropInfo(ctx)
  }
)

export { composer as welcomeFeature }
