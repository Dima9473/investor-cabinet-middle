import { Context, Next } from "koa";
import { z } from 'zod';

/** Валидация тела запроса (до контроллера) */
export const validateRequest =
  (schema: z.ZodType) =>
  async (ctx: Context, next: Next) => {
    try {
      await schema.parseAsync(ctx.request.body);
      return await next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        ctx.throw(400, error.issues.map((issue) => issue.message).join('; '));
      }
      throw error;
    }
  };

/** Валидация тела ответа (после контроллера) */
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
