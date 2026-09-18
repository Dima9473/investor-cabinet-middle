import { z } from 'zod'

import { portfolioAnalysisResponseSchema } from './portfolioAnalysisResponse'

const portfolioBlockSchema = z.object({
    totalAmountPortfolio: z.number(),
    totalAmountPortfolioCurrency: z.string(),
    expectedYieldPercent: z.number().optional(),
    dailyYield: z.number().optional(),
    dailyYieldCurrency: z.string().optional(),
    dailyYieldRelativePercent: z.number().optional(),
    allocationByInstrumentType: z.record(z.number()),
    positionCount: z.number(),
    largestPositionSharePercent: z.number(),
})

const portfolioMetricsSchema = z.object({
    period: z.object({
        from: z.string().optional(),
        to: z.string().optional(),
    }),
    summary: z.object({
        totalOperations: z.number(),
        netFlowByCurrency: z.record(z.number()),
        byInstrumentType: z.record(z.number()),
        byOperationType: z.record(z.number()),
    }),
    portfolio: portfolioBlockSchema.optional(),
})

/** Полный ответ POST /analysis/portfolio */
export const portfolioAnalysisApiResponseSchema = z.object({
    bankName: z.string(),
    period: portfolioMetricsSchema.shape.period,
    metrics: portfolioMetricsSchema,
    analysis: portfolioAnalysisResponseSchema,
    portfolioSnapshotUsed: z.boolean().optional(),
})
