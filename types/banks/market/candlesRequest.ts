/** Тело POST /quotes/candles */
export type CandlesRequest = {
    instrumentId: string
    from: string
    to: string
    interval: string
    limit?: number
}
