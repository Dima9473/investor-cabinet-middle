/**
 * Authorization key из Sber AI Studio (раздел «Данные для авторизации»).
 *
 * Это уже готовая Base64-строка (client_id:client_secret), НЕ client_secret отдельно.
 * В HTTP она уходит как: Authorization: Basic <Authorization key>
 * — префикс «Basic » добавляет SDK, в эту константу пишите только key.
 *
 * OAuth (делает пакет gigachat автоматически):
 *   POST https://ngw.devices.sberbank.ru:9443/api/v2/oauth
 *   Header: Authorization: Basic <Authorization key>
 *   Header: RqUID: <uuid>
 *   Body: scope=GIGACHAT_API_PERS
 *
 * @see https://developers.sber.ru/docs/ru/gigachat/quickstart/ind-create-project
 */
export const GIGACHAT_CREDENTIALS = ''
