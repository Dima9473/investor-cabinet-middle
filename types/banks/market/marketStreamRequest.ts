/** Инструмент для подписки в стриме котировок */
export type MarketStreamInstrument = {
    instrumentId: string
    figi?: string
}

export type MarketStreamCandleInstrument = MarketStreamInstrument & {
    interval: string
    waitingClose?: boolean
}

export type MarketStreamOrderBookInstrument = MarketStreamInstrument & {
    depth: number
}

/** Тело POST /quotes/stream — подписки через bidirectional MarketDataStream */
export type MarketStreamRequest = {
    subscribeLastPrice?: {
        action: 'SUBSCRIBE' | 'UNSUBSCRIBE'
        instruments: MarketStreamInstrument[]
    }
    subscribeCandles?: {
        action: 'SUBSCRIBE' | 'UNSUBSCRIBE'
        instruments: MarketStreamCandleInstrument[]
        waitingClose?: boolean
    }
    subscribeOrderBook?: {
        action: 'SUBSCRIBE' | 'UNSUBSCRIBE'
        instruments: MarketStreamOrderBookInstrument[]
    }
    subscribeTrades?: {
        action: 'SUBSCRIBE' | 'UNSUBSCRIBE'
        instruments: MarketStreamInstrument[]
    }
}
