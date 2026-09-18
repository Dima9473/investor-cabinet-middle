import { z } from 'zod'

/** Ответ POST /chat */
export const chatResponseSchema = z.object({
    message: z.object({
        role: z.literal('assistant'),
        content: z.string(),
    }),
    model: z.string().optional(),
    /** Были ли подмешаны агрегированные метрики портфеля */
    portfolioContextUsed: z.boolean(),
})
