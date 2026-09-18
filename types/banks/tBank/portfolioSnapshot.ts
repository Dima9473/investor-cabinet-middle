/** Снимок портфеля после маппинга SDK (для API и LLM-агрегации) */
export type PortfolioSnapshot = {
    accountId: string
    totalAmountPortfolio: {
        currency: string
        units: string
        nano: number
    }
    expectedYield?: {
        units: string
        nano: number
    }
    dailyYield?: {
        currency: string
        units: string
        nano: number
    }
    dailyYieldRelative?: {
        units: string
        nano: number
    }
    positions: PortfolioPositionSnapshot[]
}

export type PortfolioPositionSnapshot = {
    figi: string
    instrumentType: string
    quantity?: {
        units: string
        nano: number
    }
    currentPrice?: {
        currency: string
        units: string
        nano: number
    }
    expectedYield?: {
        units: string
        nano: number
    }
    instrumentUid: string
    positionUid: string
}
