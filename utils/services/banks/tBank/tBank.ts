import { TTechApiClient } from '@tinkoff/invest-js'

import { adaptBankAccounts } from '../../../../adapters/banks/tBank/accounts'
import {
    mapCandlesRequest,
    mapLastPricesRequest,
    mapOrderBookRequest,
    mapSdkCandlesResponse,
    mapSdkLastPricesResponse,
    mapSdkOrderBookResponse,
} from '../../../../adapters/banks/tBank/sdkMappersMarket'
import {
    mapPortfolioRequest,
    mapPositionsRequest,
    mapSdkPortfolioResponse,
    mapSdkPositionsResponse,
} from '../../../../adapters/banks/tBank/sdkMappersPortfolio'
import {
    mapOperationsRequest,
    mapSdkAccountsResponse,
    mapSdkOperationsResponse,
} from '../../../../adapters/banks/tBank/sdkMappers'
import { adaptBankOperations } from '../../../../adapters/banks/tBank/operations'
import { BANKS } from '../../../../lib/constants/banks'
import { IBank } from '../../../../types/banks/bank'
import { CandlesRequest } from '../../../../types/banks/market/candlesRequest'
import { LastPricesRequest } from '../../../../types/banks/market/lastPricesRequest'
import { MarketStreamRequest } from '../../../../types/banks/market/marketStreamRequest'
import { OrderBookRequest } from '../../../../types/banks/market/orderBookRequest'
import { OperationsInfo } from '../../../../types/banks/operationsInfo'
import { OperationsRequest } from '../../../../types/banks/operationsRequest'
import { PortfolioRequest } from '../../../../types/banks/portfolioRequest'
import { mapGrpcErrorToHttp } from '../../../errors/mapGrpcError'
import { streamTBankMarketData } from './tBankMarketStream'

/** Интеграция с T-Bank через официальный @tinkoff/invest-js SDK */
export class TBank implements IBank {
    constructor(private readonly client: TTechApiClient) {}

    async getAccountsInfo(): Promise<unknown[]> {
        try {
            const response = await this.client.users.getAccounts({})
            const accounts = adaptBankAccounts(mapSdkAccountsResponse(response))

            return accounts ?? []
        } catch (error) {
            const { status, message } = mapGrpcErrorToHttp(error)
            throw Object.assign(new Error(message), { status })
        }
    }

    async getOperationsByAccountId(body: OperationsRequest): Promise<OperationsInfo | null> {
        try {
            const response = await this.client.operations.getOperations(
                mapOperationsRequest(body),
            )
            const operationsInfo = adaptBankOperations(
                mapSdkOperationsResponse(response),
                body.accountId,
                BANKS.T_BANK,
            )

            return operationsInfo
        } catch (error) {
            const { status, message } = mapGrpcErrorToHttp(error)
            throw Object.assign(new Error(message), { status })
        }
    }

    async getOperations(body: OperationsRequest): Promise<OperationsInfo[]> {
        const operationsInfo = await this.getOperationsByAccountId(body)

        return operationsInfo ? [operationsInfo] : []
    }

    async getPortfolio(body: PortfolioRequest): Promise<unknown> {
        try {
            const response = await this.client.operations.getPortfolio(
                mapPortfolioRequest(body),
            )

            return mapSdkPortfolioResponse(response)
        } catch (error) {
            const { status, message } = mapGrpcErrorToHttp(error)
            throw Object.assign(new Error(message), { status })
        }
    }

    async getPositions(body: PortfolioRequest): Promise<unknown> {
        try {
            const response = await this.client.operations.getPositions(
                mapPositionsRequest(body),
            )

            return mapSdkPositionsResponse(response)
        } catch (error) {
            const { status, message } = mapGrpcErrorToHttp(error)
            throw Object.assign(new Error(message), { status })
        }
    }

    async getLastPrices(body: LastPricesRequest): Promise<unknown> {
        try {
            const response = await this.client.marketdata.getLastPrices(
                mapLastPricesRequest(body),
            )

            return mapSdkLastPricesResponse(response)
        } catch (error) {
            const { status, message } = mapGrpcErrorToHttp(error)
            throw Object.assign(new Error(message), { status })
        }
    }

    async getCandles(body: CandlesRequest): Promise<unknown> {
        try {
            const response = await this.client.marketdata.getCandles(
                mapCandlesRequest(body),
            )

            return mapSdkCandlesResponse(response)
        } catch (error) {
            const { status, message } = mapGrpcErrorToHttp(error)
            throw Object.assign(new Error(message), { status })
        }
    }

    async getOrderBook(body: OrderBookRequest): Promise<unknown> {
        try {
            const response = await this.client.marketdata.getOrderBook(
                mapOrderBookRequest(body),
            )

            return mapSdkOrderBookResponse(response)
        } catch (error) {
            const { status, message } = mapGrpcErrorToHttp(error)
            throw Object.assign(new Error(message), { status })
        }
    }

    streamMarketData(body: MarketStreamRequest, signal?: AbortSignal) {
        return streamTBankMarketData(this.client, body, signal)
    }
}
