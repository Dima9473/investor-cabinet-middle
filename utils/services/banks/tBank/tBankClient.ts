import { TTechApiClient } from '@tinkoff/invest-js'

import { TBANK_API_URL } from '../../../../lib/constants/tbank'

/** Фабрика gRPC-клиента T-Bank Invest SDK */
export const createTBankClient = (token: string): TTechApiClient =>
    new TTechApiClient({
        token,
        url: TBANK_API_URL,
    })
