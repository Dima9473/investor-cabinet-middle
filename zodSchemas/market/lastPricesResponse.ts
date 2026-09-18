import { z } from 'zod'

import { quotationSchema } from '../portfolio/moneyValue'

export const lastPricesResponseSchema = z.object({
    lastPrices: z.array(
        z.object({
            figi: z.string(),
            instrumentUid: z.string(),
            price: quotationSchema.optional(),
            time: z.string(),
            lastPriceType: z.number(),
        }),
    ),
})
