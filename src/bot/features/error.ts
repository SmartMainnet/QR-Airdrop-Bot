import { Composer } from 'grammy'
import type { Context } from '#root/bot/context.js'
import { logHandle } from '#root/bot/helpers/logging.js'

const composer = new Composer<Context>()

const feature = composer.chatType('private')

feature.command('error', logHandle('command-error'), (ctx) => {
  throw new Error('Error')
})

export { composer as errorFeature }
