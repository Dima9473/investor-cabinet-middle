/** Тело запросов портфеля (GetPortfolio / GetPositions) */
export type PortfolioRequest = {
    accountId: string
    /** Валюта оценки портфеля — только для getPortfolio */
    currency?: 'RUB' | 'USD' | 'EUR'
}
