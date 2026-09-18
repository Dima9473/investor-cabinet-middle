/** Тело POST /quotes/orderbook */
export type OrderBookRequest = {
    instrumentId: string
    depth: 1 | 10 | 20 | 30 | 40 | 50
}
