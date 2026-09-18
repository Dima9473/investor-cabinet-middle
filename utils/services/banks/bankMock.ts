import { ConsoleHelper } from '../../../lib/consoleHelper'
import { BANKS } from '../../../lib/constants/banks'
import { IBank } from '../../../types/banks/bank'
import { CandlesRequest } from '../../../types/banks/market/candlesRequest'
import { LastPricesRequest } from '../../../types/banks/market/lastPricesRequest'
import { MarketStreamRequest } from '../../../types/banks/market/marketStreamRequest'
import { OrderBookRequest } from '../../../types/banks/market/orderBookRequest'
import { OperationsInfo } from '../../../types/banks/operationsInfo'
import { OperationsRequest } from '../../../types/banks/operationsRequest'
import { PortfolioRequest } from '../../../types/banks/portfolioRequest'
import { throwBankNotImplemented } from './bankNotImplemented'

export class MockBank implements IBank {
    private bankName: BANKS

    constructor(bank: BANKS) {
        this.bankName = bank
    }

    async getAccountsInfo(): Promise<unknown[]> {
        ConsoleHelper.warn(`${this.bankName} api еще не реализовано`)
        return []
    }

    async getOperationsByAccountId(_body: OperationsRequest): Promise<OperationsInfo | null> {
        ConsoleHelper.warn(`${this.bankName} api еще не реализовано`)
        return null
    }

    async getOperations(_body: OperationsRequest): Promise<OperationsInfo[]> {
        ConsoleHelper.warn(`${this.bankName} api еще не реализовано`)
        return []
    }

    async getPortfolio(_body: PortfolioRequest): Promise<unknown> {
        return throwBankNotImplemented(this.bankName)
    }

    async getPositions(_body: PortfolioRequest): Promise<unknown> {
        return throwBankNotImplemented(this.bankName)
    }

    async getLastPrices(_body: LastPricesRequest): Promise<unknown> {
        return throwBankNotImplemented(this.bankName)
    }

    async getCandles(_body: CandlesRequest): Promise<unknown> {
        return throwBankNotImplemented(this.bankName)
    }

    async getOrderBook(_body: OrderBookRequest): Promise<unknown> {
        return throwBankNotImplemented(this.bankName)
    }

    async *streamMarketData(
        _body: MarketStreamRequest,
        _signal?: AbortSignal,
    ): AsyncGenerator<unknown, void, unknown> {
        throwBankNotImplemented(this.bankName)
    }
}
