import { getGigaChatClient } from './gigaChatClient'

/** Проверка OAuth: запрос access token по Authorization key (как в документации Сбера) */
export const verifyGigaChatAuth = async (): Promise<{ ok: true }> => {
    const client = getGigaChatClient()
    await client.updateToken()
    return { ok: true }
}
