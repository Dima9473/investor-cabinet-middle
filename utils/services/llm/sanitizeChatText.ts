/**
 * Очистка текста пользователя перед отправкой в GigaChat.
 * Убираем явные идентификаторы и секреты, если пользователь вставил их в чат.
 */

const UUID_PATTERN =
    /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gi

const BEARER_PATTERN = /Bearer\s+[A-Za-z0-9._-]+/gi

const LONG_TOKEN_PATTERN = /\b[A-Za-z0-9_-]{32,}\b/g

export const sanitizeChatText = (text: string): string => {
    return text
        .replace(BEARER_PATTERN, '[токен скрыт]')
        .replace(UUID_PATTERN, '[id скрыт]')
        .replace(LONG_TOKEN_PATTERN, '[значение скрыто]')
        .trim()
}
