import { Agent } from 'node:https'

import GigaChat from 'gigachat'

import { GIGACHAT_MODEL, GIGACHAT_SCOPE } from '../../../lib/constants/gigachat'
import { GIGACHAT_CREDENTIALS } from '../../../secrets/gigachat'

/**
 * OAuth: POST https://ngw.devices.sberbank.ru:9443/api/v2/oauth
 * Authorization: Basic <GIGACHAT_CREDENTIALS>  — префикс Basic добавляет SDK.
 * scope — из GIGACHAT_SCOPE (по умолчанию GIGACHAT_API_PERS).
 *
 * HTTPS-агент: сертификат Сбера может не проходить стандартную проверку CA в Node.js.
 */
const httpsAgent = new Agent({
    rejectUnauthorized: false,
})

let client: GigaChat | null = null

/** Singleton-клиент — ключи остаются только на сервере */
export const getGigaChatClient = (): GigaChat => {
    if (!GIGACHAT_CREDENTIALS) {
        throw new Error('GIGACHAT_CREDENTIALS не задан в secrets/gigachat.ts')
    }

    if (!client) {
        client = new GigaChat({
            credentials: GIGACHAT_CREDENTIALS,
            scope: GIGACHAT_SCOPE,
            model: GIGACHAT_MODEL,
            // Не логируем тела запросов — защита от утечки данных в консоль
            verbose: false,
            httpsAgent,
        })
    }

    return client
}
