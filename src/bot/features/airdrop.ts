import { Composer } from 'grammy'
import { getDocumentByReferralUserId } from '../../../mongo/methods/index.js'
import { openAirdropCheck, openAirdropInfo } from '../utils/index.js'
import { logHandle } from '../helpers/index.js'
import type { Context } from '../context.js'

const composer = new Composer<Context>()

const feature = composer.chatType('private')

feature.command('airdrop', logHandle('command-airdrop'), async ctx => {
  const user = ctx.from
  const document = await getDocumentByReferralUserId(user.id)

  if (!document) {
    await ctx.reply(ctx.t('airdrop.uninvited'))
  } else {
    if (!document.complied) {
      await openAirdropCheck(ctx)
    } else {
      await openAirdropInfo(ctx)
    }
  }
})

export { composer as airdropFeature }
