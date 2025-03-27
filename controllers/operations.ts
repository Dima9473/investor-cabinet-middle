import { Context } from "koa";
import HttpStatus from 'http-status'

import { TOKEN } from "../lib/constants/auth";
import { BanksService } from "../utils/services/banks/banksService";

export type OperationsRequest = {
   accountId: string,
   from?: string,
   to?: string,
   state?: string,
   figi?: string
}

export const getOperations = async (ctx: Context) => {
    try {
        const account = <OperationsRequest>ctx.request.body
        const bank: BanksService = ctx.bank

        const operationsInfo = await bank.getOperationsByAccountId(TOKEN, account)
        ctx.body = operationsInfo;
        ctx.response.status = HttpStatus.OK;
    } catch (error: any) {
        ctx.throw(error.status, error.message)
    }
}
