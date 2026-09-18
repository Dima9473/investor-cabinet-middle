import { z } from 'zod'

export const lastPricesRequestSchema = z.object({
    instrumentIds: z
        .array(z.string().min(1))
        .min(1, 'instrumentIds должен содержать хотя бы один идентификатор'),
    lastPriceType: z.enum(['LAST_PRICE_EXCHANGE', 'LAST_PRICE_DEALER']).optional(),
})
