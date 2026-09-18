import {
    Candle,
    candleIntervalFromJSON,
    GetCandlesRequest,
    GetCandlesResponse,
    GetLastPricesRequest,
    GetLastPricesResponse,
    GetOrderBookRequest,
    GetOrderBookResponse,
    HistoricCandle,
    LastPrice,
    LastPriceType,
    lastPriceTypeFromJSON,
    MarketDataRequest,
    MarketDataResponse,
    Order,
    OrderBook,
    SubscriptionAction,
    subscriptionActionFromJSON,
    subscriptionIntervalFromJSON,
    Trade,
} from '@tinkoff/invest-js'

import { CandlesRequest } from '../../../types/banks/market/candlesRequest'
import { LastPricesRequest } from '../../../types/banks/market/lastPricesRequest'
import {
    MarketStreamCandleInstrument,
    MarketStreamInstrument,
    MarketStreamOrderBookInstrument,
    MarketStreamRequest,
} from '../../../types/banks/market/marketStreamRequest'
import { OrderBookRequest } from '../../../types/banks/market/orderBookRequest'
import { mapDate, mapMoneyValue, mapQuotation } from './sdkMappersCommon'

const mapOrder = (order: Order) => ({
    price: mapQuotation(order.price),
    quantity: String(order.quantity),
})

const mapHistoricCandle = (candle: HistoricCandle) => ({
    open: mapQuotation(candle.open),
    high: mapQuotation(candle.high),
    low: mapQuotation(candle.low),
    close: mapQuotation(candle.close),
    volume: candle.volume,
    time: mapDate(candle.time),
    isComplete: candle.isComplete,
    candleSourceType: candle.candleSourceType,
})

const mapLastPrice = (item: LastPrice) => ({
    figi: item.figi,
    instrumentUid: item.instrumentUid,
    price: mapQuotation(item.price),
    time: mapDate(item.time),
    lastPriceType: item.lastPriceType,
})

/** Запрос клиента → SDK getLastPrices */
export const mapLastPricesRequest = (body: LastPricesRequest): GetLastPricesRequest => ({
    figi: [],
    instrumentId: body.instrumentIds,
    lastPriceType: body.lastPriceType
        ? lastPriceTypeFromJSON(body.lastPriceType)
        : LastPriceType.LAST_PRICE_EXCHANGE,
})

export const mapSdkLastPricesResponse = (response: GetLastPricesResponse) => ({
    lastPrices: response.lastPrices.map(mapLastPrice),
})

/** Запрос клиента → SDK getCandles */
export const mapCandlesRequest = (body: CandlesRequest): GetCandlesRequest => ({
    instrumentId: body.instrumentId,
    from: new Date(body.from),
    to: new Date(body.to),
    interval: candleIntervalFromJSON(body.interval),
    limit: body.limit,
})

export const mapSdkCandlesResponse = (response: GetCandlesResponse) => ({
    candles: response.candles.map(mapHistoricCandle),
})

/** Запрос клиента → SDK getOrderBook */
export const mapOrderBookRequest = (body: OrderBookRequest): GetOrderBookRequest => ({
    instrumentId: body.instrumentId,
    depth: body.depth,
})

export const mapSdkOrderBookResponse = (response: GetOrderBookResponse) => ({
    figi: response.figi,
    instrumentUid: response.instrumentUid,
    depth: response.depth,
    bids: response.bids.map(mapOrder),
    asks: response.asks.map(mapOrder),
    lastPrice: mapQuotation(response.lastPrice),
    closePrice: mapQuotation(response.closePrice),
    limitUp: mapQuotation(response.limitUp),
    limitDown: mapQuotation(response.limitDown),
    lastPriceTs: mapDate(response.lastPriceTs),
    closePriceTs: mapDate(response.closePriceTs),
    orderbookTs: mapDate(response.orderbookTs),
})

const streamAction = (action: 'SUBSCRIBE' | 'UNSUBSCRIBE'): SubscriptionAction =>
    subscriptionActionFromJSON(
        action === 'SUBSCRIBE'
            ? 'SUBSCRIPTION_ACTION_SUBSCRIBE'
            : 'SUBSCRIPTION_ACTION_UNSUBSCRIBE',
    )

const mapStreamInstrument = (item: MarketStreamInstrument) => ({
    instrumentId: item.instrumentId,
    figi: item.figi ?? '',
})

/** Тело HTTP → async-итератор запросов MarketDataStream */
export const buildMarketDataStreamRequests = (
    body: MarketStreamRequest,
): AsyncIterable<MarketDataRequest> => ({
    async *[Symbol.asyncIterator]() {
        if (body.subscribeLastPrice) {
            yield {
                subscribeLastPriceRequest: {
                    subscriptionAction: streamAction(body.subscribeLastPrice.action),
                    instruments: body.subscribeLastPrice.instruments.map(mapStreamInstrument),
                },
            }
        }

        if (body.subscribeCandles) {
            yield {
                subscribeCandlesRequest: {
                    subscriptionAction: streamAction(body.subscribeCandles.action),
                    waitingClose: body.subscribeCandles.waitingClose ?? false,
                    instruments: body.subscribeCandles.instruments.map(
                        (item: MarketStreamCandleInstrument) => ({
                            instrumentId: item.instrumentId,
                            figi: item.figi ?? '',
                            interval: subscriptionIntervalFromJSON(item.interval),
                        }),
                    ),
                },
            }
        }

        if (body.subscribeOrderBook) {
            yield {
                subscribeOrderBookRequest: {
                    subscriptionAction: streamAction(body.subscribeOrderBook.action),
                    instruments: body.subscribeOrderBook.instruments.map(
                        (item: MarketStreamOrderBookInstrument) => ({
                            instrumentId: item.instrumentId,
                            figi: item.figi ?? '',
                            depth: item.depth,
                            orderBookType: 3,
                        }),
                    ),
                },
            }
        }

        if (body.subscribeTrades) {
            yield {
                subscribeTradesRequest: {
                    subscriptionAction: streamAction(body.subscribeTrades.action),
                    tradeSource: 0,
                    instruments: body.subscribeTrades.instruments.map(mapStreamInstrument),
                },
            }
        }
    },
})

const mapStreamCandle = (candle: Candle) => ({
    figi: candle.figi,
    instrumentUid: candle.instrumentUid,
    interval: candle.interval,
    open: mapQuotation(candle.open),
    high: mapQuotation(candle.high),
    low: mapQuotation(candle.low),
    close: mapQuotation(candle.close),
    volume: candle.volume,
    time: mapDate(candle.time),
    lastTradeTs: mapDate(candle.lastTradeTs),
    candleSourceType: candle.candleSourceType,
})

const mapStreamOrderBook = (orderbook: OrderBook | undefined) =>
    orderbook
        ? {
              figi: orderbook.figi,
              instrumentUid: orderbook.instrumentUid,
              depth: orderbook.depth,
              isConsistent: orderbook.isConsistent,
              bids: orderbook.bids.map(mapOrder),
              asks: orderbook.asks.map(mapOrder),
              time: mapDate(orderbook.time),
          }
        : undefined

const mapStreamTrade = (trade: Trade | undefined) =>
    trade
        ? {
              figi: trade.figi,
              instrumentUid: trade.instrumentUid,
              direction: trade.direction,
              price: mapQuotation(trade.price),
              quantity: trade.quantity,
              time: mapDate(trade.time),
              tradeSource: trade.tradeSource,
          }
        : undefined

/** Событие стрима → JSON для SSE (без вложенных SDK-типов) */
export const mapMarketDataStreamResponse = (response: MarketDataResponse) => {
    if (response.lastPrice) {
        return { type: 'lastPrice' as const, payload: mapLastPrice(response.lastPrice) }
    }

    if (response.candle) {
        return { type: 'candle' as const, payload: mapStreamCandle(response.candle!) }
    }

    if (response.orderbook) {
        return { type: 'orderbook' as const, payload: mapStreamOrderBook(response.orderbook) }
    }

    if (response.trade) {
        return { type: 'trade' as const, payload: mapStreamTrade(response.trade) }
    }

    if (response.ping) {
        return { type: 'ping' as const, payload: { time: mapDate(response.ping?.time) } }
    }

    if (response.subscribeLastPriceResponse) {
        return {
            type: 'subscribeLastPrice' as const,
            payload: { trackingId: response.subscribeLastPriceResponse.trackingId },
        }
    }

    if (response.subscribeCandlesResponse) {
        return {
            type: 'subscribeCandles' as const,
            payload: { trackingId: response.subscribeCandlesResponse.trackingId },
        }
    }

    if (response.subscribeOrderBookResponse) {
        return {
            type: 'subscribeOrderBook' as const,
            payload: { trackingId: response.subscribeOrderBookResponse.trackingId },
        }
    }

    if (response.subscribeTradesResponse) {
        return {
            type: 'subscribeTrades' as const,
            payload: { trackingId: response.subscribeTradesResponse.trackingId },
        }
    }

    return { type: 'unknown' as const, payload: {} }
}
