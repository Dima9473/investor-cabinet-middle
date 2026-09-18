import { Context } from 'koa'
import HttpStatus from 'http-status'

import { BanksService } from '../utils/services/banks/banksService'
import { OperationsRequest } from '../types/banks/operationsRequest'

export type { OperationsRequest } from '../types/banks/operationsRequest'

export const getOperations = async (ctx: Context) => {
    try {
        const account = ctx.request.body as OperationsRequest
        const bank: BanksService = ctx.bank

        const operationsInfo = await bank.getOperationsByAccountId(account)
        ctx.body = operationsInfo
        ctx.response.status = HttpStatus.OK
    } catch (error: unknown) {
        const err = error as { status?: number; message?: string }
        ctx.throw(err.status ?? 500, err.message ?? 'Internal server error')
    }
}
