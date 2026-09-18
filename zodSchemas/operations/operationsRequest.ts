import { z } from 'zod'

/** Тело POST /operations/:bankName — проверяется до обращения к T-Bank API */
export const operationsRequestSchema = z.object({
    accountId: z
        .string({ required_error: 'accountId обязателен' })
        .min(1, 'accountId обязателен'),
    from: z.string().optional(),
    to: z.string().optional(),
    state: z.string().optional(),
    figi: z.string().optional(),
})
