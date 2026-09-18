import { z } from 'zod'

export const moneyValueSchema = z.object({
    currency: z.string(),
    units: z.string(),
    nano: z.number(),
})

export const quotationSchema = z.object({
    units: z.string(),
    nano: z.number(),
})
