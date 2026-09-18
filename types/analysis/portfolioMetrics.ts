/** Агрегированные метрики портфеля — без идентификаторов счёта и инструментов */
export type PortfolioMetrics = {
    period: {
        from?: string
        to?: string
    }
    summary: {
        totalOperations: number
        /** Суммарный денежный поток по валютам (покупки минус продажи, грубо по payment) */
        netFlowByCurrency: Record<string, number>
        /** Количество операций по типу инструмента */
        byInstrumentType: Record<string, number>
        /** Количество операций по типу сделки (buy, sell, dividend и т.д.) */
        byOperationType: Record<string, number>
    }
    /** Метрики из GetPortfolio T-Invest (без figi / uid) */
    portfolio?: {
        totalAmountPortfolio: number
        totalAmountPortfolioCurrency: string
        expectedYieldPercent?: number
        dailyYield?: number
        dailyYieldCurrency?: string
        dailyYieldRelativePercent?: number
        /** Доли по стоимости позиций, % */
        allocationByInstrumentType: Record<string, number>
        positionCount: number
        largestPositionSharePercent: number
    }
}
