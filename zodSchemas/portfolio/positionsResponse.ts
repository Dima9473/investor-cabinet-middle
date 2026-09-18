import { z } from 'zod'

import { moneyValueSchema } from './moneyValue'

const positionsSecuritiesSchema = z.object({
    figi: z.string(),
    blocked: z.number(),
    balance: z.number(),
    positionUid: z.string(),
    instrumentUid: z.string(),
    exchangeBlocked: z.boolean(),
    instrumentType: z.string(),
})

/** Ответ POST /portfolio/positions */
export const positionsResponseSchema = z.object({
    accountId: z.string(),
    money: z.array(moneyValueSchema),
    blocked: z.array(moneyValueSchema),
    securities: z.array(positionsSecuritiesSchema),
    futures: z.array(z.record(z.unknown())),
    options: z.array(z.record(z.unknown())),
    limitsLoadingInProgress: z.boolean(),
})
