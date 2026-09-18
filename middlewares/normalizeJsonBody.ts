import { Context, Next } from 'koa'

/**
 * fetch() с телом-строкой часто шлёт Content-Type: text/plain,
 * koa-body тогда кладёт в ctx.request.body строку, а не объект.
 */
export const normalizeJsonBody = async (ctx: Context, next: Next) => {
    const body = ctx.request.body

    if (typeof body !== 'string') {
        return next()
    }

    const trimmed = body.trim()

    if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
        return next()
    }

    try {
        ctx.request.body = JSON.parse(trimmed)
    } catch {
        ctx.throw(400, 'Некорректный JSON в теле запроса')
    }

    return next()
}
