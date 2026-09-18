import { createReadStream } from 'node:fs'
import { join } from 'node:path'

import { Context } from 'koa'
import HttpStatus from 'http-status'

import { GIGACHAT_ENABLED } from '../lib/constants/gigachat'
import { ChatMessage } from '../types/chat/chatMessage'
import { chatRequestSchema } from '../zodSchemas/chat/chatRequest'
import { mapGigaChatErrorToHttp } from '../utils/errors/mapGigaChatError'
import { loadPortfolioMetricsForChat } from '../utils/services/llm/chatPortfolioContext'
import { completeChat, streamChat } from '../utils/services/llm/chatService'

type ChatRequestBody = {
    messages: ChatMessage[]
    portfolioContext?: {
        bankName: string
        accountId: string
        from?: string
        to?: string
    }
}

const ensureChatEnabled = (ctx: Context): void => {
    if (!GIGACHAT_ENABLED) {
        ctx.throw(503, 'Чат с ИИ отключён (GIGACHAT_ENABLED=false)')
    }
}

/** Подгружает агрегированный контекст портфеля, если клиент передал portfolioContext */
const resolvePortfolioMetrics = async (body: ChatRequestBody) => {
    if (!body.portfolioContext) {
        return null
    }

    return loadPortfolioMetricsForChat(body.portfolioContext)
}

/** POST /chat — ответ целиком */
export const postChat = async (ctx: Context) => {
    ensureChatEnabled(ctx)

    try {
        const body = chatRequestSchema.parse(ctx.request.body) as ChatRequestBody
        const portfolioMetrics = await resolvePortfolioMetrics(body)
        const result = await completeChat(body.messages, portfolioMetrics)

        ctx.body = {
            message: {
                role: 'assistant' as const,
                content: result.content,
            },
            model: result.model,
            portfolioContextUsed: result.portfolioContextUsed,
        }
        ctx.response.status = HttpStatus.OK
    } catch (error: unknown) {
        const err = error as { status?: number; message?: string }

        if (err.status) {
            ctx.throw(err.status, err.message ?? 'Internal server error')
        }

        const mapped = mapGigaChatErrorToHttp(error)
        ctx.throw(mapped.status, mapped.message)
    }
}

/** POST /chat/stream — Server-Sent Events, потоковая выдача */
export const postChatStream = async (ctx: Context) => {
    ensureChatEnabled(ctx)

    const body = chatRequestSchema.parse(ctx.request.body) as ChatRequestBody

    ctx.set({
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
    })
    ctx.status = 200
    ctx.respond = false

    const response = ctx.res

    const writeEvent = (payload: Record<string, unknown>) => {
        response.write(`data: ${JSON.stringify(payload)}\n\n`)
    }

    try {
        const portfolioMetrics = await resolvePortfolioMetrics(body)
        writeEvent({ portfolioContextUsed: Boolean(portfolioMetrics) })

        for await (const delta of streamChat(body.messages, portfolioMetrics)) {
            writeEvent({ delta })
        }

        writeEvent({ done: true })
        response.end()
    } catch (error: unknown) {
        const mapped = mapGigaChatErrorToHttp(error)
        writeEvent({ error: mapped.message })
        response.end()
    }
}

/** GET /chat/ui — демо-страница чата (для разработки) */
export const getChatUi = async (ctx: Context) => {
    const filePath = join(process.cwd(), 'public', 'chat.html')
    ctx.type = 'html'
    ctx.body = createReadStream(filePath)
}
