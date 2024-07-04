import { InlineKeyboard } from 'grammy'
import {
  getReferralsByReferrerUserId,
  getWalletAddress,
} from '../../../mongo/methods/index.js'
import { subscriptions } from './index.js'
import { Context } from '../context.js'
import { config } from '#root/config.js'
import { tonapi } from '../axios/tonapi.js'
import { Address } from '../classes/Address.js'

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

  const wallet = await getWalletAddress(userId!)
  const referrals = await getReferralsByReferrerUserId(userId!)
  const compliedReferrals = referrals.filter(referral => referral.complied)

  await ctx.deleteMessage()
  await ctx.replyWithPhoto(config.PHOTO, {
    caption: ctx.t('airdrop.info', {
      balance: compliedReferrals.length * config.REWARD + config.REWARD,
      amount: config.REWARD,
      address: wallet
        ? '\n\n' +
          ctx.t('connect.address', {
            short_address: Address.short(wallet.address),
            address: wallet.address,
          })
        : '',
      referral_link: `https://t.me/${ctx.me.username}?start=${userId}`,
      referrals: referrals.length,
      complied_referrals: compliedReferrals.length,
    }),
    reply_markup: new InlineKeyboard()
      .webApp('Таблица лидеров', `${config.LEADERBOARD}?user_id=${userId}`)
      .row()
      .switchInline(ctx.t('button.send_invite'), String(userId))
      .row()
      .text(
        wallet ? ctx.t('button.change') : ctx.t('button.connect'),
        wallet ? 'change_wallet' : 'connect_wallet'
      )
      .row()
      .text(ctx.t('button.update'), 'update_airdrop_info'),
  })
}

export const getWalletInfo = async (address: string) => {
  try {
    const { data } = await tonapi.get(`/accounts/${address}`)

    return {
      is_wallet: data.is_wallet ?? false,
      address: Address.getNonBounceable(data.address),
      balance: data.balance / 1000000000 ?? 0,
    }
  } catch (e) {
    return {
      is_wallet: false,
      address: '',
      balance: 0,
    }
  }
}
