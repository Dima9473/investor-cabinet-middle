import { z } from 'zod'

const paymentSchema = z.object({
    nano: z.number(),
    currency: z.string(),
    units: z.string()
})

const childOperationSchema = z.object({
    instrumentUid: z.string(),
    payment: paymentSchema
})

const priceSchema = z.object({
    nano: z.number(),
    currency: z.string(),
    units: z.string()
})

const tradesSchema = z.object({
    tradeId: z.string(),
    dateTime: z.string(),
    quantity: z.string(),
    price: priceSchema
})

export const operationSchema = z.object({
    date: z.string(),
    assetUid: z.string(),
    instrumentType: z.string(),
    childOperations: z.array(childOperationSchema),
    quantity: z.string(),
    parentOperationId: z.string(),
    trades: z.array(tradesSchema),
    positionUid: z.string(),
    figi: z.string(),
    type: z.string(),
    price: priceSchema,
    instrumentUid: z.string(),
    currency: z.string(),
    payment: paymentSchema,
    id: z.string(),
    quantityRest: z.string()
})
