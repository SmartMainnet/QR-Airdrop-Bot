import { Middleware } from "grammy";
import type { Context } from "../context.js";
import { updateCounter, updateFailedCounter } from "../../metrics.js";

export function metrics(): Middleware<Context> {
  return async (ctx, next) => {
    try {
      updateCounter.inc({
        from_id: ctx.from?.id,
        chat_id: ctx.chat?.id,
      });
      return await next();
    } catch (error) {
      updateFailedCounter.inc({
        from_id: ctx.from?.id,
        chat_id: ctx.chat?.id,
      });
      throw error;
    }
  };
}
