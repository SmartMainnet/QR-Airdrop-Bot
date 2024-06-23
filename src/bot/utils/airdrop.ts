import { InlineKeyboard } from 'grammy'
import { getReferralsByReferrerUserId } from '../../../mongo/methods/index.js'
import { subscriptions } from './index.js'
import { Context } from '../context.js'

export const openAirdropCheck = async (ctx: Context) => {
  await ctx.reply(ctx.t('airdrop.check'), {
    reply_markup: InlineKeyboard.from(
      subscriptions.map(subscription => [
        {
          text: subscription.name,
          url: `t.me/${subscription.username.replace('@', '')}`,
        },
      ])
    )
      .row()
      .text(ctx.t('button.check_subscriptions'), 'check_subscriptions'),
  })
}

export const openAirdropInfo = async (ctx: Context) => {
  const { message, callback_query } = ctx.update
  const userId = message?.from.id || callback_query?.from.id

  const referrals = await getReferralsByReferrerUserId(userId!)
  const compliedReferrals = referrals.filter(referral => referral.complied)

  await ctx.deleteMessage()
  await ctx.replyWithPhoto(
    'AgACAgIAAxkBAAMnZnI5UOmUWcsJAlrh3MCC5XQ3TQsAAqvbMRvH85BLKDGWA1ICNQIBAAMCAAN5AAM1BA',
    {
      caption: ctx.t('airdrop.info', {
        balance: compliedReferrals.length * 50000 + 50000,
        referral_link: `https://t.me/${ctx.me.username}?start=${userId}`,
        referrals: referrals.length,
        complied_referrals: compliedReferrals.length,
      }),
      reply_markup: new InlineKeyboard()
        .switchInline(ctx.t('button.send_invite'), String(userId))
        .row()
        .text(ctx.t('button.update'), 'update_airdrop_info'),
    }
  )
}
