import { z } from 'zod'

import { quotationSchema } from '../portfolio/moneyValue'

export const candlesResponseSchema = z.object({
    candles: z.array(
        z.object({
            open: quotationSchema.optional(),
            high: quotationSchema.optional(),
            low: quotationSchema.optional(),
            close: quotationSchema.optional(),
            volume: z.number(),
            time: z.string(),
            isComplete: z.boolean(),
            candleSourceType: z.number(),
        }),
    ),
})
