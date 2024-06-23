import { User } from '@grammyjs/types'
import { Context } from '../context.js'

export const subscriptions = [
  { name: 'QR News (RU)', username: '@qrNewsRU' },
  { name: 'QR Community', username: '@qrCommunity' },
]

export const checkSubscriptions = async (ctx: Context, user: User) => {
  for (const subscription of subscriptions) {
    const join = await ctx.api.getChatMember(subscription.username, user.id)
    const isJoined = join.status !== 'left'

    if (!isJoined) {
      return false
    }
  }

  return true
}
