import { z } from 'zod'

export const orderBookRequestSchema = z.object({
    instrumentId: z.string().min(1, 'instrumentId обязателен'),
    depth: z.union([
        z.literal(1),
        z.literal(10),
        z.literal(20),
        z.literal(30),
        z.literal(40),
        z.literal(50),
    ]),
})
