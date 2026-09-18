import { z } from 'zod'

import { chatMessageSchema } from '../../zodSchemas/chat/chatMessage'

/** Сообщение диалога (роли user / assistant — system добавляет сервер) */
export type ChatMessage = z.infer<typeof chatMessageSchema>
