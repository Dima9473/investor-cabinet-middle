import { z } from 'zod'

/** Тело POST /portfolio и /portfolio/positions */
export const portfolioRequestSchema = z.object({
    accountId: z
        .string({ required_error: 'accountId обязателен' })
        .min(1, 'accountId обязателен'),
    currency: z.enum(['RUB', 'USD', 'EUR']).optional(),
})
