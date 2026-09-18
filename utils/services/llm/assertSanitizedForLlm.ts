/**
 * Ключи, которые запрещено передавать во внешний LLM (GigaChat).
 * Защита от случайной утечки идентификаторов счёта, бумаг и сделок.
 */
const FORBIDDEN_LLM_KEYS = new Set([
    'accountId',
    'id',
    'figi',
    'instrumentUid',
    'positionUid',
    'assetUid',
    'parentOperationId',
    'tradeId',
    'token',
    'credentials',
    'authorization',
])

/**
 * Рекурсивная проверка: в payload для LLM нет запрещённых полей.
 * Вызывается непосредственно перед отправкой в GigaChat.
 */
export const assertSanitizedForLlm = (payload: unknown, path = 'root'): void => {
    if (payload === null || typeof payload !== 'object') {
        return
    }

    if (Array.isArray(payload)) {
        payload.forEach((item, index) => assertSanitizedForLlm(item, `${path}[${index}]`))
        return
    }

    for (const [key, value] of Object.entries(payload as Record<string, unknown>)) {
        if (FORBIDDEN_LLM_KEYS.has(key)) {
            throw new Error(`Запрещено отправлять поле «${key}» во внешний LLM (${path})`)
        }

        assertSanitizedForLlm(value, `${path}.${key}`)
    }
}
