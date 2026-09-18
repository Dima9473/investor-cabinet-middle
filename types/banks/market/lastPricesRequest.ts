/** Тело POST /quotes/last-prices */
export type LastPricesRequest = {
    instrumentIds: string[]
    lastPriceType?: 'LAST_PRICE_EXCHANGE' | 'LAST_PRICE_DEALER'
}
