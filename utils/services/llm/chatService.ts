import { Message } from 'gigachat/interfaces'

import { PortfolioMetrics } from '../../../types/analysis/portfolioMetrics'
import { ChatMessage } from '../../../types/chat/chatMessage'
import { assertSanitizedForLlm } from './assertSanitizedForLlm'
import { getGigaChatClient } from './gigaChatClient'
import { sanitizeChatText } from './sanitizeChatText'

const BASE_SYSTEM_PROMPT = `Ты AI-ассистент инвестиционного кабинета. Помогаешь разбираться с портфелем, типами активов, рисками и общими принципами инвестирования.

Правила:
- Отвечай на русском языке, кратко и по делу.
- Не давай прямых указаний «купить» или «продать» конкретные бумаги.
- Если данных о портфеле нет — отвечай общими рассуждениями и предложи уточнить вопрос.
- Не проси у пользователя токены, пароли, номера счетов и персональные идентификаторы.
- В конце важных ответов напоминай: это не индивидуальная инвестиционная рекомендация.`

const buildSystemContent = (portfolioMetrics?: PortfolioMetrics | null): string => {
    if (!portfolioMetrics) {
        return BASE_SYSTEM_PROMPT
    }

    assertSanitizedForLlm(portfolioMetrics)

    return `${BASE_SYSTEM_PROMPT}

Ниже — агрегированные метрики портфеля пользователя (без идентификаторов счёта и бумаг). Используй их при ответе:
${JSON.stringify(portfolioMetrics)}`
}

/** Собирает массив сообщений для GigaChat */
export const buildGigaChatMessages = (
    history: ChatMessage[],
    portfolioMetrics?: PortfolioMetrics | null,
): Message[] => {
    const messages: Message[] = [
        {
            role: 'system',
            content: buildSystemContent(portfolioMetrics),
        },
    ]

    for (const item of history) {
        messages.push({
            role: item.role,
            content: sanitizeChatText(item.content),
        })
    }

    return messages
}

export type ChatCompletionResult = {
    content: string
    model: string
    portfolioContextUsed: boolean
}

/** Обычный (не потоковый) ответ чата */
export const completeChat = async (
    history: ChatMessage[],
    portfolioMetrics?: PortfolioMetrics | null,
): Promise<ChatCompletionResult> => {
    const lastMessage = history[history.length - 1]

    if (!lastMessage || lastMessage.role !== 'user') {
        throw new Error('Последнее сообщение в истории должно быть от пользователя')
    }

    const client = getGigaChatClient()
    const messages = buildGigaChatMessages(history, portfolioMetrics)

    const response = await client.chat({
        messages,
        temperature: 0.7,
    })

    const content = response.choices[0]?.message?.content

    if (!content) {
        throw new Error('GigaChat вернул пустой ответ')
    }

    return {
        content,
        model: response.model,
        portfolioContextUsed: Boolean(portfolioMetrics),
    }
}

/** Потоковые чанки текста ассистента */
export async function* streamChat(
    history: ChatMessage[],
    portfolioMetrics?: PortfolioMetrics | null,
): AsyncGenerator<string> {
    const lastMessage = history[history.length - 1]

    if (!lastMessage || lastMessage.role !== 'user') {
        throw new Error('Последнее сообщение в истории должно быть от пользователя')
    }

    const client = getGigaChatClient()
    const messages = buildGigaChatMessages(history, portfolioMetrics)

    const stream = await client.stream({
        messages,
        temperature: 0.7,
    })

    for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content

        if (delta) {
            yield delta
        }
    }
}
