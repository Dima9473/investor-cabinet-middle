import { CandlesRequest } from './market/candlesRequest'
import { LastPricesRequest } from './market/lastPricesRequest'
import { MarketStreamRequest } from './market/marketStreamRequest'
import { OrderBookRequest } from './market/orderBookRequest'
import { OperationsInfo } from './operationsInfo'
import { OperationsRequest } from './operationsRequest'
import { PortfolioRequest } from './portfolioRequest'

export interface IBank {
    getAccountsInfo(): Promise<unknown[]>
    getOperationsByAccountId(body: OperationsRequest): Promise<OperationsInfo | null>
    getOperations(body: OperationsRequest): Promise<OperationsInfo[]>
    getPortfolio(body: PortfolioRequest): Promise<unknown>
    getPositions(body: PortfolioRequest): Promise<unknown>
    getLastPrices(body: LastPricesRequest): Promise<unknown>
    getCandles(body: CandlesRequest): Promise<unknown>
    getOrderBook(body: OrderBookRequest): Promise<unknown>
    streamMarketData(
        body: MarketStreamRequest,
        signal?: AbortSignal,
    ): AsyncGenerator<unknown, void, unknown>
}
