import { z } from 'zod'

import { quotationSchema } from '../portfolio/moneyValue'

const orderSchema = z.object({
    price: quotationSchema.optional(),
    quantity: z.string(),
})

export const orderBookResponseSchema = z.object({
    figi: z.string(),
    instrumentUid: z.string(),
    depth: z.number(),
    bids: z.array(orderSchema),
    asks: z.array(orderSchema),
    lastPrice: quotationSchema.optional(),
    closePrice: quotationSchema.optional(),
    limitUp: quotationSchema.optional(),
    limitDown: quotationSchema.optional(),
    lastPriceTs: z.string(),
    closePriceTs: z.string(),
    orderbookTs: z.string(),
})
