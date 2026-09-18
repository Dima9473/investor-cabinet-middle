import { Context } from 'koa'
import HttpStatus from 'http-status'

import { BanksService } from '../utils/services/banks/banksService'

export const getAccounts = async (ctx: Context) => {
    try {
        const bank: BanksService = ctx.bank
        const accountsInfo = await bank.getAccountsInfo()
        ctx.body = accountsInfo
        ctx.response.status = HttpStatus.OK
    } catch (error: unknown) {
        const err = error as { status?: number; message?: string }
        ctx.throw(err.status ?? 500, err.message ?? 'Internal server error')
    }
}
