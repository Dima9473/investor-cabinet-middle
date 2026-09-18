import { BANKS } from '../../../lib/constants/banks'
import { PortfolioMetrics } from '../../../types/analysis/portfolioMetrics'
import { Operation } from '../../../types/banks/tBank/operation'
import { PortfolioSnapshot } from '../../../types/banks/tBank/portfolioSnapshot'
import { BanksService } from '../banks/banksService'
import { buildPortfolioMetricsFromSnapshot } from './buildPortfolioMetrics'

type PortfolioContextInput = {
    bankName: string
    accountId: string
    from?: string
    to?: string
}

/**
 * Загружает снимок портфеля и операции, возвращает агрегированные метрики для чата.
 * accountId и идентификаторы бумаг в LLM не передаются.
 */
export const loadPortfolioMetricsForChat = async (
    context: PortfolioContextInput,
): Promise<PortfolioMetrics | null> => {
    const bankName = context.bankName as BANKS
    const bank = new BanksService(bankName)

    const request = {
        accountId: context.accountId,
        from: context.from,
        to: context.to,
    }

    try {
        const [portfolioRaw, operationsInfo] = await Promise.all([
            bank.getPortfolio({ accountId: context.accountId }),
            bank.getOperationsByAccountId(request),
        ])

        const portfolio = portfolioRaw as PortfolioSnapshot
        const operations = (operationsInfo?.operations ?? []) as Operation[]

        return buildPortfolioMetricsFromSnapshot(
            portfolio,
            operations.length > 0 ? operations : undefined,
            request,
        )
    } catch {
        return null
    }
}
