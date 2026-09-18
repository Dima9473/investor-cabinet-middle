import { Context } from 'koa'
import HttpStatus from 'http-status'

import { CandlesRequest } from '../types/banks/market/candlesRequest'
import { LastPricesRequest } from '../types/banks/market/lastPricesRequest'
import { OrderBookRequest } from '../types/banks/market/orderBookRequest'
import { BanksService } from '../utils/services/banks/banksService'

/** POST /quotes/last-prices */
export const getLastPrices = async (ctx: Context) => {
    try {
        const request = ctx.request.body as LastPricesRequest
        const bank: BanksService = ctx.bank

        ctx.body = await bank.getLastPrices(request)
        ctx.response.status = HttpStatus.OK
    } catch (error: unknown) {
        const err = error as { status?: number; message?: string }
        ctx.throw(err.status ?? 500, err.message ?? 'Internal server error')
    }
}

/** POST /quotes/candles */
export const getCandles = async (ctx: Context) => {
    try {
        const request = ctx.request.body as CandlesRequest
        const bank: BanksService = ctx.bank

        ctx.body = await bank.getCandles(request)
        ctx.response.status = HttpStatus.OK
    } catch (error: unknown) {
        const err = error as { status?: number; message?: string }
        ctx.throw(err.status ?? 500, err.message ?? 'Internal server error')
    }
}

/** POST /quotes/orderbook */
export const getOrderBook = async (ctx: Context) => {
    try {
        const request = ctx.request.body as OrderBookRequest
        const bank: BanksService = ctx.bank

        ctx.body = await bank.getOrderBook(request)
        ctx.response.status = HttpStatus.OK
    } catch (error: unknown) {
        const err = error as { status?: number; message?: string }
        ctx.throw(err.status ?? 500, err.message ?? 'Internal server error')
    }
}
