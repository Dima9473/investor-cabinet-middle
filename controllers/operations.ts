import { Context } from "koa";
import HttpStatus from 'http-status'

import { TOKEN } from "../lib/constants/auth";
import { Bank } from "../utils/services/banks/bank";

type OperationsRequest = {
   accountId: string,
   from?: string,
   to?: string,
   state?: string,
   figi?: string
}

export const getOperations = async (ctx: Context) => {
    try {
        const account = <OperationsRequest>ctx.request.body
        const bank: Bank = ctx.bank

        const operationsInfo = await bank.getOperationsInfo(TOKEN, account)
        ctx.body = operationsInfo;
        ctx.response.status = HttpStatus.OK;
    } catch (error: any) {
        ctx.throw(error.status, error.message)
    }
}
