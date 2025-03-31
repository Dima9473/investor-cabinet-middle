import { Context, Next } from "koa";
import { z } from 'zod';

export const validate =
  (schema: z.AnyZodObject | z.ZodOptional<z.AnyZodObject>) =>
  async (ctx: Context, next: Next) => {
    try {
      await schema.parseAsync(ctx.body);
      return await next()
    } catch (error) {
      let err = error;
      if (err instanceof z.ZodError) {
        err = err.issues.map((e) => ({ path: e.path[0], message: e.message }));
      }
      throw error
    }
  };
