/** URL боевого и sandbox API T-Bank Invest */
export const TBANK_PRODUCTION_URL = 'https://invest-public-api.tinkoff.ru'
export const TBANK_SANDBOX_URL = 'https://sandbox-invest-public-api.tinkoff.ru'

/** Режим песочницы: отдельный endpoint и токен */
export const TBANK_USE_SANDBOX = process.env.TBANK_USE_SANDBOX === 'true'

/** Базовый URL API в зависимости от режима */
export const TBANK_API_URL = TBANK_USE_SANDBOX ? TBANK_SANDBOX_URL : TBANK_PRODUCTION_URL
