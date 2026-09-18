import { z } from 'zod'

/** Интервалы свечей T-Invest API (CandleInterval) */
const candleIntervalEnum = z.enum([
    'CANDLE_INTERVAL_UNSPECIFIED',
    'CANDLE_INTERVAL_1_MIN',
    'CANDLE_INTERVAL_2_MIN',
    'CANDLE_INTERVAL_3_MIN',
    'CANDLE_INTERVAL_5_MIN',
    'CANDLE_INTERVAL_10_MIN',
    'CANDLE_INTERVAL_15_MIN',
    'CANDLE_INTERVAL_30_MIN',
    'CANDLE_INTERVAL_HOUR',
    'CANDLE_INTERVAL_2_HOUR',
    'CANDLE_INTERVAL_4_HOUR',
    'CANDLE_INTERVAL_DAY',
    'CANDLE_INTERVAL_WEEK',
    'CANDLE_INTERVAL_MONTH',
])

export const candlesRequestSchema = z.object({
    instrumentId: z.string().min(1, 'instrumentId обязателен'),
    from: z.string().min(1, 'from обязателен'),
    to: z.string().min(1, 'to обязателен'),
    interval: candleIntervalEnum,
    limit: z.number().int().positive().optional(),
})
