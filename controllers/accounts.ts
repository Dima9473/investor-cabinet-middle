import { Context } from "koa";
import HttpStatus from 'http-status'

import { TOKEN } from "../lib/constants/auth";
import { BanksService } from "../utils/services/banks/banksService";

export const getAccounts = async (ctx: Context) => {
    try {
        const bank: BanksService = ctx.bank
        const accountsInfo = await bank.getAccountsInfo(TOKEN)
        ctx.body = accountsInfo;
        ctx.response.status = HttpStatus.OK;
    } catch (error: any) {
        ctx.throw(error.status, error.message)
    }
}
