import { Context } from 'koa'
import HttpStatus from 'http-status'

import { GIGACHAT_ENABLED } from '../lib/constants/gigachat'
import { mapGigaChatErrorToHttp } from '../utils/errors/mapGigaChatError'
import { verifyGigaChatAuth } from '../utils/services/llm/verifyGigaChatAuth'

/** GET /gigachat/health — проверка получения access token (OAuth) */
export const getGigaChatHealth = async (ctx: Context) => {
    if (!GIGACHAT_ENABLED) {
        ctx.throw(503, 'GigaChat отключён (GIGACHAT_ENABLED=false)')
    }

    try {
        await verifyGigaChatAuth()
        ctx.body = {
            ok: true,
            message: 'Access token получен (OAuth / Basic Authorization key)',
        }
        ctx.status = HttpStatus.OK
    } catch (error: unknown) {
        const mapped = mapGigaChatErrorToHttp(error)
        ctx.throw(mapped.status, mapped.message)
    }
}
