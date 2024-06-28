import { InlineKeyboard } from 'grammy'
import { createConversation } from '@grammyjs/conversations'
import type { Conversation } from '@grammyjs/conversations'
import type { Context } from '#root/bot/context.js'
import { i18n } from '#root/bot/i18n.js'
import { getWalletInfo, openAirdropInfo } from '../utils/airdrop.js'
import { Address } from '../classes/Address.js'
import { addWalletAddress } from '../../../mongo/methods/wallets.js'

export const WALLET_CONNECT_CONVERSATION = 'wallet_connect'

const wallet = {
  address: '',
  balance: 0,
}

export function walletConnectConversation() {
  return createConversation(
    async (conversation: Conversation<Context>, ctx: Context) => {
      await conversation.run(i18n)
      await ctx.deleteMessage()
      await selectAddress(conversation, ctx)
    },
    WALLET_CONNECT_CONVERSATION
  )
}

const selectAddress = async (
  conversation: Conversation<Context>,
  ctx: Context,
  error_comment: string = ''
): Promise<any> => {
  const messageQuestion = await ctx.reply(
    ctx.t('connect.select_address', {
      error_comment: error_comment
        ? '\n\n' + ctx.t('connect.error_comment', { error_comment })
        : '',
    }),
    {
      reply_markup: new InlineKeyboard().text(
        ctx.t('button.back'),
        'back_to_airdrop_info'
      ),
    }
  )

  ctx = await conversation.wait()
  const { message, callback_query } = ctx.update
  const text = message?.text
  const data = callback_query?.data

  if (text) {
    await ctx.api.deleteMessage(message.chat.id, message.message_id)
    await ctx.api.deleteMessage(messageQuestion.chat.id, messageQuestion.message_id)

    const address = text
    const walletInfo = await conversation.external(() => getWalletInfo(address))

    if (!walletInfo.is_wallet) {
      return await selectAddress(
        conversation,
        ctx,
        ctx.t('connect.wallet_not_found')
      )
    }

    wallet.address = walletInfo.address
    wallet.balance = walletInfo.balance

    return await previewAddress(conversation, ctx)
  } else if (data === 'back_to_airdrop_info') {
    return await openAirdropInfo(ctx)
  } else {
    return await ctx.api.deleteMessage(
      messageQuestion.chat.id,
      messageQuestion.message_id
    )
  }
}

async function previewAddress(conversation: Conversation<Context>, ctx: Context) {
  const messageQuestion = await ctx.reply(
    ctx.t('connect.preview_address', {
      short_address: Address.short(wallet.address),
      address: wallet.address,
      balance: wallet.balance,
    }),
    {
      link_preview_options: { is_disabled: true },
      reply_markup: new InlineKeyboard()
        .text(ctx.t('button.add_address'), 'add_address')
        .text(ctx.t('button.cancel'), 'back_to_airdrop_info')
        .row()
        .text(ctx.t('button.select_address'), 'select_address'),
    }
  )

  ctx = await conversation.wait()
  const { callback_query } = ctx.update
  const data = callback_query?.data

  if (data === 'add_address') {
    await addWalletAddress(callback_query!.from.id, wallet.address)
    return await openAirdropInfo(ctx)
  } else if (data === 'select_address') {
    await ctx.api.deleteMessage(messageQuestion.chat.id, messageQuestion.message_id)
    return await selectAddress(conversation, ctx)
  } else if (data === 'back_to_airdrop_info') {
    return await openAirdropInfo(ctx)
  } else {
    return await ctx.api.deleteMessage(
      messageQuestion.chat.id,
      messageQuestion.message_id
    )
  }
}
