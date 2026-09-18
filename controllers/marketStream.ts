import { Context } from 'koa'
import HttpStatus from 'http-status'

import { MarketStreamRequest } from '../types/banks/market/marketStreamRequest'
import { BanksService } from '../utils/services/banks/banksService'

/**
 * POST /quotes/stream — SSE-прокси bidirectional MarketDataStream T-Invest.
 * При закрытии соединения клиентом gRPC-стрим останавливается через AbortSignal.
 */
export const postMarketStream = async (ctx: Context) => {
    const body = ctx.request.body as MarketStreamRequest
    const bank: BanksService = ctx.bank

    ctx.set({
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
    })
    ctx.status = HttpStatus.OK
    ctx.respond = false

    const response = ctx.res
    const abortController = new AbortController()

    const writeEvent = (payload: Record<string, unknown>) => {
        response.write(`data: ${JSON.stringify(payload)}\n\n`)
    }

    ctx.req.on('close', () => {
        abortController.abort()
    })

    try {
        for await (const event of bank.streamMarketData(body, abortController.signal)) {
            writeEvent(event as Record<string, unknown>)
        }

        writeEvent({ done: true })
        response.end()
    } catch (error: unknown) {
        const err = error as { status?: number; message?: string }
        writeEvent({
            error: err.message ?? 'Internal server error',
            status: err.status ?? 500,
        })
        response.end()
    }
}
