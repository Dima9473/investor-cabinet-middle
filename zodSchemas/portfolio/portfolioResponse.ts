import { z } from 'zod'

import { moneyValueSchema, quotationSchema } from './moneyValue'

const portfolioPositionSchema = z.object({
    figi: z.string(),
    instrumentType: z.string(),
    quantity: quotationSchema.optional(),
    averagePositionPrice: moneyValueSchema.optional(),
    expectedYield: quotationSchema.optional(),
    currentNkd: moneyValueSchema.optional(),
    currentPrice: moneyValueSchema.optional(),
    averagePositionPriceFifo: moneyValueSchema.optional(),
    blocked: z.boolean(),
    blockedLots: quotationSchema.optional(),
    positionUid: z.string(),
    instrumentUid: z.string(),
    varMargin: moneyValueSchema.optional(),
    expectedYieldFifo: quotationSchema.optional(),
    dailyYield: moneyValueSchema.optional(),
})

/** Ответ POST /portfolio */
export const portfolioResponseSchema = z.object({
    accountId: z.string(),
    totalAmountShares: moneyValueSchema,
    totalAmountBonds: moneyValueSchema,
    totalAmountEtf: moneyValueSchema,
    totalAmountCurrencies: moneyValueSchema,
    totalAmountFutures: moneyValueSchema,
    totalAmountOptions: moneyValueSchema,
    totalAmountSp: moneyValueSchema,
    totalAmountPortfolio: moneyValueSchema,
    expectedYield: quotationSchema.optional(),
    dailyYield: moneyValueSchema.optional(),
    dailyYieldRelative: quotationSchema.optional(),
    positions: z.array(portfolioPositionSchema),
    virtualPositions: z.array(z.record(z.unknown())),
})
