import Koa from "koa";
import HttpStatus from 'http-status'

import { getUserInfo } from '../utils/services/UserInfo'

export const getUser = async (ctx: Koa.Context, next: Function) => {
    const userName = ctx.params.userName

    try {
        const userInfo = await getUserInfo(userName)
        ctx.body = userInfo;
        ctx.status = HttpStatus.OK;
    } catch {
        ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
        ctx.body = null;
    }
}

