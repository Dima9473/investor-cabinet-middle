import { z } from 'zod'

/** Тело POST /analysis/portfolio — те же поля, что у операций */
export const portfolioAnalysisRequestSchema = z.object({
    accountId: z
        .string({ required_error: 'accountId обязателен' })
        .min(1, 'accountId обязателен'),
    from: z.string().optional(),
    to: z.string().optional(),
    state: z.string().optional(),
    figi: z.string().optional(),
})
