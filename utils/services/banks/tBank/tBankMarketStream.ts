import { TTechApiClient } from '@tinkoff/invest-js'

import {
    buildMarketDataStreamRequests,
    mapMarketDataStreamResponse,
} from '../../../../adapters/banks/tBank/sdkMappersMarket'
import { MarketStreamRequest } from '../../../../types/banks/market/marketStreamRequest'

/**
 * Прокси bidirectional MarketDataStream → события для SSE.
 * При abort сигнале цикл чтения завершается.
 */
export async function* streamTBankMarketData(
    client: TTechApiClient,
    body: MarketStreamRequest,
    signal?: AbortSignal,
): AsyncGenerator<ReturnType<typeof mapMarketDataStreamResponse>, void, unknown> {
    const requests = buildMarketDataStreamRequests(body)
    const stream = client.marketdataStream.marketDataStream(requests)

    for await (const message of stream) {
        if (signal?.aborted) {
            break
        }

        yield mapMarketDataStreamResponse(message)
    }
}
