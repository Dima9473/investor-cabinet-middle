import { Context } from "koa";
import HttpStatus from 'http-status'

import { TOKEN } from "../lib/constants/auth";
import { Bank } from "../utils/services/banks/bank";

export const getAccounts = async (ctx: Context) => {
    try {
        const bank: Bank = ctx.bank
        const accountsInfo = await bank.getAccountsInfo(TOKEN)
        ctx.body = accountsInfo;
        ctx.response.status = HttpStatus.OK;
    } catch (error: any) {
        ctx.throw(error.status, error.message)
    }
}
