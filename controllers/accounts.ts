import Koa from "koa";
import HttpStatus from 'http-status'

import { getAccountsInfo } from "../utils/services/Accounts";
import { TOKEN } from "../lib/constants/auth";

export const getAccounts = async (ctx: Koa.Context) => {
    try {
        const accountsInfo = await getAccountsInfo(TOKEN)
        ctx.body = accountsInfo;
        ctx.response.status = HttpStatus.OK;
    } catch (error: any) {
        ctx.throw(error.status, error.message)
    }
}
