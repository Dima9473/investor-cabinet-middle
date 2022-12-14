import Koa from "koa";
import HttpStatus from 'http-status'

import { getUserInfo } from '../utils/services/UserInfo'

export const getUser = async (ctx: Koa.Context) => {
    const userName = ctx.params.userName

    try {
        const userInfo = await getUserInfo(userName)
        ctx.body = userInfo;
        ctx.response.status = HttpStatus.OK;
    } catch (error: any) {
        ctx.throw(error.status, error.message)
    }
}