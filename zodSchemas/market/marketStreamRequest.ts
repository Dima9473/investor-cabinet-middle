import { z } from 'zod'

const streamInstrumentSchema = z.object({
    instrumentId: z.string().min(1),
    figi: z.string().optional(),
})

const streamActionSchema = z.enum(['SUBSCRIBE', 'UNSUBSCRIBE'])

const candleInstrumentSchema = streamInstrumentSchema.extend({
    interval: z.string().min(1),
    waitingClose: z.boolean().optional(),
})

const orderBookInstrumentSchema = streamInstrumentSchema.extend({
    depth: z.number().int().positive(),
})

/** Тело POST /quotes/stream — хотя бы одна подписка */
export const marketStreamRequestSchema = z
    .object({
        subscribeLastPrice: z
            .object({
                action: streamActionSchema,
                instruments: z.array(streamInstrumentSchema).min(1),
            })
            .optional(),
        subscribeCandles: z
            .object({
                action: streamActionSchema,
                instruments: z.array(candleInstrumentSchema).min(1),
                waitingClose: z.boolean().optional(),
            })
            .optional(),
        subscribeOrderBook: z
            .object({
                action: streamActionSchema,
                instruments: z.array(orderBookInstrumentSchema).min(1),
            })
            .optional(),
        subscribeTrades: z
            .object({
                action: streamActionSchema,
                instruments: z.array(streamInstrumentSchema).min(1),
            })
            .optional(),
    })
    .refine(
        (body) =>
            Boolean(
                body.subscribeLastPrice ||
                    body.subscribeCandles ||
                    body.subscribeOrderBook ||
                    body.subscribeTrades,
            ),
        { message: 'Укажите хотя бы одну подписку (subscribeLastPrice, subscribeCandles, …)' },
    )
