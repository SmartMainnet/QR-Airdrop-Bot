import { MemorySessionStorage, Bot as TelegramBot, session } from 'grammy'
import type { BotConfig, StorageAdapter } from 'grammy'
import { autoChatAction } from '@grammyjs/auto-chat-action'
import { hydrate } from '@grammyjs/hydrate'
import { hydrateReply, parseMode } from '@grammyjs/parse-mode'
import type { ChatMember } from '@grammyjs/types'
import type { Context, SessionData } from '#root/bot/context.js'
import { createContextConstructor } from '#root/bot/context.js'
import {
  adminFeature,
  airdropFeature,
  errorFeature,
  inviteFeature,
  languageFeature,
  unhandledFeature,
  welcomeFeature,
} from '#root/bot/features/index.js'
import { errorHandler } from '#root/bot/handlers/index.js'
import { i18n, isMultipleLocales } from '#root/bot/i18n.js'
import { metrics, updateLogger } from '#root/bot/middlewares/index.js'
import { config } from '#root/config.js'
import { logger } from '#root/logger.js'

interface Options {
  sessionStorage?: StorageAdapter<SessionData>
  config?: Omit<BotConfig<Context>, 'ContextConstructor'>
}

export function createBot(token: string, options: Options = {}) {
  const { sessionStorage } = options
  const bot = new TelegramBot(token, {
    ...options.config,
    ContextConstructor: createContextConstructor({ logger }),
  })
  const protectedBot = bot.errorBoundary(errorHandler)

  // Middlewares
  bot.api.config.use(parseMode('HTML'))

  if (config.isDev) protectedBot.use(updateLogger())

  protectedBot.use(metrics())
  protectedBot.use(autoChatAction(bot.api))
  protectedBot.use(hydrateReply)
  protectedBot.use(hydrate())
  protectedBot.use(
    session({
      initial: () => ({}),
      storage: sessionStorage,
    })
  )
  protectedBot.use(inviteFeature)
  protectedBot.use(i18n)

  // Handlers
  protectedBot.use(welcomeFeature)
  protectedBot.use(airdropFeature)
  protectedBot.use(adminFeature)
  protectedBot.use(errorFeature)

  if (isMultipleLocales) protectedBot.use(languageFeature)

  // must be the last handler
  protectedBot.use(unhandledFeature)

  return bot
}

export type Bot = ReturnType<typeof createBot>
