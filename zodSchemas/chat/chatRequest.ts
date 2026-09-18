import { z } from 'zod'

import { chatMessageSchema } from './chatMessage'

/** Контекст портфеля: accountId используется только на сервере, в LLM не попадает */
export const chatPortfolioContextSchema = z.object({
    bankName: z.string().min(1),
    accountId: z.string().min(1),
    from: z.string().optional(),
    to: z.string().optional(),
})

/** Тело POST /chat и POST /chat/stream */
export const chatRequestSchema = z.object({
    messages: z
        .array(chatMessageSchema)
        .min(1, 'Нужно хотя бы одно сообщение')
        .max(30, 'Не более 30 сообщений в истории'),
    portfolioContext: chatPortfolioContextSchema.optional(),
})
