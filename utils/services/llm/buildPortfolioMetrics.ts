import { PortfolioMetrics } from '../../../types/analysis/portfolioMetrics'
import { Operation } from '../../../types/banks/tBank/operation'
import { PortfolioSnapshot } from '../../../types/banks/tBank/portfolioSnapshot'
import { OperationsRequest } from '../../../types/banks/operationsRequest'

type MoneyLike = { units: string; nano: number; currency?: string }
type QuotationLike = { units: string; nano: number }

/** Конвертация MoneyValue (units + nano) в число */
const moneyToNumber = (payment: MoneyLike | undefined): number => {
    if (!payment) {
        return 0
    }

    return Number(payment.units) + payment.nano / 1_000_000_000
}

const quotationToNumber = (value: QuotationLike | undefined): number => {
    if (!value) {
        return 0
    }

    return Number(value.units) + value.nano / 1_000_000_000
}

const incrementCounter = (map: Record<string, number>, key: string): void => {
    map[key] = (map[key] ?? 0) + 1
}

const emptySummary = () => ({
    totalOperations: 0,
    netFlowByCurrency: {} as Record<string, number>,
    byInstrumentType: {} as Record<string, number>,
    byOperationType: {} as Record<string, number>,
})

/**
 * Строит агрегированные метрики из сырых операций.
 * На этом этапе ID счёта и инструментов уже не попадают в результат.
 */
export const buildPortfolioMetrics = (
    operations: Operation[],
    request: OperationsRequest,
): PortfolioMetrics => {
    const netFlowByCurrency: Record<string, number> = {}
    const byInstrumentType: Record<string, number> = {}
    const byOperationType: Record<string, number> = {}

    for (const operation of operations) {
        const currency = operation.currency || operation.payment.currency
        const amount = moneyToNumber(operation.payment)

        netFlowByCurrency[currency] = (netFlowByCurrency[currency] ?? 0) + amount
        incrementCounter(byInstrumentType, operation.instrumentType || 'unknown')
        incrementCounter(byOperationType, operation.type || 'unknown')
    }

    return {
        period: {
            from: request.from,
            to: request.to,
        },
        summary: {
            totalOperations: operations.length,
            netFlowByCurrency,
            byInstrumentType,
            byOperationType,
        },
    }
}

/** Агрегаты из снимка GetPortfolio для LLM (без идентификаторов бумаг) */
const buildPortfolioBlock = (portfolio: PortfolioSnapshot): PortfolioMetrics['portfolio'] => {
    const allocationByInstrumentType: Record<string, number> = {}
    const positionValues: number[] = []

    for (const position of portfolio.positions) {
        const quantity = quotationToNumber(position.quantity)
        const price = moneyToNumber(position.currentPrice)
        const value = quantity * price
        const type = position.instrumentType || 'unknown'

        allocationByInstrumentType[type] = (allocationByInstrumentType[type] ?? 0) + value

        if (value > 0) {
            positionValues.push(value)
        }
    }

    const totalValue = Object.values(allocationByInstrumentType).reduce(
        (sum, value) => sum + value,
        0,
    )

    const allocationPercent: Record<string, number> = {}

    for (const [type, value] of Object.entries(allocationByInstrumentType)) {
        allocationPercent[type] =
            totalValue > 0 ? Math.round((value / totalValue) * 10_000) / 100 : 0
    }

    const largestPosition = positionValues.length > 0 ? Math.max(...positionValues) : 0

    return {
        totalAmountPortfolio: moneyToNumber(portfolio.totalAmountPortfolio),
        totalAmountPortfolioCurrency: portfolio.totalAmountPortfolio.currency,
        expectedYieldPercent: portfolio.expectedYield
            ? quotationToNumber(portfolio.expectedYield)
            : undefined,
        dailyYield: portfolio.dailyYield ? moneyToNumber(portfolio.dailyYield) : undefined,
        dailyYieldCurrency: portfolio.dailyYield?.currency,
        dailyYieldRelativePercent: portfolio.dailyYieldRelative
            ? quotationToNumber(portfolio.dailyYieldRelative)
            : undefined,
        allocationByInstrumentType: allocationPercent,
        positionCount: portfolio.positions.length,
        largestPositionSharePercent:
            totalValue > 0 ? Math.round((largestPosition / totalValue) * 10_000) / 100 : 0,
    }
}

/**
 * Объединяет снимок портфеля T-Invest и (опционально) операции за период.
 */
export const buildPortfolioMetricsFromSnapshot = (
    portfolio: PortfolioSnapshot,
    operations: Operation[] | undefined,
    request: OperationsRequest,
): PortfolioMetrics => {
    const base =
        operations && operations.length > 0
            ? buildPortfolioMetrics(operations, request)
            : {
                  period: { from: request.from, to: request.to },
                  summary: emptySummary(),
              }

    return {
        ...base,
        portfolio: buildPortfolioBlock(portfolio),
    }
}
