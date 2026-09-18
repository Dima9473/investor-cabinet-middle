import { Context } from 'koa'
import HttpStatus from 'http-status'

import { PortfolioRequest } from '../types/banks/portfolioRequest'
import { BanksService } from '../utils/services/banks/banksService'

/** POST /portfolio — снимок портфеля T-Invest (GetPortfolio) */
export const getPortfolio = async (ctx: Context) => {
    try {
        const request = ctx.request.body as PortfolioRequest
        const bank: BanksService = ctx.bank

        ctx.body = await bank.getPortfolio(request)
        ctx.response.status = HttpStatus.OK
    } catch (error: unknown) {
        const err = error as { status?: number; message?: string }
        ctx.throw(err.status ?? 500, err.message ?? 'Internal server error')
    }
}

/** POST /portfolio/positions — позиции по счёту (GetPositions) */
export const getPositions = async (ctx: Context) => {
    try {
        const request = ctx.request.body as PortfolioRequest
        const bank: BanksService = ctx.bank

        ctx.body = await bank.getPositions(request)
        ctx.response.status = HttpStatus.OK
    } catch (error: unknown) {
        const err = error as { status?: number; message?: string }
        ctx.throw(err.status ?? 500, err.message ?? 'Internal server error')
    }
}
