import { BANKS } from '../../../lib/constants/banks'
import { getBankToken } from '../../../lib/constants/banksTokens'
import { IBank } from '../../../types/banks/bank'
import { CandlesRequest } from '../../../types/banks/market/candlesRequest'
import { LastPricesRequest } from '../../../types/banks/market/lastPricesRequest'
import { MarketStreamRequest } from '../../../types/banks/market/marketStreamRequest'
import { OrderBookRequest } from '../../../types/banks/market/orderBookRequest'
import { OperationsInfo } from '../../../types/banks/operationsInfo'
import { OperationsRequest } from '../../../types/banks/operationsRequest'
import { PortfolioRequest } from '../../../types/banks/portfolioRequest'
import { MockBank } from './bankMock'
import { createTBankClient } from './tBank/tBankClient'
import { TBank } from './tBank/tBank'

export class BanksService {
    private bank: IBank | null
    private readonly bankName: BANKS

    constructor(bankName: BANKS) {
        this.bankName = bankName
        this.bank = this.createBank(bankName)
    }

    private createBank(bank: BANKS): IBank | null {
        switch (bank) {
            case BANKS.T_BANK: {
                const token = getBankToken(BANKS.T_BANK)

                if (!token) {
                    throw new Error('Токен T-Bank не задан в secrets/auth.ts')
                }

                return new TBank(createTBankClient(token))
            }
            case BANKS.SBER:
            case BANKS.VTB:
            case BANKS.ALFA:
            case BANKS.GAZPROM:
                return new MockBank(bank)
            default:
                return null
        }
    }

    getAccountsInfo(): Promise<unknown[]> {
        if (!this.bank) {
            throw new Error('Банк не найден')
        }

        return this.bank.getAccountsInfo()
    }

    getOperationsByAccountId(body: OperationsRequest): Promise<OperationsInfo | null> {
        if (!this.bank) {
            throw new Error('Банк не найден')
        }

        return this.bank.getOperationsByAccountId(body)
    }

    /** Агрегация операций по всем банкам — зарезервировано под будущий мультибанковый сценарий */
    async getOperations(body: OperationsRequest): Promise<OperationsInfo[]> {
        const operationsInfo: OperationsInfo[] = []

        for (const bank of Object.values(BANKS)) {
            const currentBank = this.createBank(bank)
            const token = getBankToken(bank)

            if (!currentBank || !token) {
                continue
            }

            const data = await currentBank.getOperationsByAccountId(body)
            if (data) {
                operationsInfo.push(data)
            }
        }

        return operationsInfo
    }

    getBankName(): BANKS {
        return this.bankName
    }

    private ensureBank(): IBank {
        if (!this.bank) {
            throw new Error('Банк не найден')
        }

        return this.bank
    }

    getPortfolio(body: PortfolioRequest): Promise<unknown> {
        return this.ensureBank().getPortfolio(body)
    }

    getPositions(body: PortfolioRequest): Promise<unknown> {
        return this.ensureBank().getPositions(body)
    }

    getLastPrices(body: LastPricesRequest): Promise<unknown> {
        return this.ensureBank().getLastPrices(body)
    }

    getCandles(body: CandlesRequest): Promise<unknown> {
        return this.ensureBank().getCandles(body)
    }

    getOrderBook(body: OrderBookRequest): Promise<unknown> {
        return this.ensureBank().getOrderBook(body)
    }

    streamMarketData(body: MarketStreamRequest, signal?: AbortSignal) {
        return this.ensureBank().streamMarketData(body, signal)
    }
}
