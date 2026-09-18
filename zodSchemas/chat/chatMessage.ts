import { z } from 'zod'

/** Сообщение от клиента — только user и assistant */
export const chatMessageSchema = z.object({
    role: z.enum(['user', 'assistant']),
    content: z
        .string({ required_error: 'content обязателен' })
        .min(1, 'content не может быть пустым')
        .max(4000, 'content не длиннее 4000 символов'),
})
